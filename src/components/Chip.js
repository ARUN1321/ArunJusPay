import React from "react";
import { useDrag } from "react-dnd";

const Chip = ({ type, color, operation, action }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: { operation, color },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex flex-row flex-wrap ${color} rounded-md border-none text-white px-2 py-1 my-2 text-sm cursor-pointer `}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {operation}
    </div>
  );
};

export default Chip;
