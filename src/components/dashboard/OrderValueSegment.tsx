import React, { useState, useRef, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

type OrderValueSegmentProps = {
  size?: "small" | "full";
  onViewMore?: () => void;
  onRemove?: () => void;
};

const data = {
  categories: ["Jan", "Feb", "Mar", "Apr"],
  series: [
    { name: "New", data: [4000, 3000, 2000, 2780] },
    { name: "Returning", data: [2400, 1398, 9800, 3908] },
  ],
};

const OrderValueSegment: React.FC<OrderValueSegmentProps> = ({
  size = "full",
  onViewMore,
  onRemove,
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const options: ApexOptions = {
    chart: { type: "bar", stacked: true },
    xaxis: { categories: data.categories },
    tooltip: { theme: "dark" },
    plotOptions: { bar: { horizontal: false, columnWidth: "50%" } },
    legend: { show: size === "full" },
  };

  return (
    <div className="relative border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-md bg-white dark:bg-gray-900 rounded-xl">
      {size === "full" && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Order Value by Customer Segment
          </h2>

          <button ref={buttonRef} className="p-2" onClick={() => setDropdownOpen(!isDropdownOpen)}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>

          {isDropdownOpen && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50">
              <Dropdown isOpen={isDropdownOpen} onClose={() => setDropdownOpen(false)}>
                <DropdownItem onItemClick={() => { setDropdownOpen(false); onViewMore?.(); }}>
                  View More
                </DropdownItem>
                <DropdownItem onItemClick={() => { setDropdownOpen(false); onRemove?.(); }}>
                  Remove
                </DropdownItem>
              </Dropdown>
            </div>
          )}
        </div>
      )}

      <Chart options={options} series={data.series} type="bar" height={size === "small" ? 150 : 300} />
    </div>
  );
};

export default OrderValueSegment;





// import React, { useState } from "react";
// import Chart from "react-apexcharts";
// import { ApexOptions } from "apexcharts";
// import {
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   SelectChangeEvent,
// } from "@mui/material";
// import { Dropdown } from "../../ui/dropdown/Dropdown";
// import { DropdownItem } from "../../ui/dropdown/DropdownItem";
// import { MoreDotIcon } from "../../../icons";

// type OrderValueSegmentProps = {
//   size?: "small" | "full";
// };

// const OrderValueSegment: React.FC<OrderValueSegmentProps> = ({
//   size = "full",
// }) => {
//   const [timeFrame, setTimeFrame] = useState<keyof typeof chartData>("monthly");
//   const [isDropdownOpen, setDropdownOpen] = useState(false);

//   const closeDropdown = () => setDropdownOpen(false);

//   // Data for Charts
//   const chartData = {
//     monthly: {
//       categories: ["Jan", "Feb", "Mar", "Apr"],
//       series: [
//         { name: "New", data: [4000, 3000, 2000, 2780] },
//         { name: "Returning", data: [2400, 1398, 9800, 3908] },
//         { name: "VIP", data: [2400, 2210, 2290, 2000] },
//       ],
//     },
//     quarterly: {
//       categories: ["Q1", "Q2"],
//       series: [
//         { name: "New", data: [9000, 8700] },
//         { name: "Returning", data: [13800, 9800] },
//         { name: "VIP", data: [6900, 8000] },
//       ],
//     },
//   };

//   // ApexCharts Options
//   const options: ApexOptions = {
//     chart: { type: "bar", stacked: true },
//     xaxis: { categories: chartData[timeFrame].categories },
//     legend: { position: "top" },
//     theme: { mode: "dark" },
//     plotOptions: { bar: { horizontal: false, columnWidth: "50%" } },
//   };

//   return (
//     <div
//       className={`border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-default bg-white dark:bg-gray-900 rounded-xl`}
//     >
//       {size === "full" && (
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
//             Order Value by Customer Segment
//           </h2>

//           <div className="flex items-center gap-3">
//             {/* Timeframe Selector */}
//             <FormControl size="small">
//               <InputLabel sx={{ color: "text.primary" }}>Time Frame</InputLabel>
//               <Select
//                 value={timeFrame}
//                 onChange={(e: SelectChangeEvent<string>) =>
//                   setTimeFrame(e.target.value as keyof typeof chartData)
//                 }
//               >
//                 <MenuItem value="monthly">Monthly</MenuItem>
//                 <MenuItem value="quarterly">Quarterly</MenuItem>
//               </Select>
//             </FormControl>

//             {/* More Options Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={() => setDropdownOpen(!isDropdownOpen)}
//                 className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10"
//               >
//                 <MoreDotIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//               </button>

//               {isDropdownOpen && (
//                 <Dropdown isOpen={isDropdownOpen} onClose={closeDropdown}>
//                   <DropdownItem
//                     onItemClick={closeDropdown}
//                     className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
//                   >
//                     View More
//                   </DropdownItem>
//                   <DropdownItem
//                     onItemClick={closeDropdown}
//                     className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
//                   >
//                     Remove
//                   </DropdownItem>
//                 </Dropdown>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ApexCharts */}
//       <Chart
//         options={options}
//         series={chartData[timeFrame].series}
//         type="bar"
//         height={size === "small" ? 150 : 300}
//       />
//     </div>
//   );
// };

// export default OrderValueSegment;
