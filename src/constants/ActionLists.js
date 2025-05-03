import React from "react";
import Icon from "../components/Icon";

export const actionLists = [
  {
    title: "Events",
    actions: [
      {
        id: 0,
        operation: (
          <>
            {"When "}
            <Icon name="flag" size={15} className="text-green-600 mx-2" />
            {"clicked"}
          </>
        ),
        action: { active: "Start" },
        class: "bg-yellow-500",
        onTap: "flag",
      },
      {
        id: 1,
        operation: "When this sprite clicked",
        action: { active: "ClickSpirit" },
        class: "bg-yellow-500",
        onTap: "sprite",
      },
    ],
  },
  {
    title: "Motions",
    actions: [
      {
        id: 0,
        operation: (
          <>
            {"Move  "}{" "}
            <input
              value={10}
              className="pl-1 text-black w-10 ml-1 mr-1 rounded-md"
            />{" "}
            {"  steps"}
          </>
        ),
        action: "move",
        class: "bg-blue-500",
        action: { active: "move", cord: { x: 10, y: 0 } },
      },
      {
        id: 2,
        operation: (
          <>
            {"Turn "}
            <Icon name="redo" size={15} className="text-white mx-2" />
            <input
              value={15}
              className="pl-1 text-black w-10 ml-1 mr-1 rounded-md"
            />
            {" degrees"}
          </>
        ),
        action: "rotateClockWise",
        class: "bg-blue-500",
        action: { active: "rotateClockWise", rotate: 15 },
      },
      {
        id: 1,
        operation: (
          <>
            {" "}
            {"Turn "}
            <Icon name="undo" size={15} className="text-white mx-2" />
            <input
              value={15}
              className="pl-1 text-black w-10 ml-1 mr-1 rounded-md"
            />
            {" degrees"}
          </>
        ),
        action: "rotateAntiClock",
        class: "bg-blue-500",
        action: { active: "rotateAntiClock", rotate: -15 },
      },
      {
        id: 3,
        operation: (
          <>
            {"Go to x:"}{" "}
            <input
              value={0}
              className="pl-1 text-black w-10 ml-1 mr-1 rounded-md"
            />{" "}
            {" and y:"}{" "}
            <input
              value={0}
              className="pl-1 text-black w-10 ml-1 mr-1 rounded-md"
            />{" "}
          </>
        ),
        action: "goToXY",
        class: "bg-blue-500",
        action: { active: "goTo", cord: { x: 0, y: 0 } },
      },
    ],
  },
  {
    title: "Looks",
    actions: [
      {
        id: 0,
        operation: (
          <>
            {"Say"}{" "}
            <input
              value={"Hello"}
              className="pl-1 text-black w-14 ml-1 mr-1 rounded-md"
            />{" "}
            {"for"}{" "}
            <input
              value={2}
              className="pl-1 text-black w-10 ml-1 mr-1 rounded-md"
            />{" "}
            {"sec"}
          </>
        ),
        action: { active: "Say", time: 2 },
        class: "bg-indigo-500",
      },
      {
        id: 1,
        operation: (
          <>
            {"Think"}{" "}
            <input
              value={"Hello"}
              className="pl-1 text-black w-14 ml-1 mr-1 rounded-md"
            />{" "}
            {"for"}{" "}
            <input
              value={2}
              className="pl-1 text-black w-10 ml-1 mr-1 rounded-md"
            />{" "}
            {"sec"}"
          </>
        ),
        action: { active: "Think", time: 2 },
        class: "bg-indigo-500",
      },
    ],
  },
  {
    title: "Controls",
    actions: [
      {
        id: 0,
        operation: (
          <>
            {"Repeat"}{" "}
            <input
              value={10}
              className="pl-1 text-black w-10 ml-1 mr-1 rounded-md"
            />{" "}
            {"times"}
          </>
        ),
        action: { active: "Repeat", count: 5 },
        class: "bg-green-500",
      },
    ],
  },
];
