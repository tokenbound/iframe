import clsx from "clsx";

interface Props
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  value: string;
  currentTab: string;
}

export const TabPanel = ({ value, currentTab, ...props }: Props) => {
  return (
    <>
      {value === currentTab ? (
        <div className={clsx(props.className, "py-4")} {...props}>
          {props.children}
        </div>
      ) : null}
    </>
  );
};
