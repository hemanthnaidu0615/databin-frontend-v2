import { ProgressBar } from "primereact/progressbar";
import { abbrvalue } from "../helpers/helpers";
import { useSelector } from "react-redux";
import moment from "moment";

export const BrandInfo = (props: any) => {
  // const normalizedValue = Math.min(100, Math.max(0, props.progressbarValue));
  const maxPossibleValue = 100000000; // Adjust this to your maximum possible value
  const normalizedValue = (props.progressbarValue / maxPossibleValue) * 100;
  const { dates } = useSelector((store: any) => store.dateRange);

  return (
    <div className="card w-full h-full flex flex-col gap-2 p-2">
      <div className="flex items-center w-[70%]">
        <h2 className="text-md font-bold ml-2 ">{props.brandName}</h2>
        <img
          src={props.logo}
          alt=""
          className="object-contain h-[17px] w-[50px] p-0"
          height="17px"
        />
      </div>

      <div className="  bg-orange-100 flex flex-col gap-1 p-6 rounded-2xl w-[70%] text-left">
        <p className="text-xs ">
          {" "}
          {moment(new Date(dates[0])).format("DD/MM/YYYY")} -{" "}
          {moment(new Date(dates[1])).format("DD/MM/YYYY")}
        </p>
        <h2 className="text-lg font-bold ">
          $ {abbrvalue(props.progressbarValue)}
        </h2>
        <ProgressBar
          value={normalizedValue}
          showValue={false}
          className="h-2 w-full mx-auto "
          color="rgb(126 34 206)"
        ></ProgressBar>
      </div>
    </div>
  );
};
