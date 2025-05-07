import React, { useState } from "react";
import { actionLists } from "../constants/ActionLists";
import Chip from "./Chip";

export default function Sidebar({ spirit, setSpirit, close, addSpiritAction }) {
  const [selectedSpirit, setSelectedSpirit] = useState();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [fileData, setFileData] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileData(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Only SVG files are allowed.");
    }
  };

  const handleSpiritSubmit = () => {
    if (!name || !fileData) return alert("Fill both the fields.");
    if (spirit.some((spirit) => spirit.name === name)) {
      return alert("Spirit name already exists!");
    }

    setSpirit((prev) => [
      ...prev,
      {
        name,
        url: fileData,
        path: [],
      },
    ]);
    setName("");
    setFileData(null);
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
      <div style={{ borderTop: "5px solid", marginBottom: "4px", width: '100%' }}>
        <h1 className="text-2xl mb-2 font-bold">SPIRITS</h1>
        <input
          type="file"
          accept=".svg"
          onChange={handleFileChange}
          className="mb-3 w-full"
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
          gap: "20px",
        }}
      >
        {spirit.length > 0 ? (
          spirit.map((ele, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedSpirit(index);
                addSpiritAction(index);
              }}
              className={`relative rounded-md p-1 cursor-pointer ${selectedSpirit === index ? "border-2 border-black" : ""
                }`}
              style={{
                width: "100%",
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div className="w-[50px] h-[50px]">
                {typeof ele.url === "string" ? (
                  <img
                    src={ele.url}
                    alt={ele.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full">{ele.url}</div>
                )}
              </div>

              {selectedSpirit === index && <div
                className="h-7 w-7 bg-red-500 text-white font-bold rounded-full flex items-center justify-center absolute hover:bg-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSpirit();
                  close(index);
                }}
                style={{ top: "-5px", left: "-5px" }}
              >
                X
              </div>}
            </div>
          ))
        ) : (
          <div>No Spirits Added</div>
        )}
      </div>
    </div>
  );
}
