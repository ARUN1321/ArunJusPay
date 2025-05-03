import React from "react";
import { useDrag } from "react-dnd";

const Chip = ({ type = "DEFAULT", color, action }) => {
  const [{ isDragging }, drag] = useDrag({
    type,
    item: { type, color, action },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`flex flex-row flex-wrap ${color} text-white px-2 py-1 my-2 text-sm cursor-pointer`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {action}
    </div>
  );
};

export default Chip;
