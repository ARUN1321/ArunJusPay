import React from "react";
import { useDrop } from "react-dnd";

export default function ActionBlockRenderer({ ele, index, updateInputBlockValue }) {
  const { active, cord = {}, rotate = 0, text = "", time = 2, count = 10 } = ele.action;

  const input = (value, onChange, extra = "") => (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className={`pl-1 text-black w-14 ml-1 mr-1 rounded-md ${extra}`}
    />
  );

  const updateField = (field) => (e) => {
    const val = e.target.value.trim();
    const parsed = Number(val);
    const safeValue = isNaN(parsed) ? 0 : parsed;

    let newValue = field === "text" ? val : safeValue;

    // Disallow negative values for rotate, repeat, and time
    if (
      (["rotateClockWise", "rotateAntiClock"].includes(active) && field === "rotate") ||
      (active === "Repeat" && field === "count") ||
      (["Say", "Think"].includes(active) && field === "time")
    ) {
      newValue = Math.max(0, safeValue);
    }

    updateInputBlockValue(index, {
      [field]: newValue,
    });
  };

  switch (active) {
    case "Start":
    case "ClickSpirit":
      return <>{ele.operation}</>;

    case "move":
      return (
        <>
          Move{" "}
          {input(cord.x ?? 0, (e) =>
            updateInputBlockValue(index, {
              cord: { x: Number(e.target.value) || 0, y: 0 },
            })
          )}{" "}
          steps
        </>
      );

    case "rotateClockWise":
    case "rotateAntiClock":
      return (
        <>
          Turn {active === "rotateClockWise" ? "↻" : "↺"}{" "}
          {input(rotate, updateField("rotate"))} degrees
        </>
      );

    case "goToXY":
      return (
        <>
          Go to x:{" "}
          {input(cord.x ?? 0, (e) =>
            updateInputBlockValue(index, {
              cord: { x: Number(e.target.value) || 0, y: cord.y ?? 0 },
            })
          )}
          and y:{" "}
          {input(cord.y ?? 0, (e) =>
            updateInputBlockValue(index, {
              cord: { x: cord.x ?? 0, y: Number(e.target.value) || 0 },
            })
          )}
        </>
      );

    case "Say":
    case "Think":
      return (
        <>
          {active}
          <input
            type="text"
            value={text}
            onChange={updateField("text")}
            className="ml-1 mr-1 w-24 px-1 text-black rounded"
          />
          for {input(time, updateField("time"))} sec
        </>
      );

    case "Repeat": {
      const [{ isOver }, drop] = useDrop(() => ({
        accept: "chip",
        drop: (item) => {
          const newChildren = [...(ele.children || []), item];
          updateInputBlockValue(index, { children: newChildren });
        },
        collect: (monitor) => ({
          isOver: monitor.isOver(),
        }),
      }));

      return (
        <div className="flex flex-col">
          <div className="flex items-center">
            Repeat
            {input(count, updateField("count"))}
            times
          </div>

          <div
            ref={drop}
            className={`mt-2 ml-2 border-2 border-dashed rounded-md p-2 min-h-[40px] transition-colors ${isOver ? "border-green-500 bg-green-50" : "border-gray-300 bg-white"
              }`}
          >
            {(ele.children || []).length === 0 ? (
              <div className="text-gray-400 text-sm italic">Drop actions here</div>
            ) : (
              ele.children.map((child, childIndex) => (
                <div
                  key={childIndex}
                  className={`inline-flex items-center justify-center h-8 ${child.color || "bg-gray-500"} text-white rounded-md px-3 py-2 text-sm font-bold m-1`}
                >
                  {child.action?.active || child.operation}
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    default:
      return <span>{active}</span>;
  }
}
