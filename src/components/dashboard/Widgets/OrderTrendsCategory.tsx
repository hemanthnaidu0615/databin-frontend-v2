// import React, { useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";

// // Import Dropdown Components
// import { Dropdown } from "../ui/dropdown/Dropdown";
// import { DropdownItem } from "../ui/dropdown/DropdownItem";
// import { MoreDotIcon } from "../../icons"; // Icon for more options

// type OrderTrendsCategoryProps = {
//   size?: "small" | "full";
//   onViewMore?: () => void;
//   onRemove?: () => void;
// };

// const dataWeekly = [
//   { week: "Week 1", Electronics: 4000, Clothing: 2400, Groceries: 2000 },
//   { week: "Week 2", Electronics: 3000, Clothing: 1398, Groceries: 2210 },
//   { week: "Week 3", Electronics: 2000, Clothing: 9800, Groceries: 2290 },
//   { week: "Week 4", Electronics: 2780, Clothing: 3908, Groceries: 2000 },
// ];

// const dataMonthly = [
//   { month: "Jan", Electronics: 12000, Clothing: 8400, Groceries: 5000 },
//   { month: "Feb", Electronics: 9800, Clothing: 7000, Groceries: 6200 },
//   { month: "Mar", Electronics: 8700, Clothing: 9200, Groceries: 7500 },
// ];

// const OrderTrendsCategory: React.FC<OrderTrendsCategoryProps> = ({ size = "full", onViewMore, onRemove }) => {
//   const [timeFrame, setTimeFrame] = useState("weekly");
//   const [isDropdownOpen, setDropdownOpen] = useState(false);

//   const handleTimeFrameChange = (event: SelectChangeEvent<string>) => {
//     setTimeFrame(event.target.value as string);
//   };

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white shadow-default dark:border-gray-800 dark:bg-gray-900 p-4 sm:p-5">
//       {size === "full" && (
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
//             Order Trends by Product Category
//           </h2>

//           {/* Dropdown & Time Frame Selection */}
//           <div className="flex items-center gap-3">
//             <FormControl size="small" variant="outlined">
//               <InputLabel sx={{ color: "text.primary" }}>Time Frame</InputLabel>
//               <Select value={timeFrame} onChange={handleTimeFrameChange} label="Time Frame">
//                 <MenuItem value="weekly">Weekly</MenuItem>
//                 <MenuItem value="monthly">Monthly</MenuItem>
//               </Select>
//             </FormControl>

//             {/* More Options Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={() => setDropdownOpen(!isDropdownOpen)}
//                 className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10"
//                 aria-label="More options"
//               >
//                 <MoreDotIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//               </button>

//               {isDropdownOpen && (
//                 <Dropdown isOpen={isDropdownOpen} onClose={() => setDropdownOpen(false)}>
//                   <DropdownItem
//                     onItemClick={() => {
//                       setDropdownOpen(false);
//                       onViewMore?.();
//                     }}
//                     className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
//                   >
//                     View More
//                   </DropdownItem>
//                   <DropdownItem
//                     onItemClick={() => {
//                       setDropdownOpen(false);
//                       onRemove?.();
//                     }}
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

//       {/* Line Chart */}
//       <ResponsiveContainer width="100%" height={size === "small" ? 150 : 300}>
//         <LineChart data={timeFrame === "weekly" ? dataWeekly : dataMonthly}>
//           {/* X Axis */}
//           <XAxis
//             dataKey={timeFrame === "weekly" ? "week" : "month"}
//             tick={{ fill: "var(--text-primary, #374151)" }}
//             tickLine={{ stroke: "var(--text-secondary, #9CA3AF)" }}
//             className="text-gray-800 dark:text-gray-300"
//           />

//           {/* Y Axis */}
//           <YAxis
//             tick={{ fill: "var(--text-primary, #374151)" }}
//             tickLine={{ stroke: "var(--text-secondary, #9CA3AF)" }}
//             className="text-gray-800 dark:text-gray-300"
//           />

//           {/* Tooltip & Legend */}
//           <Tooltip
//             contentStyle={{ backgroundColor: "var(--bg-tooltip, #fff)", color: "var(--text-primary, #374151)" }}
//             itemStyle={{ color: "var(--text-primary, #374151)" }}
//           />
//           {size === "full" && <Legend wrapperStyle={{ color: "var(--text-primary, #374151)" }} />}

//           {/* Lines */}
//           <Line type="monotone" dataKey="Electronics" stroke="#6366F1" strokeWidth={2} />
//           <Line type="monotone" dataKey="Clothing" stroke="#22C55E" strokeWidth={2} />
//           <Line type="monotone" dataKey="Groceries" stroke="#EAB308" strokeWidth={2} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default OrderTrendsCategory;








