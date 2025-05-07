import React, { useState } from "react";
import { actionLists } from "../constants/ActionLists";
import Chip from "./Chip";

export default function Sidebar({ spirit, setSpirit, close, addSpiritAction }) {
  const [selectedSpirit, setSelectedSpirit] = useState();
  const [name, setName] = useState("");
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
    if (spirit.some((sp) => sp.name === name)) {
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
        <div key={title} className="mb-4 w-full">
          <div className="font-bold mb-1">{title}</div>
          {actions.map((act, idx) => (
            <Chip
              key={idx}
              action={act.action}
              operation={act.operation}
              color={act.class}
              type="insert"
            />
          ))}
        </div>
      ))}

      <div className="border-t-4 w-full mb-4 pt-3">
        <h1 className="text-2xl font-bold mb-2">SPIRITS</h1>

        <label className="block mb-2 text-blue-600 underline cursor-pointer">
          Upload SVG
          <input
            type="file"
            accept=".svg"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {fileData && (
          <img
           style={{width: '100px', height:'100px'}}
            src={fileData}
            alt="Preview"
            className="object-contain mb-3 border mx-auto"
          />
        )}

        <input
          name="spirit_name"
          className="w-full h-10 mb-3 p-2 border-2 rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Sprite Name"
        />

        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded mb-4"
          onClick={handleSpiritSubmit}
        >
          Add Spirit
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[300px] w-full p-1 border-2 border-dotted rounded-md">
        {spirit.length > 0 ? (
          spirit.map((ele, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedSpirit(index);
                addSpiritAction(index);
              }}
              className={`relative rounded-md p-1 cursor-pointer flex items-center justify-center h-20 ${
                selectedSpirit === index ? "border-2 border-black" : ""
              }`}
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

              {selectedSpirit === index && (
                <div
                  className="h-6 w-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center absolute -top-2 -left-2 cursor-pointer hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSpirit();
                    close(index);
                  }}
                >
                  X
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-500">
            No Spirits Added
          </div>
        )}
      </div>
    </div>
  );
}
