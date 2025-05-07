import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import { HTML5Backend } from "react-dnd-html5-backend";
import PreviewArea from "./components/PreviewArea";
import { DndProvider } from "react-dnd";

export default function App() {
  const [spiritActs, setSpiritActs] = useState();
  const [spirit, setSpirit] = useState([
    {
      name: "bitcoin",
      url: "https://www.seekpng.com/png/detail/9-92064_sticker-2-bitcoin-store-bitcoin-b.png",
      path: [],
    },
    {
      name: "cat",
      url: "https://www.seekpng.com/png/detail/21-218274_grenade-granada-pubg-game-jogo-pubg-grenade-png.png",
      path: [],
    },
  ]);

  const addSpiritAction = (index) => {
    setSpiritActs(spirit[index]);
  };

  const close = (index) => {
    if (spiritActs.name == spirit[index].name) {
      setSpiritActs();
    }
    setSpirit((prevSpirits) => prevSpirits.filter((_, i) => i !== index));
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
            {spirit.length > 0 && spiritActs && (
              <MidArea
                spirit={spirit}
                setSpirit={setSpirit}
                spiritActs={spiritActs}
              />
            )}
            {spirit.length === 0 && (
              <div className="flex items-center justify-center w-full h-full">
                <h1 className="text-2xl mb-2 font-bold">
                  Add A Spirit To Add Actions To It.
                </h1>
              </div>
            )}
            {spirit.length > 0 && !spiritActs && (
              <div className="flex items-center justify-center w-full h-full">
                <h1 className="text-2xl mb-2 font-bold">
                  Select A Spirit To Add Actions.
                </h1>
              </div>
            )}
          </div>
          <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
            <PreviewArea spirit={spirit} />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
