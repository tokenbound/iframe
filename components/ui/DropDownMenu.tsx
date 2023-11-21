import { shortenAddress } from "@/lib/utils";
import clsx from "clsx";
import { useState } from "react";

interface Props
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  options?: string[];
  currentOption?: string;
  setCurrentOption?: (arg0: string) => void;
}

export const DropdownMenu = ({
  options,
  currentOption,
  setCurrentOption,
  className,
  children,
  ...rest
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: string) => {
    if (setCurrentOption) setCurrentOption(option);
    setIsOpen(false);
  };

  if (!options || options.length <= 1) {
    return null;
  }

  return (
    <div className={clsx(className, `relative inline-block text-left`)} {...rest}>
      <div className="flex items-center justify-start">
        {children || <div>{currentOption}</div>}
        {options?.length > 1 && (
          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center justify-center w-full rounded-md shadow-sm px-2 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              id="options-menu"
              aria-haspopup="true"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#202020"/>
                <g clip-path="url(#clip0_106_1909)">
                  <path className="chevron" d="M19.88 14.29L16 18.17L12.12 14.29C11.73 13.9 11.1 13.9 10.71 14.29C10.32 14.68 10.32 15.31 10.71 15.7L15.3 20.29C15.69 20.68 16.32 20.68 16.71 20.29L21.3 15.7C21.69 15.31 21.69 14.68 21.3 14.29C20.91 13.91 20.27 13.9 19.88 14.29Z" fill="#989898"/>
                </g>
                <defs>
                  <clipPath id="clip0_106_1909">
                    <rect width="48" height="48" fill="none" transform="translate(4 5)"/>
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        )}
      </div>
      {isOpen && (
        <div className="origin-top-left absolute right-0 mt-2 w-[140px] shadow-lg bg-black-bg ring-1 ring-black ring-opacity-5 z-10">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {options?.map((option, index) => (
              <button
                key={option}
                type="button"
                className={`w-full opendrop px-2 items-center text-sm hover:bg-panel-gray ${
                  currentOption === option ? "text-gray-900 font-bold" : "text-[#AFAFAF]"
                }`}
                role="menuitem"
                onClick={() => handleOptionClick(option)}
              >
                <div className="flex items-center justify-between">
                  <span>{shortenAddress(option)}</span>
                  <span
                    className={clsx(
                      currentOption === option
                        ? "bg-purple-fade text-gv-purple"
                        : "bg-[#E5E3F6] text-gv-purple",
                      `px-1 rounded-sm font-bold w-fit`
                    )}
                  >
                    {index === 0 ? "V3" : "V2"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
