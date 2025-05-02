import React from "react";
import { actionLists } from "../constants/ActionLists";
import Chip from "./Chip";

export default function Sidebar() {

  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      {actionLists.map((ele) => {
        return (
          <>
            <div className="font-bold"> {ele.title} </div>
            {ele.actions.map((act) => {
              return (
                <Chip
                  func={act.func}
                  item={act}
                  class={act.class}
                  operation={act.operation}
                  type={"insert"}
                />
              );
            })}
          </>
        );
      })}
    </div>
  );
}
