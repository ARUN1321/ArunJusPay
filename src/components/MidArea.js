import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import ActionBlockRenderer from "../components/ActionBlockRenderer";

export default function MidArea({ spirit, setSpirit, spiritActs }) {
  const [updatedPath, setUpdatedPath] = useState([...spiritActs?.path]);

  useEffect(() => {
    setUpdatedPath([...spiritActs?.path]);
  }, [spiritActs]);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "insert",
      drop: (item, monitor) => {
        if (monitor.didDrop()) return;
        setUpdatedPath((prev) => [...prev, item]);
      },
      collect: (monitor) => ({ isOver: !!monitor.isOver() }),
    }),
    [spiritActs]
  );

  const updateBlockValue = () => {
    setSpirit(spirit.map((ele) =>
      ele.name === spiritActs.name ? { ...ele, path: updatedPath } : ele
    ));
  };

  const updateInputBlockValue = (type, index, updatedFields) => {
    setUpdatedPath((prev) => {
      const newPath = [...prev];

      const target = JSON.parse(JSON.stringify(newPath[index]));

      if (type && type.name === "repeateChild") {
        target.action.children[type.childIndex].action = { ...target.action.children[type.childIndex].action, ...updatedFields };
      } else {
        if (updatedFields.children && target.action.children) {
          target.action.children = [
            ...target.action.children,
            ...updatedFields.children,
          ];
        } else {
          target.action = { ...target.action, ...updatedFields };
        }
      }

      newPath[index] = target;
      return newPath;
    });
  };


  const handleDelete = (index) =>
    setUpdatedPath((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="flex-1 relative h-full overflow-auto p-2 flex items-center justify-center text-center" style={{ overflow: 'hidden' }}>
      <div className="border-2 border-dotted rounded-md border-black w-full h-full bg-blue-50">
        <div className="flex items-center justify-center w-full mb-2 gap-2">
          <h1 className="text-2xl font-bold text-center">
            To add animation to `{spiritActs.name}`, place the code block here
          </h1>
          <button className="bg-blue-300 px-2 rounded-md" onClick={updateBlockValue}>
            Click to update actions for {spiritActs.name}
          </button>
          <div
            className="h-[50px] w-[50px] rounded-md bg-center bg-cover"
            style={{ backgroundImage: `url(${spiritActs?.url})` }}
          />
        </div>

        <div
          ref={drop}
          className={`w-full flex flex-col items-start pt-10 pl-10 ${isOver ? "bg-green-100" : ""}`}
          style={{ height: "94%", overflow: 'scroll' }}
        >
          {updatedPath.map((ele, index) => (
            <div key={index} className="relative mt-1 mb-1">
              <div className={`inline-flex items-center justify-center ${ele.action.active === 'Repeat' ? 'h-full' : 'h-8'} ${ele.color} text-white rounded-md px-3 py-2 text-sm font-bold m-1`}>
                <ActionBlockRenderer
                  ele={ele}
                  index={index}
                  updateInputBlockValue={updateInputBlockValue}
                />
                <div
                  className="h-3 w-3 bg-red-500 text-white font-bold rounded-full flex items-center justify-center absolute cursor-pointer hover:bg-red-600"
                  onClick={() => handleDelete(index)}
                  style={{ fontSize: "8px", top: "-5px", left: "-5px" }}
                >
                  X
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
