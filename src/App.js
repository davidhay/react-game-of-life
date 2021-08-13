import React, { useState, useCallback, useRef } from "react";
import produce from "immer";

const ROWS = 50;
const COLS = 50;

const OPERATIONS = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push(Array.from(Array(COLS), () => 0));
  }

  return rows;
};

const App = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let rowIdx = 0; rowIdx < ROWS; rowIdx++) {
          for (let colIdx = 0; colIdx < COLS; colIdx++) {
            let neighbors = 0;
            OPERATIONS.forEach(([rDiff, cDiff]) => {
              const newR = rowIdx + rDiff;
              const newC = colIdx + cDiff;
              if (newR >= 0 && newR < ROWS && newC >= 0 && newC < COLS) {
                neighbors += g[newR][newC];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[rowIdx][colIdx] = 0;
            } else if (g[rowIdx][colIdx] === 0 && neighbors === 3) {
              gridCopy[rowIdx][colIdx] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 250);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "stop" : "start"}
      </button>
      <button
        onClick={() => {
          const rows = [];
          for (let i = 0; i < ROWS; i++) {
            rows.push(
              Array.from(Array(COLS), () => (Math.random() > 0.7 ? 1 : 0))
            );
          }

          setGrid(rows);
        }}
      >
        random
      </button>
      <button
        onClick={() => {
          setGrid(generateEmptyGrid());
        }}
      >
        clear
      </button>
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
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[rowIdx][colIdx] = grid[rowIdx][colIdx] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[rowIdx][colIdx] ? "black" : undefined,
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
    </>
  );
};

export default App;
