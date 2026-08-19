import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { CarouselButton } from "./buttons";

const CarouselNavButton = ({ direction, onClick, visible }) => {
  if (!visible) return null;
  
  return (
    <CarouselButton
      onClick={onClick}
      direction={direction}
      className="absolute top-1/2 transform -translate-y-1/2 z-10"
      style={{ [direction === "left" ? "left" : "right"]: 0 }}
      ariaLabel={`Scroll ${direction}`}
    >
      {direction === "left" ? (
        <ChevronLeftIcon className="w-5 h-5" />
      ) : (
        <ChevronRightIcon className="w-5 h-5" />
      )}
    </CarouselButton>
  );
};

export default CarouselNavButton;