import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";

// Import Dropdown Components
import { Dropdown } from "../../ui/dropdown/Dropdown";
import { DropdownItem } from "../../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../../icons"; // Icon for more options

type OrderTrendsCategoryProps = {
  size?: "small" | "full";
  onViewMore?: () => void;
  onRemove?: () => void;
};

const dataWeekly = [
  { week: "Week 1", Electronics: 4000, Clothing: 2400, Groceries: 2000 },
  { week: "Week 2", Electronics: 3000, Clothing: 1398, Groceries: 2210 },
  { week: "Week 3", Electronics: 2000, Clothing: 9800, Groceries: 2290 },
  { week: "Week 4", Electronics: 2780, Clothing: 3908, Groceries: 2000 },
];

const dataMonthly = [
  { month: "Jan", Electronics: 12000, Clothing: 8400, Groceries: 5000 },
  { month: "Feb", Electronics: 9800, Clothing: 7000, Groceries: 6200 },
  { month: "Mar", Electronics: 8700, Clothing: 9200, Groceries: 7500 },
];

const OrderTrendsCategory: React.FC<OrderTrendsCategoryProps> = ({ size = "full", onViewMore, onRemove }) => {
  const [timeFrame, setTimeFrame] = useState<"weekly" | "monthly">("weekly");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const theme = useTheme(); // Get the current theme (light or dark)

  const handleTimeFrameChange = (event: SelectChangeEvent<string>) => {
    setTimeFrame(event.target.value as "weekly" | "monthly");
  };

  // Prepare chart data for ApexCharts
  const chartData: { [key in "weekly" | "monthly"]: { categories: string[]; series: { name: string; data: number[]; }[]; } } = {
    weekly: {
      categories: dataWeekly.map(item => item.week),
      series: [
        { name: "Electronics", data: dataWeekly.map(item => item.Electronics) },
        { name: "Clothing", data: dataWeekly.map(item => item.Clothing) },
        { name: "Groceries", data: dataWeekly.map(item => item.Groceries) },
      ],
    },
    monthly: {
      categories: dataMonthly.map(item => item.month),
      series: [
        { name: "Electronics", data: dataMonthly.map(item => item.Electronics) },
        { name: "Clothing", data: dataMonthly.map(item => item.Clothing) },
        { name: "Groceries", data: dataMonthly.map(item => item.Groceries) },
      ],
    },
  };

  // ApexCharts options configuration
  const options: ApexOptions = {
    chart: {
      type: "line",
      height: size === "small" ? 150 : 300,
      zoom: { enabled: false },
    },
    xaxis: {
      categories: chartData[timeFrame].categories,
      labels: { style: { colors: theme.palette.text.primary } }, // Use theme text color
    },
    yaxis: {
      labels: { style: { colors: theme.palette.text.primary } }, // Use theme text color
    },
    stroke: { curve: "smooth", width: 2 },
    markers: { size: 4 },
    colors: ["#6366F1", "#22C55E", "#EAB308"], // Color for each line
    legend: { position: "top" },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light", // Use dark tooltip for dark mode
      x: { show: true },
    },
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-default dark:border-gray-800 dark:bg-gray-900 p-4 sm:p-5">
      {size === "full" && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Order Trends by Product Category
          </h2>

          {/* Dropdown & Time Frame Selection */}
          <div className="flex items-center gap-3">
            {/* <FormControl size="small" variant="outlined">
              <InputLabel sx={{ color: theme.palette.text.primary }}>Time Frame</InputLabel>
              <Select value={timeFrame} onChange={handleTimeFrameChange} label="Time Frame">
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl> */}

            {/* More Options Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10"
                aria-label="More options"
              >
                <MoreDotIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>

              {isDropdownOpen && (
                <Dropdown isOpen={isDropdownOpen} onClose={() => setDropdownOpen(false)}>
                  <DropdownItem
                    onItemClick={() => {
                      setDropdownOpen(false);
                      onViewMore?.();
                    }}
                    className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                  >
                    View More
                  </DropdownItem>
                  <DropdownItem
                    onItemClick={() => {
                      setDropdownOpen(false);
                      onRemove?.();
                    }}
                    className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                  >
                    Remove
                  </DropdownItem>
                </Dropdown>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ApexCharts Line Chart */}
      <Chart
        options={options}
        series={chartData[timeFrame].series}
        type="line"
        height={size === "small" ? 150 : 300}
      />
    </div>
  );
};

export default OrderTrendsCategory;
