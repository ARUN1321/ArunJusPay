import React, { useState } from "react";
import { actionLists } from "../constants/ActionLists";
import Chip from "./Chip";

export default function Sidebar({ spirit, setSpirit, close, addSpiritAction }) {
  const [selectedSpirit, setSelectedSpirit] = useState();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const handleSpiritSubmit = () => {
    if (!name || !url) return alert("Fill both the Fields.");
    if (spirit.some((spirit) => spirit.name === name))
      return alert("Spirit name already exists!");
    setSpirit((prev) => [...prev, { name, url, path: [] }]);
    setName("");
    setUrl("");
  };

  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <h1 className="text-2xl mb-2 font-bold">CODE</h1>
      {actionLists.map(({ title, actions }) => (
        <div key={title}>
          <div className="font-bold">{title}</div>
          {actions.map((act) => (
            <Chip
              action={act.action}
              operation={act.operation}
              color={act.class}
              type="insert"
            />
          ))}
        </div>
      ))}
      <div style={{ borderTop: "5px solid", marginBottom: "4px" }}>
        <h1 className="text-2xl mb-2 font-bold">SPIRITS</h1>
        <input
          name="spirit_url"
          className="w-full h-10 mb-3 p-1 border-2 rounded-md"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Sprite Img Link"
        />
        <input
          name="spirit_name"
          className="w-full h-10 mb-3 p-1 border-2 rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Sprite Name"
        />
        <button
          className="bg-blue-300 px-2 rounded-md"
          onClick={handleSpiritSubmit}
        >
          Add Spirit
        </button>
      </div>

      <div
        className="rounded-md border-black w-full h-full p-1 border-2 border-dotted"
        style={{
          display: "grid",
          overflowY: "scroll",
          gridTemplateColumns: "auto auto",
          gridTemplateRows: "repeat(auto-fill, 15%)",
          gap: "5px",
        }}
      >
        {spirit.length > 0 ? (
          spirit.map((ele, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedSpirit(index), addSpiritAction(index);
              }}
              className={`w-full h-full rounded-md relative ${
                selectedSpirit === index && "border-2 border-black"
              }`}
              style={{
                backgroundImage: `url(${ele.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h2 className="bg-blue-500 bg-opacity-70 text-center text-white font-bold mt-2 p-1">
                {ele.name}
              </h2>
              <div
                className="h-7 w-7 bg-red-500 text-white font-bold rounded-full flex items-center justify-center absolute cursor-pointer hover:bg-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSpirit();
                  close(index);
                }}
                style={{ top: "-5px", left: "-5px" }}
              >
                X
              </div>
            </div>
          ))
        ) : (
          <div>No Spirits Added</div>
        )}
      </div>
    </div>
  );
}
