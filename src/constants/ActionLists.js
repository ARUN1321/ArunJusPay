import React from "react";
import Icon from "../components/Icon";

export const actionLists = [
  {
    title: "Events",
    actions: [
      {
        func: "clickFlag",
        class: "bg-yellow-500",
        operation: (
          <>
            {"When "}
            <Icon name="flag" size={15} className="text-green-600 mx-2" />
            {"clicked"}
          </>
        ),
        onTap: "flag",
      },
      {
        func: "clickSprite",
        class: "bg-yellow-500",
        operation: "When this sprite clicked",
        onTap: "sprite",
      },
    ],
  },
  {
    title: "Motions",
    actions: [
      {
        func: "move",
        class: "bg-blue-500",
        operation: "Move 10 steps",
        action: { x: 200, y: 0, rotate: 0 },
      },
      {
        func: "rotateAntiClock",
        class: "bg-blue-500",
        operation: (
          <>
            {" "}
            {"Turn "}
            <Icon name="undo" size={15} className="text-white mx-2" />
            {"15 degrees"}
          </>
        ),
        action: { x: 0, y: 0, rotate: -90 },
      },
      {
        func: "rotateClockWise",
        class: "bg-blue-500",
        operation: (
          <>
            {"Turn "}
            <Icon name="redo" size={15} className="text-white mx-2" />
            {"15 degrees"}
          </>
        ),
        action: { x: 0, y: 0, rotate: 90 },
      },
      {
        func: "goToXY",
        class: "bg-blue-500",
        operation: "Go to",
        action: { x: 0, y: 0 },
      },
    ],
  },
  {
    title: "Controls",
    actions: [
      {
        func: "Repeat",
        class: "bg-green-500",
        operation: "Repeat",
        array: [],
        repeat: 5,
      },
    ],
  },
];
