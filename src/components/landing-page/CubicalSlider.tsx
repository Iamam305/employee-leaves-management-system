import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CubicalSlider = () => {
  const [currentFace, setCurrentFace] = useState(0);
  const faces = [
    "/dashboard.png",
    "/employee.png"
  ];

  const rotateLeft = () => {
    setCurrentFace((prev) => (prev - 1 + 6) % 6);
  };

  const rotateRight = () => {
    setCurrentFace((prev) => (prev + 1) % 6);
  };

  const getTransform = (index:any) => {
    const rotations = [
      'rotateY(0deg)',
      'rotateY(-90deg)',
      'rotateY(-180deg)',
      'rotateY(-270deg)',
      'rotateX(-90deg)',
      'rotateX(90deg)',
    ];
    return {
      transform: `${rotations[index]} translateZ(100px)`,
    };
  };

  return (
    <div className="w-full h-[300px] flex items-center justify-center perspective-[1000px]">
      <button
        onClick={rotateLeft}
        className="absolute left-4 z-10 bg-white rounded-full p-2 shadow-md"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <div
        className="w-[200px] h-[200px] relative transform-style-3d transition-transform duration-500 ease-in-out"
        style={{
          transform: `rotateY(${currentFace * -90}deg) rotateX(${
            currentFace > 3 ? (currentFace === 4 ? -90 : 90) : 0
          }deg)`,
        }}
      >
        {faces.map((face, index) => (
          <div
            key={face}
            className="w-[70vw] h-full absolute bg-opacity-80 flex items-center justify-center text-2xl font-bold bg-green-200"
            style={{
              ...getTransform(index),
            }}
          >
           <img src={face} alt=""  />
          </div>
        ))}
      </div>
      <button
        onClick={rotateRight}
        className="absolute right-4 z-10 bg-white rounded-full p-2 shadow-md"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default CubicalSlider;