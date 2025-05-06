import React, { useState, useEffect } from "react";
import Icon from "../components/Icon";

export default function PreviewArea({ spirit }) {
   console.log(spirit,'Arun123')
  const [isAnimating, setIsAnimating] = useState(false);
  const [swappedPaths, setSwappedPaths] = useState({});
  const [animationProgress, setAnimationProgress] = useState({}); // Track the progress for each spirit

  // Generate keyframes from a list of actions
  const generateKeyframes = (actions, name, idx) => {
    let keyframes = [];
    let posX = 0, posY = 0, rotate = 0;
    const REPEAT_WINDOW = 3;
    const processedActions = [];

    // Process actions (repeat handling, etc.)
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
    if (!isAnimating) return; // Skip if animation is not active

    const newSwapped = { ...swappedPaths };

    for (let i = 0; i < spirit.length; i++) {
      for (let j = i + 1; j < spirit.length; j++) {
        const path1 = spirit[i].path;
        const path2 = spirit[j].path;

        const pos1 = path1[0]?.cord || { x: 0, y: 0 };
        const pos2 = path2[0]?.cord || { x: 0, y: 0 };

        const dx = Math.abs(pos1.x - pos2.x);
        const dy = Math.abs(pos1.y - pos2.y);

        // Detect collision
        if (dx < 50 && dy < 50) {
          if (!newSwapped[i] && !newSwapped[j]) {
            console.log(`Collision detected between spirits: ${i} and ${j}`);

            // Swap paths only if they haven't been swapped already
            newSwapped[i] = path2;
            newSwapped[j] = path1;

            // Check the current progress and swap actions from the collision point onward
            const currentProgressI = animationProgress[i] || 0;
            const currentProgressJ = animationProgress[j] || 0;

            newSwapped[i] = [
              ...path2.slice(0, currentProgressI),
              ...path1.slice(currentProgressI),
            ];
            newSwapped[j] = [
              ...path1.slice(0, currentProgressJ),
              ...path2.slice(currentProgressJ),
            ];

            // Update swapped paths with the newly swapped actions
            console.log("Updated swapped paths:", newSwapped);
          }
        }
      }
    }

    setSwappedPaths(newSwapped);
  }, [isAnimating, spirit, animationProgress]); // Re-run when animation starts, spirits or progress changes

  const handleFlagClick = () => {
    setIsAnimating(true);
  };

  const handleStopClick = () => {
    setIsAnimating(false);
    setSwappedPaths({}); // Reset on stop
    setAnimationProgress({}); // Reset animation progress
  };

  // Update animation progress dynamically
  const handleAnimationProgress = (spiritIdx, progress) => {
    setAnimationProgress((prev) => ({
      ...prev,
      [spiritIdx]: progress, // Update progress for each spirit
    }));
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
            const keyframesCSS = generateKeyframes(actions, `spirit-${idx}`, idx);

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
                    animationIterationCount: "infinite",
                    animationDelay: `${animationProgress[idx] || 0}s`, // Apply delay based on progress
                  }}
                  onAnimationIteration={() => {
                    handleAnimationProgress(idx, (animationProgress[idx] || 0) + 1); // Update progress
                  }}
                ></div>
              </React.Fragment>
            );
          })}
      </div>
    </div>
  );
}
