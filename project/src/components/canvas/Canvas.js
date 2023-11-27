// import React, { useState } from "react";
// import { Stage, Layer, Line, Circle, Text } from "react-konva";

// const gridSize = 500;
// const unitLength = gridSize / 20; // Assuming the grid has 4x4 units

// export default function APP() {
//   const [points, setPoints] = useState([]);
//   const [lines, setLines] = useState([]);
//   const [currentLine, setCurrentLine] = useState([]);
//   const [nextPointName, setNextPointName] = useState("A");
//   const [angles, setAngles] = useState([]);

//   const getPointName = () => {
//     let name = nextPointName;
//     setNextPointName(String.fromCharCode(name.charCodeAt(0) + 1)); // Increment to next alphabet letter
//     return name;
//   };

//   const onCanvasClick = (e) => {
//     const stage = e.target.getStage();
//     const pointerPosition = stage.getPointerPosition();

//     const newPoint = { x: pointerPosition.x, y: pointerPosition.y };
//     let newPoints = [...points, newPoint];

//     if (newPoints.length >= 3) {
//       const len = newPoints.length;
//       const angle = calculateAngle(
//         newPoints[len - 3],
//         newPoints[len - 2],
//         newPoints[len - 1]
//       );
//       setAngles([...angles, angle]);
//     }

//     setPoints(newPoints);

//     if (newPoints.length % 2 === 0) {
//       setLines([
//         ...lines,
//         [
//           newPoints[newPoints.length - 2].x,
//           newPoints[newPoints.length - 2].y,
//           newPoint.x,
//           newPoint.y,
//         ],
//       ]);
//     }
//   };

//   const drawGrid = () => {
//     let gridLines = [];
//     for (let i = 0; i <= gridSize; i += unitLength) {
//       gridLines.push(
//         <Line
//           key={`v${i}`}
//           points={[i, 0, i, gridSize]}
//           stroke="#ddd"
//           strokeWidth={1}
//         />
//       );
//       gridLines.push(
//         <Line
//           key={`h${i}`}
//           points={[0, i, gridSize, i]}
//           stroke="#ddd"
//           strokeWidth={1}
//         />
//       );
//     }
//     return gridLines;
//   };
//   const calculateAngle = (A, B, C) => {
//     // Calculate angle at point B
//     const angle =
//       Math.atan2(C.y - B.y, C.x - B.x) - Math.atan2(A.y - B.y, A.x - B.x);
//     return Math.abs((angle * 180) / Math.PI).toFixed(2); // Convert to degrees
//   };

//   return (
//     <Stage width={gridSize} height={gridSize} onClick={onCanvasClick}>
//       <Layer>
//         {drawGrid()}
//         {lines.map((line, index) => (
//           <Line
//             key={index}
//             points={line}
//             stroke="blue"
//             strokeWidth={3}
//             lineCap="round"
//           />
//         ))}
//         {points.map((point, index) => (
//           <Circle key={index} x={point.x} y={point.y} radius={5} fill="black" />
//         ))}
//         {points.map((point, index) => (
//           <Text
//             key={index}
//             x={point.x + 5}
//             y={point.y}
//             text={point.name}
//             fontSize={15}
//             fill="black"
//           />
//         ))}
//         {angles.map((angle, index) => (
//           <Text
//             key={`angle${index}`}
//             x={points[index + 1].x}
//             y={points[index + 1].y}
//             text={`${angle}°`}
//             fontSize={15}
//             fill="red"
//           />
//         ))}
//       </Layer>
//     </Stage>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { Stage, Layer, Line, Circle, Text } from "react-konva";

// export default function App() {
//   const gridSize = 500;
//   const cmToPixels = (cm) => cm * 37.795275591; // Convert cm to pixels
//   const fixedLineLength = cmToPixels(5); // 5 cm line

//   const [points, setPoints] = useState([]);
//   const [lines, setLines] = useState([]);
//   const [lineToolActive, setLineToolActive] = useState(false);

//   const toggleLineTool = () => {
//     setLineToolActive(!lineToolActive);
//   };

