import React, { useState, useEffect } from "react";

const CENTER = { x: 0, y: 0, rotation: 0 };

const PreviewArea = ({ spirit }) => {
  const [runSignal, setRunSignal] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);

  const handleRun = () => setRunSignal((r) => r + 1);
  const handleReset = () => setResetSignal((r) => r + 1);

  return (
    <div className="p-2 w-full h-full flex flex-col">
      <div className="flex gap-4 mb-2">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded shadow"
          onClick={handleRun}
        >
          Run
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded shadow"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {/* Shared preview canvas */}
      <div className="relative flex-1 bg-gray-200 rounded shadow overflow-hidden">
        {spirit.map((sprite, idx) => (
          <SpiritPreview
            key={idx}
            sprite={sprite}
            runSignal={runSignal}
            resetSignal={resetSignal}
          />
        ))}
      </div>
    </div>
  );
};

const SpiritPreview = ({ sprite, runSignal, resetSignal }) => {
  const [position, setPosition] = useState(CENTER);
  const [tooltip, setTooltip] = useState({ text: "", visible: false });

  useEffect(() => {
    let timeouts = [];
    let delay = 0;

    const scheduleBlock = (block) => {
      const { active } = block.action || {};

      const timeout = setTimeout(() => {
        switch (active) {
          case "move":
            setPosition((prev) => ({
              ...prev,
              x: prev.x + (block.action.cord?.x || 0),
              y: prev.y + (block.action.cord?.y || 0),
            }));
            break;
          case "rotateClockWise":
            setPosition((prev) => {
              const newRotation = prev.rotation + block.action.rotate;
              const newX = prev.x + Math.cos((newRotation * Math.PI) / 180) * 10; // Move in direction
              const newY = prev.y + Math.sin((newRotation * Math.PI) / 180) * 10; // Move in direction
              return {
                ...prev,
                rotation: newRotation,
                x: newX,
                y: newY,
              };
            });
            break;
          case "rotateAntiClock":
            setPosition((prev) => {
              const newRotation = prev.rotation - block.action.rotate;
              const newX = prev.x + Math.cos((newRotation * Math.PI) / 180) * 10; // Move in direction
              const newY = prev.y + Math.sin((newRotation * Math.PI) / 180) * 10; // Move in direction
              return {
                ...prev,
                rotation: newRotation,
                x: newX,
                y: newY,
              };
            });
            break;
          case "goToXY":
            setPosition((prev) => ({
              ...prev,
              x: block.action.cord?.x || 0,
              y: block.action.cord?.y || 0,
            }));
            break;
          case "Say":
          case "Think":
            const text = block.action.text;
            const duration = Math.max((block.action.time || 1), 1) * 1000;
            setTooltip({ text, visible: true });
            const hide = setTimeout(() => {
              setTooltip({ text: "", visible: false });
            }, duration);
            timeouts.push(hide);
            break;
          default:
            break;
        }
      }, delay);

      timeouts.push(timeout);
      delay += 600;
    };

    const walkBlocks = (blocks) => {
      blocks.forEach((block) => {
        if (block.action?.active === "Repeat") {
          for (let i = 0; i < block.action.count; i++) {
            walkBlocks(block.action.children);
          }
        } else {
          scheduleBlock(block);
        }
      });
    };

    walkBlocks(sprite.path);

    return () => timeouts.forEach(clearTimeout);
  }, [runSignal]);

  useEffect(() => {
    setPosition(CENTER);
    setTooltip({ text: "", visible: false });
  }, [resetSignal]);

  return (
    <div
      className="absolute transition-transform duration-300"
      style={{
        width: "50px",
        height: "50px",
        transform: `translate(${position.x}px, ${position.y}px) rotate(${position.rotation}deg)`,
      }}
    >
      <img
        src={sprite.url}
        alt={sprite.name}
        className="w-full h-full"
      />
      {tooltip.visible && (
        <div className="absolute top-0 left-0 bg-white px-2 py-1 rounded shadow text-sm whitespace-nowrap">
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

export default PreviewArea;
