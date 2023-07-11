interface Props
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement> {
  tabs: string[];
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Tabs = ({ tabs, currentTab, onTabChange, ...props }: Props) => {
  return (
    <ul className="flex items-center justify-start space-x-4 border-b-[1px]" {...props}>
      {tabs.map((tab) => {
        return (
          <li
            className={`list-none text-base font-medium hover:cursor-pointer pb-1 ${
              currentTab === tab ? "text-black border-b-2 border-black" : "text-tb-text-gray"
            }`}
            key={tab}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </li>
        );
      })}
    </ul>
  );
};