//   const onCanvasClick = (e) => {
//     if (lineToolActive && points.length % 2 === 0) {
//       const stage = e.target.getStage();
//       const pointerPosition = stage.getPointerPosition();

//       // Create a new line of fixed length
//       const newPoints = [
//         pointerPosition.x,
//         pointerPosition.y,
//         pointerPosition.x + fixedLineLength,
//         pointerPosition.y,
//       ];
//       setLines([...lines, newPoints]);
//       setPoints([
//         ...points,
//         { x: pointerPosition.x, y: pointerPosition.y, name: "A" },
//         {
//           x: pointerPosition.x + fixedLineLength,
//           y: pointerPosition.y,
//           name: "B",
//         },
//       ]);
//     }
//   };

//   const updateLinePoint = (pointIndex, x, y) => {
//     const updatedPoints = points.map((point, index) => {
//       if (index === pointIndex) {
//         return { ...point, x, y };
//       }
//       return point;
//     });
//     setPoints(updatedPoints);

//     // Update lines connected to this point
//     const updatedLines = lines.map((line, index) => {
//       if (index * 2 === pointIndex || index * 2 + 1 === pointIndex) {
//         return pointIndex % 2 === 0
//           ? [x, y, line[2], line[3]]
//           : [line[0], line[1], x, y];
//       }
//       return line;
//     });
//     setLines(updatedLines);
//   };

//   return (
//     <div>
//       <button onClick={toggleLineTool}>
//         {lineToolActive ? "Disable Line Tool" : "Enable Line Tool"}
//       </button>
//       <Stage width={gridSize} height={gridSize} onClick={onCanvasClick}>
//         <Layer>
//           {lines.map((line, index) => (
//             <Line
//               key={index}
//               points={line}
//               stroke="blue"
//               strokeWidth={3}
//               lineCap="round"
//               lineJoin="round"
//             />
//           ))}
//           {points.map((point, index) => (
//             <React.Fragment key={index}>
//               <Circle
//                 x={point.x}
//                 y={point.y}
//                 radius={5}
//                 fill="black"
//                 draggable
//                 onDragMove={(e) =>
//                   updateLinePoint(index, e.target.x(), e.target.y())
//                 }
//               />
//               <Text
//                 x={point.x + 10}
//                 y={point.y}
//                 text={point.name}
//                 fontSize={15}
//                 fill="black"
//               />
//             </React.Fragment>
//           ))}
//         </Layer>
//       </Stage>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { Stage, Layer, Line, Circle, Text } from "react-konva";

// export default function App() {
//   const gridSize = 500;
//   const gridUnit = 25; // Size of each grid cell

//   const [currentLine, setCurrentLine] = useState([]);
//   const [lines, setLines] = useState([]);
//   const [points, setPoints] = useState([]);
//   const [nextPointName, setNextPointName] = useState("A");
//   const [lineDrawingMode, setLineDrawingMode] = useState(false);

//   const toggleLineDrawingMode = () => {
//     setLineDrawingMode(!lineDrawingMode);
//     // Reset current line if mode is turned off
//     if (lineDrawingMode) {
//       setCurrentLine([]);
//     }
//   };

//   const getPointName = () => {
//     let name = nextPointName;
//     setNextPointName(String.fromCharCode(name.charCodeAt(0) + 1)); // Increment to next alphabet letter
//     return name;
//   };

//   const onCanvasClick = (e) => {
//     if (!lineDrawingMode) return;

//     const stage = e.target.getStage();
//     const pointerPosition = stage.getPointerPosition();

//     if (currentLine.length === 0) {
//       // First click - start a new line
//       setCurrentLine([pointerPosition.x, pointerPosition.y]);
//       setPoints([
//         ...points,
//         { x: pointerPosition.x, y: pointerPosition.y, name: getPointName() },
//       ]);
//     } else {
//       // Second click - complete the line
//       setLines([
//         ...lines,
//         [...currentLine, pointerPosition.x, pointerPosition.y],
//       ]);
//       setPoints([
//         ...points,
//         { x: pointerPosition.x, y: pointerPosition.y, name: getPointName() },
//       ]);
//       setCurrentLine([]); // Reset for the next line
//     }
//   };

