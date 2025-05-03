import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import { HTML5Backend } from "react-dnd-html5-backend";
import PreviewArea from "./components/PreviewArea";
import { DndProvider } from "react-dnd";

export default function App() {
  const [spiritActs, setSpiritActs] = useState();
  const [board, setBoard] = useState([]);

  const sprite = {
    name: "bitcoin",
    url: "https://www.seekpng.com/png/detail/9-92064_sticker-2-bitcoin-store-bitcoin-b.png",
    path: [],
  };
  const [spirit, setSpirit] = useState([sprite]);

  const addSpiritAction = (index) => {
    setSpiritActs(spirit[index]);
  };

  const close = (index) => {
    if (spiritActs.name == spirit[index].name) {
      setSpiritActs();
    }
    setSpirit((prevSpirits) => prevSpirits.filter((_, i) => i !== index));
  };

  const handleDrop = (item, name) => {
    board.push(item);
    setBoard([...board])
    
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-blue-100 font-sans">
        <div className="h-screen overflow-hidden flex flex-row  ">
          <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
            <Sidebar
              spirit={spirit}
              setSpirit={setSpirit}
              close={close}
              addSpiritAction={addSpiritAction}
            />{" "}
            <MidArea
              spiritLength={spirit.length}
              spiritActs={spiritActs}
              onDrop={handleDrop}
              board={board}
            />
          </div>
          <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
            <PreviewArea />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
