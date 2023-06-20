import clsx from "clsx";

interface Props
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  className?: string;
}

export const TokenboundLogo = ({ className, ...props }: Props) => {
  return (
    <div
      className={clsx(
        className,
        "hover:cursor-pointer p-2 rounded-full bg-tb-transparent shadow-tb-shadow border-2 border-transparent "
      )}
      {...props}
    >
      <svg
        width="14"
        height="15"
        viewBox="0 0 14 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.41256 5.22559C6.16716 5.21025 5.92114 5.24341 5.68854 5.32315C5.45595 5.40289 5.24134 5.52766 5.05697 5.69034C4.87259 5.85302 4.72207 6.05043 4.61399 6.27128C4.5059 6.49214 4.44238 6.73211 4.42704 6.97751C4.41171 7.22292 4.44486 7.46895 4.5246 7.70154C4.60434 7.93413 4.72911 8.14875 4.89179 8.33312C5.05447 8.51749 5.25188 8.66801 5.47273 8.77609C5.69359 8.88417 5.93357 8.94769 6.17897 8.96303C7.54314 9.02844 8.58028 7.15038 8.90731 6.51501C9.23433 5.87964 10.3182 3.24474 9.26237 2.2076C7.98229 0.955559 4.35697 1.42275 2.60971 3.51572C0.348556 6.20668 1.2362 11.5979 4.31959 12.8033C6.77696 13.7376 10.5611 12.0464 12 8.13145"
          stroke="white"
          strokeOpacity="0.7"
          strokeWidth="2.07484"
          strokeMiterlimit="10"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
