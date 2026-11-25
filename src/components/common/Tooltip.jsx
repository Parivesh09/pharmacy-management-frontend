import { useState, useRef, useEffect } from "react";

const Tooltip = ({ content, children, position = "top", delay = 200 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);
  const childRef = useRef(null);
  const timeoutRef = useRef(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const updatePosition = () => {
    if (!childRef.current || !tooltipRef.current) return;

    const childRect = childRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    let top, left;

    switch (position) {
      case "top":
        top = childRect.top + scrollTop - tooltipRect.height - 8;
        left = childRect.left + scrollLeft + (childRect.width - tooltipRect.width) / 2;
        break;
      case "bottom":
        top = childRect.bottom + scrollTop + 8;
        left = childRect.left + scrollLeft + (childRect.width - tooltipRect.width) / 2;
        break;
      case "left":
        top = childRect.top + scrollTop + (childRect.height - tooltipRect.height) / 2;
        left = childRect.left + scrollLeft - tooltipRect.width - 8;
        break;
      case "right":
        top = childRect.top + scrollTop + (childRect.height - tooltipRect.height) / 2;
        left = childRect.right + scrollLeft + 8;
        break;
      default:
        top = childRect.top + scrollTop - tooltipRect.height - 8;
        left = childRect.left + scrollLeft + (childRect.width - tooltipRect.width) / 2;
    }

    // Keep tooltip within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 10;

    if (left + tooltipRect.width + padding > viewportWidth + scrollLeft) {
      left = viewportWidth + scrollLeft - tooltipRect.width - padding;
    }
    if (left < padding + scrollLeft) {
      left = padding + scrollLeft;
    }
    if (top + tooltipRect.height + padding > viewportHeight + scrollTop) {
      top = viewportHeight + scrollTop - tooltipRect.height - padding;
    }
    if (top < padding + scrollTop) {
      top = padding + scrollTop;
    }

    setTooltipPosition({ top, left });
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isVisible]);

  return (
    <>
      <span
        ref={childRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {typeof children === "function" ? children({ isVisible }) : children}
      </span>
      {isVisible && (
        <div
          ref={tooltipRef}
          className="absolute z-50 px-3 py-1.5 text-[10px] font-medium text-white bg-(--text-main) rounded-lg shadow-lg whitespace-nowrap animate-fade-in pointer-events-none"
          style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </>
  );
};

export default Tooltip;