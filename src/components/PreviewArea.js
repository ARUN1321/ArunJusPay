import React, { useState, useEffect, useRef } from "react";

const CENTER = { x: 0, y: 0, rotation: 0 };

const PreviewArea = ({ spirit }) => {
  const [localSpirit, setLocalSpirit] = useState(spirit);
  const [runSignal, setRunSignal] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const [spiritsPositions, setSpiritsPositions] = useState([]);
  const [spiritFirstAnimationCompleted, setSpiritFirstAnimationCompleted] = useState({});
  const [isTracking, setIsTracking] = useState(false);

  const handleRun = () => setRunSignal(r => r + 1);
  const handleReset = () => {
    setResetSignal(r => r + 1);
    setIsTracking(false);
    setSpiritFirstAnimationCompleted({});
    setLocalSpirit(spirit);
  };

  function swapPaths(arr, input) {
    const cloned = arr.map(obj => ({ ...obj, path: [...obj.path] }));
    const nameToIndex = {};
    cloned.forEach((obj, idx) => {
      nameToIndex[obj.name] = idx;
    });
    const paths = input.map(name => {
      const idx = nameToIndex[name];
      return idx !== undefined ? cloned[idx].path : null;
    });
    for (let i = 0; i < input.length; i++) {
      const currentName = input[i];
      const nextPath = paths[(i + 1) % input.length];
      const idx = nameToIndex[currentName];
      if (idx !== undefined) {
        cloned[idx].path = nextPath;
      }
    }
    return cloned;
  }

  const checkIntersection = () => {
    const positionMap = {};
    spiritsPositions.forEach(sp => {
      const key = `${sp.x},${sp.y}`;
      if (!positionMap[key]) {
        positionMap[key] = [];
      }
      positionMap[key].push(sp.name);
    });

    const intersectingSpirits = Object.values(positionMap)
      .filter(group => group.length > 1)
      .flat();

    if (intersectingSpirits.length > 0) {
      const updatedSpirits = swapPaths(localSpirit, intersectingSpirits);
      setLocalSpirit(updatedSpirits);
    }
  };

  useEffect(() => {
    if (isTracking) checkIntersection();
  }, [spiritsPositions, isTracking]);

  useEffect(() => {
    if (Object.values(spiritFirstAnimationCompleted).every(Boolean)) {
      setIsTracking(true);
    }
  }, [spiritFirstAnimationCompleted]);

  return (
    <div className="p-2 w-full h-full flex flex-col">
      <div className="flex gap-4 mb-2">
        <button className="bg-green-600 text-white px-4 py-2 rounded shadow" onClick={handleRun}>
          Run
        </button>
        <button className="bg-red-600 text-white px-4 py-2 rounded shadow" onClick={handleReset}>
          Reset
        </button>
      </div>

      <div className="relative flex-1 bg-gray-200 rounded shadow overflow-hidden">
        {localSpirit.map((sprite, idx) => (
          <SpiritPreview
            key={idx}
            sprite={sprite}
            runSignal={runSignal}
            resetSignal={resetSignal}
            setSpiritsPositions={setSpiritsPositions}
            spiritsPositions={spiritsPositions}
            setSpiritFirstAnimationCompleted={setSpiritFirstAnimationCompleted}
            spiritFirstAnimationCompleted={spiritFirstAnimationCompleted}
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
  const [logPosition, setLogPosition] = useState(false);
  const spiritRef = useRef(null);

  useEffect(() => {
    if (runSignal > 0) {
      setLogPosition(true);
    }
  }, [runSignal]);

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

  useEffect(() => {
    if (logPosition && spiritRef.current) {
      const rect = spiritRef.current.getBoundingClientRect();

      setSpiritsPositions((prevPositions) => {
        const updatedPositions = prevPositions.filter((pos) => pos.name !== sprite.name);
        updatedPositions.push({ name: sprite.name, x: rect.x, y: rect.y });
        return updatedPositions;
      });
    }
  }, [position, logPosition]);


  return (
    <div
      ref={spiritRef}
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
