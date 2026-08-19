import { useState, useEffect } from "react";

export default function useCarouselScroll(carouselRef) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
  };

  const scroll = (direction) => {
    if (!carouselRef.current) return;

    const scrollAmount = 300;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    // Update scroll status after animation
    setTimeout(checkScrollability, 300);
  };

  useEffect(() => {
    // Set up resize observer to check scrollability when container size changes
    const observer = new ResizeObserver(() => {
      checkScrollability();
    });

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
      // Initial check
      checkScrollability();
    }

    return () => {
      if (carouselRef.current) {
        observer.unobserve(carouselRef.current);
      }
    };
  }, [carouselRef]);

  return { canScrollLeft, canScrollRight, scroll, checkScrollability };
}