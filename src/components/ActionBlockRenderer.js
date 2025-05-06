import React from "react";
import { useDrop } from "react-dnd";

export default function ActionBlockRenderer({ type = {}, ele, index, updateInputBlockValue }) {
  const { active, cord = {}, rotate = 0, text = "", time = 2, count = 10, children = [] } = ele.action;

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
    const newValue = field === "text" ? val : safeValue;
    updateInputBlockValue(type, index, {
      [field]: newValue,
    });
  };

  const renderChildren = (children) => {
    return children.map((child, childIndex) => (
      <ActionBlockRenderer
        key={childIndex}
        type={{ name: "repeateChild", childIndex }}
        ele={child}
        index={index}
        updateInputBlockValue={updateInputBlockValue}
      />
    ));
  };

  const handleAddChild = (newChild) => {
    const newChildren = [...ele.action.children, newChild];
    updateInputBlockValue(type, index, { children: newChildren });
  };

  switch (active) {
    case "Start":
    case "ClickSpirit":
      return <div>{ele.operation}</div>;

    case "move":
      return (
        <div className={type.name === "repeateChild" ? `inline-flex items-center justify-center h-8 ${ele.color} text-white rounded-md px-3 py-2 text-sm font-bold m-1` : ""}>
          Move
          {input(cord.x ?? 0, (e) =>
            updateInputBlockValue(type, index, {
              cord: { x: Number(e.target.value) || 0, y: 0 },
            })
          )}{" "}
          steps
        </div>
      );

    case "rotateClockWise":
    case "rotateAntiClock":
      return (
        <div className={type.name === "repeateChild" ? `inline-flex items-center justify-center h-8 ${ele.color} text-white rounded-md px-3 py-2 text-sm font-bold m-1` : ""}>
          Turn {active === "rotateClockWise" ? "↻" : "↺"} {input(rotate, updateField("rotate"))} degrees
        </div>
      );

    case "goToXY":
      return (
        <div className={type.name === "repeateChild" ? `inline-flex items-center justify-center h-8 ${ele.color} text-white rounded-md px-3 py-2 text-sm font-bold m-1` : ""}>
          Go to x:{" "}
          {input(cord.x ?? 0, (e) =>
            updateInputBlockValue(type, index, {
              cord: { x: Number(e.target.value) || 0, y: cord.y ?? 0 },
            })
          )}
          and y:{" "}
          {input(cord.y ?? 0, (e) =>
            updateInputBlockValue(type, index, {
              cord: { x: cord.x ?? 0, y: Number(e.target.value) || 0 },
            })
          )}
        </div>
      );

    case "Say":
    case "Think":
      return (
        <div className={type.name === "repeateChild" ? `inline-flex items-center justify-center h-8 ${ele.color} text-white rounded-md px-3 py-2 text-sm font-bold m-1` : ""}>
          {active}
          <input
            type="text"
            value={text}
            onChange={updateField("text")}
            className="ml-1 mr-1 w-24 px-1 text-black rounded"
          />
          for {input(time, updateField("time"))} sec
        </div>
      );

      case "Repeat": {
        const [{ isOver }, drop] = useDrop(() => ({
          accept: "insert",
          drop: (item) => {
            handleAddChild(item);
          },
          collect: (monitor) => ({
            isOver: monitor.isOver(),
          }),
        }));
      
        return (
          <div className={type.name === "repeateChild" ? `inline-flex items-center justify-center ${ele.action.active === 'Repeat' ? 'h-full' : 'h-8'} ${ele.color} text-white rounded-md px-3 py-2 text-sm font-bold m-1` : ""}>
            <div className="flex flex-col">
              <div className="flex items-center">
                Repeat
                {input(count, updateField("count"))}
                times
              </div>
      
              <div
                ref={drop}
                style={{ display: "flex", flexDirection: "column" }}
                className={`mt-2 ml-2 border-2 border-dashed rounded-md p-2 min-h-[40px] transition-colors ${isOver ? "border-green-500 bg-green-50" : "border-gray-300 bg-white"}`}
              >
                {(ele.action.children || []).length === 0 ? (
                  <div className="text-gray-400 text-sm italic">Drop actions here</div>
                ) : (
                  renderChildren(ele.action.children)
                )}
              </div>
            </div>
          </div>
        );
      }      

    default:
      return <span>{active}</span>;
  }
}
