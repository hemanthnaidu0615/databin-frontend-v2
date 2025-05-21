import { ProgressBar } from "primereact/progressbar";
import { abbrvalue } from "../helpers/helpers";
import { useSelector } from "react-redux";
import moment from "moment";

export const BrandInfo = (props: any) => {
  const maxPossibleValue = 100000000;
  const normalizedValue = (props.progressbarValue / maxPossibleValue) * 100;
  const { dates } = useSelector((store: any) => store.dateRange);

  return (
    <div className="card w-full h-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-2">
        <h2 className="text-base font-bold text-gray-800 dark:text-white">
          {props.brandName}
        </h2>
        <img
          src={props.logo}
          alt={`${props.brandName} logo`}
          className="object-contain h-5 w-14"
        />
      </div>

      {/* Date & Progress Value */}
      <div className="flex flex-col gap-2 p-4 bg-orange-100 dark:bg-violet-950 rounded-2xl w-full sm:w-[70%] text-left">
        <p className="text-xs text-gray-700 dark:text-gray-300">
          {moment(dates[0]).format("DD/MM/YYYY")} - {moment(dates[1]).format("DD/MM/YYYY")}
        </p>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          ${abbrvalue(props.progressbarValue)}
        </h2>
        <ProgressBar
          value={normalizedValue}
          showValue={false}
          className="h-2 w-full"
          color="rgb(126 34 206)"
        />
      </div>
    </div>
  );
};