//   const drawGrid = () => {
//     let gridLines = [];
//     for (let i = 0; i <= gridSize; i += gridUnit) {
//       gridLines.push(
//         <Line
//           key={`v${i}`}
//           points={[i, 0, i, gridSize]}
//           stroke="#ddd"
//           strokeWidth={1}
//         />
//       );
//       gridLines.push(
//         <Line
//           key={`h${i}`}
//           points={[0, i, gridSize, i]}
//           stroke="#ddd"
//           strokeWidth={1}
//         />
//       );
//     }
//     return gridLines;
//   };

//   return (
//     <div>
//       <button onClick={toggleLineDrawingMode}>
//         {lineDrawingMode ? "Disable Line Drawing" : "Enable Line Drawing"}
//       </button>
//       <Stage width={gridSize} height={gridSize} onClick={onCanvasClick}>
//         <Layer>
//           {drawGrid()}
//           {lines.map((line, index) => (
//             <Line
//               key={index}
//               points={line}
//               stroke="blue"
//               strokeWidth={3}
//               lineCap="round"
//               lineJoin="round"
//             />
//           ))}
//           {points.map((point, index) => (
//             <React.Fragment key={index}>
//               <Circle x={point.x} y={point.y} radius={5} fill="black" />
//               <Text
//                 x={point.x + 10}
//                 y={point.y}
//                 text={point.name}
//                 fontSize={15}
//                 fill="black"
//               />
//             </React.Fragment>
//           ))}
//         </Layer>
//       </Stage>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { Stage, Layer, Line, Circle, Text } from "react-konva";

// export default function App() {
//   const gridSize = 500;
//   const gridUnit = 25; // Size of each grid cell
//   const proximityThreshold = 15; // Proximity distance in pixels

//   const [currentLine, setCurrentLine] = useState([]);
//   const [lines, setLines] = useState([]);
//   const [points, setPoints] = useState([]);
//   const [nextPointName, setNextPointName] = useState("A");
//   const [lineDrawingMode, setLineDrawingMode] = useState(false);

//   const toggleLineDrawingMode = () => {
//     setLineDrawingMode(!lineDrawingMode);
//     if (lineDrawingMode) {
//       setCurrentLine([]);
//     }
//   };

//   const getPointName = () => {
//     let name = nextPointName;
//     setNextPointName(String.fromCharCode(name.charCodeAt(0) + 1)); // Increment to next alphabet letter
//     return name;
//   };

//   const isNearby = (x, y) => {
//     for (let point of points) {
//       const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
//       if (distance < proximityThreshold) {
//         return point;
//       }
//     }
//     return null;
//   };

//   const onCanvasClick = (e) => {
//     if (!lineDrawingMode) return;

//     const stage = e.target.getStage();
//     const pointerPosition = stage.getPointerPosition();

//     const nearbyPoint = isNearby(pointerPosition.x, pointerPosition.y);
//     if (nearbyPoint) {
//       if (currentLine.length === 0) {
//         setCurrentLine([nearbyPoint.x, nearbyPoint.y]);
//       } else {
//         setLines([...lines, [...currentLine, nearbyPoint.x, nearbyPoint.y]]);
//         setCurrentLine([]);
//       }
//     } else {
//       const newPoint = {
//         x: pointerPosition.x,
//         y: pointerPosition.y,
//         name: getPointName(),
//       };

//       if (currentLine.length === 0) {
//         setCurrentLine([newPoint.x, newPoint.y]);
//       } else {
//         setLines([...lines, [...currentLine, newPoint.x, newPoint.y]]);
//         setCurrentLine([]);
//       }

//       setPoints([...points, newPoint]);
//     }
//   };

//   const updateLinePoint = (lineIndex, pointIndex, x, y) => {
//     const newLines = lines.map((line, index) => {
//       if (index === lineIndex) {
//         const newLine = [...line];
//         newLine[pointIndex] = x;
//         newLine[pointIndex + 1] = y;
//         return newLine;
//       }
//       return line;
//     });
//     setLines(newLines);
//   };

