import React, { useEffect, useState, useRef } from "react";

const PreviewArea = ({ spirits }) => {
  const previewAreaRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [positions, setPositions] = useState(
    spirits.map(() => ({ x: 0, y: 0 }))
  );
  const [rotations, setRotations] = useState(spirits.map(() => 0));
  const [speech, setSpeech] = useState(
    spirits.map(() => ({ text: "", index: null }))
  );

  useEffect(() => {
    setPositions((prev) => spirits.map((_, i) => prev[i] || { x: 0, y: 0 }));
    setRotations((prev) => spirits.map((_, i) => prev[i] || 0));
    setSpeech((prev) => spirits.map((_, i) => prev[i] || { text: "", index: null }));
  }, [spirits]);

  const runSequence = async () => {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    const runAction = async (action, index) => {
      const previewArea = previewAreaRef.current;
      const previewWidth = previewArea.offsetWidth;
      const previewHeight = previewArea.offsetHeight;

      const clampPosition = (x, y) => {
        const spiritSize = 64;
        const clampedX = Math.min(Math.max(x, 0), previewWidth - spiritSize);
        const clampedY = Math.min(Math.max(y, 0), previewHeight - spiritSize);
        return { x: clampedX, y: clampedY };
      };

      switch (action.active) {
        case "move":
          setPositions((prev) => {
            const newPos = [...prev];
            const newPosClamped = clampPosition(
              prev[index].x + (action.cord?.x || 0),
              prev[index].y + (action.cord?.y || 0)
            );
            newPos[index] = newPosClamped;
            return newPos;
          });
          await delay(500);
          break;

        case "rotateClockWise":
          setRotations((prev) => {
            const newRot = [...prev];
            newRot[index] = prev[index] + (action.rotate || 0);
            return newRot;
          });
          await delay(300);
          break;

        case "rotateAntiClock":
          setRotations((prev) => {
            const newRot = [...prev];
            newRot[index] = prev[index] - (action.rotate || 0);
            return newRot;
          });
          await delay(300);
          break;

        case "goToXY":
          setPositions((prev) => {
            const newPos = [...prev];
            const newPosClamped = clampPosition(action.cord?.x || 0, action.cord?.y || 0);
            newPos[index] = newPosClamped;
            return newPos;
          });
          await delay(500);
          break;

        case "Say":
        case "Think":
          setSpeech((prev) => {
            const newSpeech = [...prev];
            newSpeech[index] = { text: action.text, index };
            return newSpeech;
          });
          await delay((action.time || 1) * 1000);
          setSpeech((prev) => {
            const newSpeech = [...prev];
            newSpeech[index] = { text: "", index: null };
            return newSpeech;
          });
          break;

        case "Repeat":
          for (let i = 0; i < action.count; i++) {
            for (let child of action.children || []) {
              await runAction(child.action, index);
            }
          }
          break;

        default:
          break;
      }
    };

    const promises = spirits.map((spirit, spiritIndex) => {
      return spirit.path.map((action, actionIndex) => {
        return runAction(action.action, spiritIndex);
      });
    });

    await Promise.all(promises.flat());

    setRunning(false);
  };

  const handleRun = () => {
    if (!spirits || spirits.length === 0) return;
    setRunning(true);
    runSequence();
  };

  const handleReset = () => {
    setPositions(spirits.map(() => ({ x: 0, y: 0 })));
    setRotations(spirits.map(() => 0));
    setSpeech(spirits.map(() => ({ text: "", index: null })));
    setRunning(false);
  };

  return (
    <div
      className="p-4 w-full h-full flex flex-col items-center justify-start bg-gray-100 rounded-md relative"
      style={{ overflow: "hidden" }}
      ref={previewAreaRef}
    >
      <div className="mb-4 flex gap-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleRun}
          disabled={running}
        >
          Run
        </button>
        <button
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      <div className="relative w-full h-full flex items-center justify-center">
        {spirits.map((spirit, index) => {
          const pos = positions[index] || { x: 0, y: 0 };
          const rot = rotations[index] || 0;

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(${pos.x}px, ${-pos.y}px)`,
                transition: "transform 0.5s ease",
                width: "64px",
                height: "64px",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  transform: `translate(-50%, -50%) rotate(${rot}deg)`,
                  transformOrigin: "center",
                  backgroundImage:
                    typeof spirit.url === "string" ? `url(${spirit.url})` : undefined,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                }}
              >
                {typeof spirit.url !== "string" ? spirit.url : null}
                {speech[index] && speech[index].text && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "80px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "white",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      whiteSpace: "nowrap",
                      zIndex: 10,
                    }}
                  >
                    {speech[index].text}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PreviewArea;
