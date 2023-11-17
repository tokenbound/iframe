import clsx from "clsx";
import { Exclamation } from "../icon";

interface Props
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

export const Disclaimer = ({ message, className, ...rest }: Props) => {
  return (
    <div
      className={clsx(
        className,
        "flex items-start space-x-2 rounded-lg border-0 bg-tb-warning-secondary p-2"
      )}
      {...rest}
    >
      <div className="h-5 min-h-[20px] w-5 min-w-[20px]">
        <Exclamation />
      </div>
      <p className="text-xs text-tb-warning-primary">{message}</p>
    </div>
  );
};
