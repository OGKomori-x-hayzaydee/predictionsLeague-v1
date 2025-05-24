import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

const CarouselNavButton = ({ direction, onClick, visible }) => {
  if (!visible) return null;
  
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 transform -translate-y-1/2 z-10 bg-indigo-900/80 hover:bg-primary-700 text-white rounded-full p-1 shadow-md"
      aria-label={`Scroll ${direction}`}
      style={{ [direction === "left" ? "left" : "right"]: 0 }}
    >
      {direction === "left" ? (
        <ChevronLeftIcon className="w-5 h-5" />
      ) : (
        <ChevronRightIcon className="w-5 h-5" />
      )}
    </button>
  );
};

export default CarouselNavButton;