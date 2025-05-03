import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";

export default function MidArea({ spirit, setSpirit, spiritActs }) {

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "insert",
    drop: (item) => {
      handleDrop(item, spirit, spiritActs.name);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }),[spiritActs.name]);

  const handleDrop = (item, spirit, name) => {
    const newItem = spirit.map((ele) => {
      if (ele.name === name) {
        let a = ele.path;
        a.push(item);
        return { ...ele, path: a };
      }
      return ele;
    });
    setSpirit(() => newItem);
  };

  return (
    <div className="flex-1 h-full overflow-auto p-2 flex items-center justify-center text-center">
      <div className="border-2 border-dotted rounded-md border-black w-full h-full bg-blue-50">
        <div className="flex items-center justify-center w-full mb-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-center">
              To add animation to `{spiritActs.name}`, place the code block here
            </h1>
            <div
              style={{
                backgroundImage: `url(${spiritActs?.url})`,
                backgroundSize: "cover",
                height: 50,
                width: 50,
                backgroundPosition: "center",
                borderRadius: "0.5rem",
              }}
            />
          </div>
        </div>

        <div
          ref={drop}
          draggable={false}
          className={`w-full flex flex-column items-start pt-10 pl-10 ${
            isOver ? "bg-green-100" : ""
          }`}
          style={{ height: "94%", flexDirection: "column" }}
        >
          {spiritActs.path.map((ele) => {
            return (
              <div
                style={{ color: "white" }}
                className={`inline-flex items-center justify-center ${ele.color} text-white-800 rounded-md px-3 py-2 text-sm font-bold m-1 h-8`}
              >
                {ele.operation}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
