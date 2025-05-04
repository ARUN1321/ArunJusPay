import React, { useState, useEffect } from "react";
import Icon from "../components/Icon";

export default function PreviewArea({ spirit }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [swappedPaths, setSwappedPaths] = useState({});

  // Generate keyframes from a list of actions
  const generateKeyframes = (actions, name) => {
    let keyframes = [];
    let posX = 0, posY = 0, rotate = 0;
    const REPEAT_WINDOW = 3;
    const processedActions = [];

    for (let i = 0; i < actions.length; i++) {
      const act = actions[i];
      if (act.active === "Repeat") {
        const toRepeat = processedActions.slice(-REPEAT_WINDOW);
        for (let r = 0; r < act.count; r++) {
          toRepeat.forEach(repeatAct => {
            processedActions.push({ ...repeatAct });
          });
        }
      } else {
        processedActions.push({ ...act });
      }
    }

    const total = processedActions.length;

    const moveInDirection = (distance, angle) => {
      const radians = (angle * Math.PI) / 180;
      return {
        x: distance * Math.cos(radians),
        y: distance * Math.sin(radians),
      };
    };

    processedActions.forEach((act, index) => {
      const percent = Math.floor((index / total) * 100);

      if (act.active === "move") {
        const { x, y } = moveInDirection(act.cord?.x || 0, rotate);
        posX += x;
        posY += y;
      }

      if (act.active === "rotateClockWise") {
        rotate += act.rotate || 0;
      }

      if (act.active === "rotateAntiClock") {
        rotate -= act.rotate || 0;
      }

      if (act.active === "goTo") {
        posX = act.cord?.x || 0;
        posY = act.cord?.y || 0;
      }

      keyframes.push(`
        ${percent}% {
          transform: translate(${posX}px, ${posY}px) rotate(${rotate}deg);
        }
      `);
    });

    keyframes.push(`
      100% {
        transform: translate(${posX}px, ${posY}px) rotate(${rotate}deg);
      }
    `);

    return `
      @keyframes animate-${name} {
        ${keyframes.join("\n")}
      }
    `;
  };

  // Collision detection and dynamic path swapping
  useEffect(() => {
    const newSwapped = { ...swappedPaths };

    for (let i = 0; i < spirit.length; i++) {
      for (let j = i + 1; j < spirit.length; j++) {
        const path1 = spirit[i].path;
        const path2 = spirit[j].path;

        const pos1 = path1[0]?.cord || { x: 0, y: 0 };
        const pos2 = path2[0]?.cord || { x: 0, y: 0 };

        const dx = Math.abs(pos1.x - pos2.x);
        const dy = Math.abs(pos1.y - pos2.y);

        if (dx < 50 && dy < 50) {
          if (!newSwapped[i] && !newSwapped[j]) {
            newSwapped[i] = path2;
            newSwapped[j] = path1;
          }
        }
      }
    }

    setSwappedPaths(newSwapped);
  }, [spirit]);

  const handleFlagClick = () => {
    setIsAnimating(true);
  };

  const handleStopClick = () => {
    setIsAnimating(false);
    setSwappedPaths({}); // Reset on stop
  };

  return (
    <div className="flex-none h-full w-full overflow-y-auto p-2">
      <div style={{ display: "flex", flexDirection: "row", marginBottom: "5px" }}>
        <div
          className="border-2 border-solid p-1 rounded-md border-none h-5 w-10 bg-yellow-200 hover:bg-yellow-500 mr-1"
          onClick={handleFlagClick}
        >
          <Icon name="flag" size={15} className="text-green-600 mx-2" />
        </div>
        <div
          className="font-bold border-2 border-solid p-1 rounded-md border-none h-5 w-10 bg-red-200 hover:bg-red-600"
          onClick={handleStopClick}
        >
          Stop
        </div>
      </div>

      <div
        className="border-2 border-solid p-1 rounded-md border-black w-full h-full"
        style={{
          height: "97%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {spirit &&
          spirit.map((ele, idx) => {
            const animationName = `animate-spirit-${idx}`;
            const path = swappedPaths[idx] || ele.path;
            const actions = path.map(p => p.action);
            const keyframesCSS = generateKeyframes(actions, `spirit-${idx}`);

            return (
              <React.Fragment key={idx}>
                <style>{keyframesCSS}</style>
                <div
                  className="absolute"
                  style={{
                    width: 50,
                    height: 50,
                    backgroundImage: `url(${ele.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    animation: isAnimating ? `${animationName} 4s linear forwards` : "none",
                  }}
                ></div>
              </React.Fragment>
            );
          })}
      </div>
    </div>
  );
}
