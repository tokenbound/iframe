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
      <div className="flex space-x-2 items-center justify-start">
        {children || <div>{currentOption}</div>}
        {options?.length > 1 && (
          <div>
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-2 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
              id="options-menu"
              aria-haspopup="true"
              aria-expanded="true"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 9.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 12z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
      {isOpen && (
        <div className="origin-top-left absolute right-0 mt-2 w-[140px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
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
                className={`w-full block px-4 py-2 text-sm hover:bg-gray-100 ${
                  currentOption === option ? "text-gray-900 font-bold" : "text-gray-400"
                }`}
                role="menuitem"
                onClick={() => handleOptionClick(option)}
              >
                <div className="flex items-center justify-between ">
                  <span>{shortenAddress(option)}</span>
                  <span
                    className={clsx(
                      currentOption === option
                        ? "bg-purple-fade text-purple"
                        : "bg-gray-100 text-gray-500",
                      `p-1 rounded-sm font-bold w-fit`
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
