import React from "react";
import Canvas from "./components/canvas/Canvas";
import TopBar from "./components/topBar/TopBar";
import "./App.css";

export default function App() {
  return (
    <div className="wholeScreen">
      <TopBar />
      <div className="board">
        <Canvas />
      </div>
    </div>
  );
}
