import React, { useState, useEffect } from "react";
import { Stage, Layer, Line, Circle, Text } from "react-konva";
import "./Canvas.css";

export default function Canvas() {
  const gridSize = 450;
  const gridUnit = 25;
  const proximityThreshold = 15;

  const [currentLine, setCurrentLine] = useState([]);
  const [currentPoint, setCurrentPoint] = useState("A");
  const [lines, setLines] = useState([]);
  const [points, setPoints] = useState([]);
  const [nextPointName, setNextPointName] = useState("A");
  const [lineDrawingMode, setLineDrawingMode] = useState(false);
  const [lineLengths, setLineLengths] = useState([]);
  const [linePointMap, setLinePointMap] = useState({});
  const toggleLineDrawingMode = () => {
    setLineDrawingMode(!lineDrawingMode);
    if (lineDrawingMode) {
      setCurrentLine([]);
    }
  };

  const getPointName = () => {
    let name = nextPointName;
    setNextPointName(String.fromCharCode(name.charCodeAt(0) + 1));
    return name;
  };

  const isNearby = (x, y) => {
    for (let point of points) {
      const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
      if (distance < proximityThreshold) {
        return point;
      }
    }
    return null;
  };

  const onCanvasClick = (e) => {
    if (!lineDrawingMode) return;

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    const nearbyPoint = isNearby(pointerPosition.x, pointerPosition.y);
    if (nearbyPoint) {
      if (currentLine.length === 0) {
        setCurrentLine([nearbyPoint.x, nearbyPoint.y]);
        setCurrentPoint(nearbyPoint);
      } else {
        setLines([...lines, [...currentLine, nearbyPoint.x, nearbyPoint.y]]);
        const nearbyArr =
          linePointMap[nearbyPoint.name] &&
          linePointMap[nearbyPoint.name].length
            ? linePointMap[nearbyPoint.name]
            : [];
        const newLinePointMap = { ...linePointMap };
        newLinePointMap[nearbyPoint.name] = [...nearbyArr, [lines.length, 2]];
        const currArr =
          linePointMap[currentPoint.name] &&
          linePointMap[currentPoint.name].length
            ? linePointMap[currentPoint.name]
            : [];
        newLinePointMap[currentPoint.name] = [...currArr, [lines.length, 0]];
        setLinePointMap(newLinePointMap);
        console.log(linePointMap, "Line Point Map");
        setCurrentPoint({});
        setCurrentLine([]);
      }
    } else {
      const newPoint = {
        x: pointerPosition.x,
        y: pointerPosition.y,
        name: getPointName(),
      };

      if (currentLine.length === 0) {
        setCurrentLine([newPoint.x, newPoint.y]);
        setCurrentPoint(newPoint);
      } else {
        setLines([...lines, [...currentLine, newPoint.x, newPoint.y]]);
        const currArr =
          linePointMap[currentPoint.name] &&
          linePointMap[currentPoint.name].length
            ? linePointMap[currentPoint.name]
            : [];
        const newLinePointMap = { ...linePointMap };
        newLinePointMap[currentPoint.name] = [...currArr, [lines.length, 0]];
        const newPointArr =
          linePointMap[newPoint.name] && linePointMap[newPoint.name].length
            ? linePointMap[newPoint.name]
            : [];
        newLinePointMap[newPoint.name] = [...newPointArr, [lines.length, 2]];
        setLinePointMap(newLinePointMap);
        console.log(linePointMap, "Line Point Map");
        setCurrentPoint({});
        setCurrentLine([]);
      }

      setPoints([...points, newPoint]);
    }
  };

  const calculateLength = (x1, y1, x2, y2) => {
    const distancePixels = Math.sqrt(
      Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
    );
    return distancePixels / (gridUnit / 4);
  };

  useEffect(() => {
    const newLengths = lines.map((line) =>
      calculateLength(line[0], line[1], line[2], line[3]).toFixed(2)
    );
    setLineLengths(newLengths);
  }, [lines]);

  const updateLinePoint = (lineIndex, pointIndex, x, y, point) => {
    let newLines = [];
    const pointLines = linePointMap[point.name];
    pointLines?.forEach((l) => {
      const indexLine = l[0];
      const indexPoint = l[1];
      newLines = [...lines];
      newLines[indexLine][indexPoint] = x;
      newLines[indexLine][indexPoint + 1] = y;
    });
    setLines(newLines);
    const newPoints = [...points];
    const pointToUpdate = lineIndex * 2 + Math.floor(pointIndex / 2);
    newPoints[pointToUpdate] = { ...newPoints[pointToUpdate], x, y };
    setPoints(newPoints);

    const updatedLengths = [...lineLengths];
    updatedLengths[lineIndex] = calculateLength(
      newLines[lineIndex][0],
      newLines[lineIndex][1],
      newLines[lineIndex][2],
      newLines[lineIndex][3]
    ).toFixed(2);
    setLineLengths(updatedLengths);
  };
  const drawGrid = () => {
    let gridLines = [];
    for (let i = 0; i <= gridSize; i += gridUnit) {
      gridLines.push(
        <Line
          key={`v${i}`}
          points={[i, 0, i, gridSize]}
          stroke="#ddd"
          strokeWidth={1}
        />
      );
      gridLines.push(
        <Line
          key={`h${i}`}
          points={[0, i, gridSize, i]}
          stroke="#ddd"
          strokeWidth={1}
        />
      );
    }
    return gridLines;
  };
  const clearCanvas = () => {
    setLines([]);
    setPoints([]);
    setLineLengths([]);
    setLinePointMap({});
    setCurrentLine([]);
    setNextPointName("A");
  };

  return (
    <div>
      <Stage width={gridSize} height={gridSize} onClick={onCanvasClick}>
        <Layer>
          {drawGrid()}
          {lines.map((line, index) => (
            <>
              <Line
                key={index}
                points={line}
                stroke="black"
                strokeWidth={2}
                lineCap="round"
                lineJoin="round"
              />
              <Text
                x={(line[0] + line[2]) / 2}
                y={(line[1] + line[3]) / 2}
                text={`${lineLengths[index]} cm`}
                fontSize={12}
                fill="black"
              />
            </>
          ))}
          {points.map((point, index) => (
            <React.Fragment key={index}>
              <Circle
                x={point.x}
                y={point.y}
                radius={5}
                fill="black"
                draggable
                onDragMove={(e) => {
                  const pointIndex = index % 2 === 0 ? 0 : 2;
                  console.log(pointIndex, index, "Index");
                  updateLinePoint(
                    Math.floor(index / 2),
                    pointIndex,
                    e.target.x(),
                    e.target.y(),
                    point
                  );
                }}
              />
              <Text
                x={point.x + 10}
                y={point.y}
                text={point.name}
                fontSize={15}
                fill="black"
              />
            </React.Fragment>
          ))}
        </Layer>
      </Stage>
      <div className="buttons">
        <button onClick={toggleLineDrawingMode} className="lineSelection">
          {lineDrawingMode ? (
            <Stage width={200} height={30}>
              <Layer>
                <Line
                  points={[50, 15, 120, 15]}
                  stroke="black"
                  strokeWidth={1}
                />
                <Circle x="50" y="15" radius={5} fill="black" />
                <Circle x="120" y="15" radius={5} fill="black" />
              </Layer>
            </Stage>
          ) : (
            <Stage width={200} height={30}>
              <Layer>
                <Line
                  points={[50, 15, 120, 15]}
                  stroke="grey"
                  strokeWidth={1}
                />
                <Circle x="50" y="15" radius={5} fill="grey" />
                <Circle x="120" y="15" radius={5} fill="grey" />
              </Layer>
            </Stage>
          )}
        </button>
        <button onClick={clearCanvas} className="clearCanvas">
          Clear Canvas
        </button>
      </div>
    </div>
  );
}
