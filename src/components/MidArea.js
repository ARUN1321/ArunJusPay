import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";

export default function MidArea({ board, spiritLength, spiritActs, onDrop }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "insert",
    drop: (item) => onDrop(item, spiritActs?.name),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div className="flex-1 h-full overflow-auto p-2 flex items-center justify-center text-center">
      {spiritLength > 0 && spiritActs && (
        <div className="border-2 border-dotted rounded-md border-black w-full h-full bg-blue-50">
          <h1 className="text-2xl mb-2 font-bold">
            <div style={{ display: "flex", flexDirection: "row" }}>
              To add animation to `{spiritActs.name}`, place the code block here{" "}
              {
                <div
                  style={{
                    backgroundImage: `url(${spiritActs?.url})`,
                    backgroundSize: "cover",
                    height: 50,
                    width: 50,
                    backgroundPosition: "center",
                  }}
                />
              }{" "}
            </div>
          </h1>
          <div
            ref={drop}
            draggable={false}
            className={`w-full flex flex-column items-start pt-10 pl-10 ${
              isOver ? "bg-green-100" : ""
            }`}
            style={{ height: "94%", flexDirection: "column" }}
          >
            {board.map((ele) => {
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
      )}
      {spiritLength === 0 && (
        <h1 className="text-2xl mb-2 font-bold">
          Add A Spirit To Add Actions To It.
        </h1>
      )}
      {spiritLength > 0 && spiritActs === undefined && (
        <h1 className="text-2xl mb-2 font-bold">
          Select A Spirit To Add Actions.
        </h1>
      )}
    </div>
  );
}
