import React from "react";
import { useDrag } from "react-dnd";

function Chip(props) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: props.type || "DEFAULT",
    item: { props },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const dragRef = props.type ? drag : null;

  return (
    <div
      ref={dragRef}
      className={`flex flex-row flex-wrap ${props.class} text-white px-2 py-1 my-2 text-sm cursor-pointer`}
    >
      {props.operation}
    </div>
  );
}

export default Chip;
