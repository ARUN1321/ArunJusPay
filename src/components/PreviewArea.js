import React, { useState, useEffect, useRef } from "react";

const CENTER = { x: 0, y: 0, rotation: 0 };

const PreviewArea = ({ spirit }) => {
  const [runSignal, setRunSignal] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const [spiritsPositions, setSpiritsPositions] = useState([]); // Store positions of all spirits
  const [spiritFirstAnimationCompleted, setSpiritFirstAnimationCompleted] = useState({}); // Track first animation completion for each spirit
  const [isTracking, setIsTracking] = useState(false); // Track whether we are continuously checking intersections

  const handleRun = () => setRunSignal((r) => r + 1);
  const handleReset = () => {
    setResetSignal((r) => r + 1);
    setIsTracking(false); // Stop tracking when reset is clicked
  };

  const [spiritPaths, setSpiritPaths] = useState(() =>
    Object.fromEntries(spirit.map((s) => [s.name, s.path]))
  );
  
  // Swap animation paths of two spirits
  const swapSpiritPaths = (name1, name2) => {
    setSpiritPaths((prev) => {
      const updated = { ...prev };
      const temp = updated[name1];
      updated[name1] = updated[name2];
      updated[name2] = temp;
      return updated;
    });
  };
  

  // Check for spirits with the same position
  const checkIntersection = () => {
    let intersectingSpirits = [];
    const positionMap = {};

    // Group spirits by their position
    spiritsPositions.forEach((spirit) => {
      const positionKey = `${spirit.x},${spirit.y}`;
      if (!positionMap[positionKey]) {
        positionMap[positionKey] = [];
      }
      positionMap[positionKey].push(spirit.name);
    });

    // Filter out spirits that share the same coordinates
    Object.values(positionMap).forEach((spiritsAtPosition) => {
      if (spiritsAtPosition.length > 1) {
        intersectingSpirits.push(...spiritsAtPosition);
      }
    });

    // Log the spirits that are intersecting
    if (intersectingSpirits.length > 0) {
      console.log(`Spirits intersecting: ${intersectingSpirits.join(", ")}`);
    } else {
      console.log("No spirits intersecting.");
    }
  };

  // Continuously check for intersections if tracking is enabled
  useEffect(() => {
    if (isTracking) {
      checkIntersection(); // Call intersection check directly when positions change
    }
  }, [spiritsPositions, isTracking]);

  useEffect(() => {
    // Only check for intersections after all first animations are complete
    if (Object.values(spiritFirstAnimationCompleted).every((completed) => completed)) {
      setIsTracking(true); // Start tracking after first animation is completed for each spirit
    }
  }, [spiritFirstAnimationCompleted]);

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
            setSpiritsPositions={setSpiritsPositions} // Pass setter to update positions
            spiritsPositions={spiritsPositions} // Pass current positions to check for intersections
            setSpiritFirstAnimationCompleted={setSpiritFirstAnimationCompleted} // Pass setter to track first animation
            spiritFirstAnimationCompleted={spiritFirstAnimationCompleted} // Pass the current state of animation completion
          />
        ))}
      </div>
    </div>
  );
};

const SpiritPreview = ({
  sprite,
  runSignal,
  resetSignal,
  setSpiritsPositions,
  spiritsPositions,
  setSpiritFirstAnimationCompleted,
  spiritFirstAnimationCompleted,
}) => {
  const [position, setPosition] = useState(CENTER);
  const [tooltip, setTooltip] = useState({ text: "", visible: false });
  const [logPosition, setLogPosition] = useState(false); // Track if we should log the position
  const spiritRef = useRef(null); // Reference to the spirit DOM element

  // Start logging position when "Run" is clicked
  useEffect(() => {
    if (runSignal > 0) {
      setLogPosition(true);
    }
  }, [runSignal]);

  // Stop logging position when "Reset" is clicked
  useEffect(() => {
    if (resetSignal > 0) {
      setLogPosition(false);
    }
  }, [resetSignal]);

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
              const newX = prev.x + Math.cos((newRotation * Math.PI) / 180) * 10;
              const newY = prev.y + Math.sin((newRotation * Math.PI) / 180) * 10;
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
              const newX = prev.x + Math.cos((newRotation * Math.PI) / 180) * 10;
              const newY = prev.y + Math.sin((newRotation * Math.PI) / 180) * 10;
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
      blocks.forEach((block, index) => {
        if (block.action?.active === "Repeat") {
          for (let i = 0; i < block.action.count; i++) {
            walkBlocks(block.action.children);
          }
        } else {
          scheduleBlock(block);

          // Track the first animation for each spirit (after first animation)
          if (index === 0) {
            setSpiritFirstAnimationCompleted((prev) => ({
              ...prev,
              [sprite.name]: true,
            }));
          }
        }
      });
    };

    walkBlocks(sprite.path);

    return () => timeouts.forEach(clearTimeout);
  }, [runSignal, sprite, setSpiritFirstAnimationCompleted]);

  useEffect(() => {
    setPosition(CENTER);
    setTooltip({ text: "", visible: false });
  }, [resetSignal]);

  // Log position in real-time when logPosition is true
  useEffect(() => {
    if (logPosition && spiritRef.current) {
      const rect = spiritRef.current.getBoundingClientRect();
      setSpiritsPositions((prevPositions) => [
        ...prevPositions.filter((pos) => pos.name !== sprite.name), // Remove previous position of this spirit
        { name: sprite.name, x: rect.x, y: rect.y }, // Add new position
      ]);
    }
  }, [position, logPosition]); // Only log when position changes and logPosition is true

  return (
    <div
      ref={spiritRef} // Attach the reference here
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
