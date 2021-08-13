import "./App.css";
import { useState } from "react";
import { findRenderedDOMComponentWithClass } from "react-dom/cjs/react-dom-test-utils.production.min";

const ROWS = 50;
const COLS = 50;

function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
      rows.push(Array.from(Array(COLS), () => 0));
    }
    return rows;
  });
  console.log(grid);

  const cellStyle = (rowIdx, colIdx) => {
    return {
      width: 20,
      height: 20,
      backgroundColor: grid[rowIdx][colIdx] ? "black" : undefined,
      border: "solid 1px black",
    };
  };
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, 20px)`,
      }}
    >
      {grid.map((row, rowIdx) =>
        row.map((col, colIdx) => (
          <div
            key={`${rowIdx}-${colIdx}`}
            style={cellStyle(rowIdx, colIdx)}
          ></div>
        ))
      )}
    </div>
  );
}

export default App;
