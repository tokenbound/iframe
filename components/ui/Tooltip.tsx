import { useState } from "react";

interface TooltipProps {
  children: React.ReactNode;
  lineOne?: string;
  lineTwo?: string;
  position?: "left" | "top";
}

export const Tooltip = ({ children, lineOne, lineTwo, position = "left" }: TooltipProps) => {
  const [show, setShow] = useState(false);

  const handleMouseEnter = () => {
    setShow(true);
  };

  const handleMouseLeave = () => {
    setShow(false);
  };

  const tooltipClass = `absolute z-10 text-white bg-black  p-2 rounded-md top-0 ${
    position === "left" ? "right-full" : "bottom-full"
  }`;

  return (
    <div
      className="relative inline-block w-full h-full p-4 cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {show && (
        <div className={tooltipClass}>
          <div
            className="text-sm bottom-full whitespace-nowrap"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {lineOne}
            <br />
            {lineTwo}{" "}
            <a
              href="https://lowly-glade-c07.notion.site/Token-Bound-Locking-Unlocking-965a4887760447778ac3ccff862bc246"
              target="_top"
              className="font-bold underline"
            >
              Learn more
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
