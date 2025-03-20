import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { Dropdown } from "../../ui/dropdown/Dropdown";
import { DropdownItem } from "../../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../../icons";
import { TableRow } from "@mui/material"; // Ensure correct import if using Material UI can also be used from UI folder 

type RevenuePerCustomerProps = {
  size?: "small" | "full";
  hasTableRow?: boolean; // Conditional rendering for TableRow
};

const data = [
  { customer: "C1", revenue: 500, cumulative: 10 },
  { customer: "C2", revenue: 450, cumulative: 20 },
  { customer: "C3", revenue: 400, cumulative: 30 },
  { customer: "C4", revenue: 350, cumulative: 40 },
  { customer: "C5", revenue: 300, cumulative: 50 },
  { customer: "C6", revenue: 250, cumulative: 60 },
  { customer: "C7", revenue: 200, cumulative: 70 },
  { customer: "C8", revenue: 150, cumulative: 80 },
  { customer: "C9", revenue: 100, cumulative: 90 },
  { customer: "C10", revenue: 50, cumulative: 100 },
];

const RevenuePerCustomer: React.FC<RevenuePerCustomerProps> = ({
  size = "full",
  hasTableRow = false,
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div
      className={`border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-default bg-white dark:bg-gray-900 rounded-xl`}
    >
      {/* Title & More Options */}
      {size === "full" && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Revenue Per Customer</h2>

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
                  }}
                  className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  View More
                </DropdownItem>
                <DropdownItem
                  onItemClick={() => {
                    setDropdownOpen(false);
                  }}
                  className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  Remove
                </DropdownItem>
              </Dropdown>
            )}
          </div>
        </div>
      )}

      {/* Bar Chart with Line Overlay */}
      <ResponsiveContainer width="100%" height={size === "small" ? 150 : 300}>
        <BarChart data={data}>
          <XAxis dataKey="customer" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
          <Tooltip />
          {size === "full" && <Legend />}
          <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue" />
          <Line yAxisId="right" dataKey="cumulative" stroke="#ff7300" name="Cumulative %" dot={false} />
        </BarChart>
      </ResponsiveContainer>

      {/* Conditional TableRow Rendering */}
      {hasTableRow && (
        <TableRow key="revenue" className="hover:bg-gray-50 dark:hover:bg-white/[0.05] transition">
          {/* TableRow Content Here */}
        </TableRow>
      )}
    </div>
  );
};

export default RevenuePerCustomer;
