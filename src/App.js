import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import { HTML5Backend } from "react-dnd-html5-backend";
import PreviewArea from "./components/PreviewArea";
import CatSprite from "../src/components/CatSprite";
import { DndProvider } from "react-dnd";

export default function App() {
  const sprite = {
    name: "bitcoin",
    url: "https://www.seekpng.com/png/detail/9-92064_sticker-2-bitcoin-store-bitcoin-b.png",
    path: [],
  };
  // const [keyVal, setKeyVal] = useState({ index: -1, block: -1 });
  const [spirit, setSpirit] = useState([sprite]);
  
  const close = (index) =>
    setSpirit((prevSpirits) => prevSpirits.filter((_, i) => i !== index));

  return (
    <DndProvider backend={HTML5Backend}>
      {/* <Context.Provider value={[keyVal, setKeyVal]}> */}
      <div className="bg-blue-100 font-sans">
        <div className="h-screen overflow-hidden flex flex-row  ">
          <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
            <Sidebar spirit={spirit} setSpirit={setSpirit} close={close} />{" "}
            <MidArea />
          </div>
          <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
            <PreviewArea />
          </div>
        </div>
      </div>
      {/* </Context.Provider> */}
    </DndProvider>
  );
}
