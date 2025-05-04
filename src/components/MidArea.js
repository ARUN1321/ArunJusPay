import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import RepeatActChip from "../components/RepeatActChip";

export default function MidArea({ spirit, setSpirit, spiritActs }) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "insert",
      drop: (item) => {
        handleDrop(item, spirit, spiritActs.name);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [spiritActs.name]
  );

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
    return;
  };

  const handleDelete = (name, index) => {
    const newItem = spirit.map((ele) => {
      if (ele.name === name) {
        let a = ele.path;
        a.splice(index, 1);
        return { ...ele, path: a };
      }
      return ele;
    });
    setSpirit(() => newItem);
    return;
  };

  // const updatedData = (data) => {
  //   console.log(data, "Arun123");
  //   return;
  // };

  return (
    <div className="flex-1 relative h-full overflow-auto p-2 flex items-center justify-center text-center">
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
          {spiritActs.path.map((ele, index) => {
            // const isRepeat = ele.action.active === "Repeat";
            return (
              <div key={index} className="relative">
                <div
                  style={{ color: "white" }}
                  // className={`inline-flex items-center ${
                  //   isRepeat ? "justify-start h-auto" : "justify-center h-8"
                  // } ${
                  //   ele.color
                  // } text-white-800 rounded-md px-3 py-2 text-sm font-bold m-1`}
                  className={`inline-flex items-center justify-center h-8 ${ele.color} text-white-800 rounded-md px-3 py-2 text-sm font-bold m-1`}
                >
                  {/* {isRepeat ? (
                    <RepeatActChip
                      data={ele}
                      index={index}
                      spirit={spirit}
                      name={spiritActs.name}
                      updatedData={updatedData}
                    />
                  ) : ( */}
                  {ele.operation}
                  {/* )} */}
                  {/* Delete button */}
                  <div
                    className="h-3 w-3 bg-red-500 text-white font-bold rounded-full flex items-center justify-center absolute cursor-pointer hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(spiritActs.name, index);
                    }}
                    style={{ fontSize: "8px", top: "-5px", left: "-5px" }}
                  >
                    X
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