//   const drawGrid = () => {
//     let gridLines = [];
//     for (let i = 0; i <= gridSize; i += gridUnit) {
//       gridLines.push(
//         <Line
//           key={`v${i}`}
//           points={[i, 0, i, gridSize]}
//           stroke="#ddd"
//           strokeWidth={1}
//         />
//       );
//       gridLines.push(
//         <Line
//           key={`h${i}`}
//           points={[0, i, gridSize, i]}
//           stroke="#ddd"
//           strokeWidth={1}
//         />
//       );
//     }
//     return gridLines;
//   };

//   return (
//     <div>
//       <button onClick={toggleLineDrawingMode}>
//         {lineDrawingMode ? "Disable Line Drawing" : "Enable Line Drawing"}
//       </button>
//       <Stage width={gridSize} height={gridSize} onClick={onCanvasClick}>
//         <Layer>
//           {drawGrid()}
//           {lines.map((line, index) => (
//             <Line
//               key={index}
//               points={line}
//               stroke="blue"
//               strokeWidth={3}
//               lineCap="round"
//               lineJoin="round"
//             />
//           ))}
//           {points.map((point, index) => (
//             <React.Fragment key={index}>
//               <Circle
//                 x={point.x}
//                 y={point.y}
//                 radius={5}
//                 fill="black"
//                 draggable
//                 onDragMove={(e) => {
//                   const pointIndex = index % 2 === 0 ? 0 : 2;
//                   updateLinePoint(
//                     Math.floor(index / 2),
//                     pointIndex,
//                     e.target.x(),
//                     e.target.y()
//                   );
//                 }}
//               />
//               <Text
//                 x={point.x + 10}
//                 y={point.y}
//                 text={point.name}
//                 fontSize={15}
//                 fill="black"
//               />
//             </React.Fragment>
//           ))}
//         </Layer>
//       </Stage>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { Stage, Layer, Line, Circle, Text } from "react-konva";

export default function Canvas() {
  const gridSize = 450;
  const gridUnit = 25;
  const proximityThreshold = 15;

  const [currentLine, setCurrentLine] = useState([]);
  const [lines, setLines] = useState([]);
  const [points, setPoints] = useState([]);
  const [nextPointName, setNextPointName] = useState("A");
  const [lineDrawingMode, setLineDrawingMode] = useState(false);

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
      } else {
        setLines([...lines, [...currentLine, nearbyPoint.x, nearbyPoint.y]]);
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
      } else {
        setLines([...lines, [...currentLine, newPoint.x, newPoint.y]]);
        setCurrentLine([]);
      }

      setPoints([...points, newPoint]);
    }
  };

  const updateLinePoint = (lineIndex, pointIndex, x, y) => {
    const newLines = lines.map((line, index) => {
      if (index === lineIndex) {
        const newLine = [...line];
        newLine[pointIndex] = x;
        newLine[pointIndex + 1] = y;
        return newLine;
      }
      return line;
    });
    setLines(newLines);

    const newPoints = [...points];
    const pointToUpdate = lineIndex * 2 + Math.floor(pointIndex / 2);
    newPoints[pointToUpdate] = { ...newPoints[pointToUpdate], x, y };
    setPoints(newPoints);
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

  return (
    <div>
      <Stage width={gridSize} height={gridSize} onClick={onCanvasClick}>
        <Layer>
          {drawGrid()}
          {lines.map((line, index) => (
            <Line
              key={index}
              points={line}
              stroke="blue"
              strokeWidth={3}
              lineCap="round"
              lineJoin="round"
            />
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
                  updateLinePoint(
                    Math.floor(index / 2),
                    pointIndex,
                    e.target.x(),
                    e.target.y()
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
      <button onClick={toggleLineDrawingMode}>
        {lineDrawingMode ? (
          <Stage width={100} height={50}>
            <Layer>
              <Line points={[10, 20, 15, 20]} stroke="grey" strokeWidth={1} />
            </Layer>
          </Stage>
        ) : (
          <Stage width={50} height={50}>
            <Layer>
              <Line points={[10, 20, 50, 20]} stroke="black" strokeWidth={1} />
            </Layer>
          </Stage>
        )}
      </button>
    </div>
  );
}
