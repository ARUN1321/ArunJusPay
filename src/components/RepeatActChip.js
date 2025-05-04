import React, { useState } from "react";
import { useDrop } from "react-dnd";

const RepeatActChip = ({ data, index, spirit, name, updatedData }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "insert",
    drop: (item) => {
      addedRepeatAction(item, name, index);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addedRepeatAction = (data, name, ind) => {
    const newItem = spirit.map((ele) => {
      if (ele.name === name) {
        let a = ele.path;
        a[ind].action.actions.push(data);
        return { ...ele, path: a };
      }
      return ele;
    });
    updatedData(newItem);
    return;
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div>{data.operation}</div>
      <div
        ref={drop}
        draggable={false}
        className={`h-10 w-full ${isOver ? "bg-yellow-100" : ""} rounded-md`}
      >
        {data.action.actions.length != 0 &&
          data.action.actions.map((ele, index) => {
            return (
              <div key={index} className="relative">
                <div
                  style={{ color: "white" }}
                  className={`inline-flex items-center justify-center h-8 ${ele.color} text-white-800 rounded-md px-3 py-2 text-sm font-bold m-1`}
                >
                  {ele.operation}
                  <div
                    className="h-3 w-3 bg-red-500 text-white font-bold rounded-full flex items-center justify-center absolute cursor-pointer hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      //   handleDelete(spiritActs.name, index);
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
  );
};

export default RepeatActChip;
