import React, { useState, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import { HTML5Backend } from "react-dnd-html5-backend";
import PreviewArea from "./components/PreviewArea";
import { DndProvider } from "react-dnd";
import CatSprite from './components/CatSprite';
import DogSprite from './components/DogSprite';

export default function App() {
  const [spiritActs, setSpiritActs] = useState(null);
  const [spirit, setSpirit] = useState([
    {
      name: "Cat",
      url: <CatSprite width="95" height="100" />,
      path: [],
    },
    {
      name: "Dog",
      url: <DogSprite width="95" height="100" />,
      path: [],
    },
  ]);

  const addSpiritAction = useCallback((index) => {
    setSpiritActs(spirit[index]);
  }, [spirit]);

  const close = useCallback((index) => {
    if (spiritActs?.name === spirit[index].name) {
      setSpiritActs(null);
    }
    setSpirit((prev) => prev.filter((_, i) => i !== index));
  }, [spirit, spiritActs]);

  let mainContent;
  if (spirit.length === 0) {
    mainContent = (
      <div className="flex items-center justify-center w-full h-full">
        <h1 className="text-2xl font-bold">Add A Spirit To Add Actions To It.</h1>
      </div>
    );
  } else if (spiritActs) {
    mainContent = (
      <MidArea spirit={spirit} setSpirit={setSpirit} spiritActs={spiritActs} />
    );
  } else {
    mainContent = (
      <div className="flex items-center justify-center w-full h-full">
        <h1 className="text-2xl font-bold">Select A Spirit To Add Actions.</h1>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-blue-100 font-sans">
        <div className="h-screen overflow-hidden flex flex-row">
          <div className="flex-1 h-full overflow-hidden flex bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
            <Sidebar
              spirit={spirit}
              setSpirit={setSpirit}
              close={close}
              addSpiritAction={addSpiritAction}
            />
            {mainContent}
          </div>
          <div className="w-1/3 h-full overflow-hidden flex bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
            <PreviewArea spirits={spirit} />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
