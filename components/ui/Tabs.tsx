interface Props
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement> {
  tabs: string[];
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Tabs = ({ tabs, currentTab, onTabChange, ...props }: Props) => {
  return (
    <ul className="flex items-center justify-start" {...props}>
      {tabs.map((tab) => {
        return (
          <li
            className={`relative group list-none w-full text-lg max-[440px]:text-base max-[385px]:text-sm text-center font-secondary font-bold uppercase hover:cursor-pointer py-5 transition-all duration-200 bg-[#D9D9D9] bg-opacity-[0.02] ${
              currentTab === tab ? "text-white" : "text-gray-text/80 hover:text-gray-text"
            }`}
            key={tab}
            onClick={() => onTabChange(tab)}
          >
            <div
              className={`w-full h-1 rounded-t-md absolute bottom-0 transition-all duration-200 ${
                currentTab === tab ? "bg-white" : "bg-transparent group-hover:bg-[#2B2B2B]"
              }`}
            />

            {tab}
          </li>
        );
      })}
    </ul>
  );
};
