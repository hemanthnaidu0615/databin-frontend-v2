import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

type OrderValueSegmentProps = {
  size?: "small" | "full";
};

const dataMonthly = [
  { month: "Jan", New: 4000, Returning: 2400, VIP: 2400 },
  { month: "Feb", New: 3000, Returning: 1398, VIP: 2210 },
  { month: "Mar", New: 2000, Returning: 9800, VIP: 2290 },
  { month: "Apr", New: 2780, Returning: 3908, VIP: 2000 },
];

const dataQuarterly = [
  { quarter: "Q1", New: 9000, Returning: 13800, VIP: 6900 },
  { quarter: "Q2", New: 8700, Returning: 9800, VIP: 8000 },
];

const OrderValueSegment: React.FC<OrderValueSegmentProps> = ({
  size = "full",
}) => {
  const [timeFrame, setTimeFrame] = useState("monthly");

  const handleTimeFrameChange = (event: SelectChangeEvent<string>) => {
    setTimeFrame(event.target.value as string);
  };

  return (
    <div
      className={`border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-default bg-white dark:bg-gray-900 rounded-xl`}
    >
      {/* Title & Dropdown */}
      {size === "full" && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Order Value by Customer Segment
          </h2>
          <FormControl size="small">
            <InputLabel sx={{ color: "text.primary" }}>Time Frame</InputLabel>
            <Select
              value={timeFrame}
              onChange={handleTimeFrameChange}
              label="Time Frame"
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
            </Select>
          </FormControl>
        </div>
      )}

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={size === "small" ? 150 : 300}>
        <BarChart data={timeFrame === "monthly" ? dataMonthly : dataQuarterly}>
          <XAxis dataKey={timeFrame === "monthly" ? "month" : "quarter"} />
          <YAxis />
          <Tooltip />
          {size === "full" && <Legend />}
          <Bar dataKey="New" stackId="a" fill="#8884d8" />
          <Bar dataKey="Returning" stackId="a" fill="#82ca9d" />
          <Bar dataKey="VIP" stackId="a" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
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
// import { Dropdown } from "../ui/dropdown/Dropdown";
// import { DropdownItem } from "../ui/dropdown/DropdownItem";
// import { MoreDotIcon } from "../../icons";

// type OrderValueSegmentProps = {
//   size?: "small" | "full";
// };

// const OrderValueSegment: React.FC<OrderValueSegmentProps> = ({
//   size = "full",
// }) => {
//   const [timeFrame, setTimeFrame] = useState("monthly");
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
//                   setTimeFrame(e.target.value)
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
