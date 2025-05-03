import React from "react";
import Icon from "../components/Icon";

export const actionLists = [
  {
    title: "Events",
    actions: [
      {
        operation: (
          <>
            {"When "}
            <Icon name="flag" size={15} className="text-green-600 mx-2" />
            {"clicked"}
          </>
        ),
        action: "clickFlag",
        class: "bg-yellow-500",
        onTap: "flag",
      },
      {
        operation: "When this sprite clicked",
        action: "clickSprite",
        class: "bg-yellow-500",
        onTap: "sprite",
      },
    ],
  },
  {
    title: "Motions",
    actions: [
      {
        operation: "Move 10 steps",
        action: "move",
        class: "bg-blue-500",
        action: { x: 200, y: 0, rotate: 0 },
      },
      {
        operation: (
          <>
            {" "}
            {"Turn "}
            <Icon name="undo" size={15} className="text-white mx-2" />
            {"15 degrees"}
          </>
        ),
        action: "rotateAntiClock",
        class: "bg-blue-500",
        action: { x: 0, y: 0, rotate: -90 },
      },
      {
        operation: (
          <>
            {"Turn "}
            <Icon name="redo" size={15} className="text-white mx-2" />
            {"15 degrees"}
          </>
        ),
        action: "rotateClockWise",
        class: "bg-blue-500",
        action: { x: 0, y: 0, rotate: 90 },
      },
      {
        operation: "Go to",
        action: "goToXY",
        class: "bg-blue-500",
        action: { x: 0, y: 0 },
      },
    ],
  },
  {
    title: "Controls",
    actions: [
      {
        operation: "Repeat",
        action: "Repeat",
        class: "bg-green-500",
        array: [],
        repeat: 5,
      },
    ],
  },
];
