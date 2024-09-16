// import React from "react";

// export const AnimatedSquareBackground = () => {
//   const squareSize = 40;
//   const gridSize = 100;

//   const generateSquares = () => {
//     let squares = [];
//     for (let i = 0; i < gridSize; i++) {
//       for (let j = 0; j < gridSize; j++) {
//         squares.push(
//           <g
//             key={`${i}-${j}`}
//             // transform={`translate(${i * squareSize}, ${j * squareSize})`}
//           >
//             <rect
//               x="0"
//               y="0"
//               width={squareSize}
//               height={squareSize}
//               fill="none"
//               stroke="gray"
//               strokeWidth="1"
//             >
//               <animate
//                 attributeName="stroke-dashoffset"
//                 from={squareSize * 4}
//                 to="0"
//                 dur="4s"
//                 repeatCount="indefinite"
//                 begin={`${(i + j) * 0.1}s`}
//               />
//               <animate
//                 attributeName="stroke-dasharray"
//                 values={`0 ${squareSize * 4}; ${squareSize * 4} 0; ${
//                   squareSize * 4
//                 } ${squareSize * 4}`}
//                 dur="4s"
//                 repeatCount="indefinite"
//                 begin={`${(i + j) * 0.1}s`}
//               />
//             </rect>
//           </g>
//         );
//       }
//     }
//     return squares;
//   };

//   return (
//     <div className="absolute   overflow-hidden w-full h-full flex justify-center items-center m-auto">
//       <svg width="100%" height="100%">
//         {generateSquares()}
//       </svg>
//     </div>
//   );
// };

import React from "react";

export const AnimatedSquareBackground = () => {
  const squareSize = 80;
  const gridSize = 100;

  const generateSquares = () => {
    let squares = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        squares.push(
          <g
            key={`${i}-${j}`}
            transform={`translate(${i * squareSize}, ${j * squareSize})`}
          >
            <rect
              x="0"
              y="0"
              width={squareSize}
              height={squareSize}
              fill="none"
              stroke="gray"
              strokeWidth="1"
            />
          </g>
        );
      }
    }
    return squares;
  };

  return (
    <div className="absolute z-[-1] p-20 overflow-hidden w-full h-full flex justify-center items-center m-auto">
      <svg width="100%" height="100%">
        {generateSquares()}
      </svg>
    </div>
  );
};
