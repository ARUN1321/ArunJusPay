import React from "react";
import CatSprite from "./CatSprite";

export default function PreviewArea({ spirit }) {
  console.log(spirit, "Arun123");
  return (
    <div className="flex-none h-full overflow-y-auto p-2">
      {spirit &&
        spirit.map((ele) => {
          return (
            <div
              style={{
                width: 50,
                height: 50,
                backgroundImage: `url(${ele.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          );
        })}
    </div>
  );
}
