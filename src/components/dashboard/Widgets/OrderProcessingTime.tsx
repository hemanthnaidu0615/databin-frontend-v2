import React, { useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../../ui/dropdown/Dropdown";
import { DropdownItem } from "../../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../../icons";

type OrderProcessingTimeProps = {
  size?: "small" | "full";
  onRemove?: () => void;
  onViewMore?: () => void;
};

const OrderProcessingTime: React.FC<OrderProcessingTimeProps> = ({
  size = "full",
  onRemove,
  onViewMore,
}) => {
  const [timeFrame, setTimeFrame] = useState<"hourly" | "daily">("hourly");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const data = {
    hourly: [50, 120, 90, 40, 30, 15],
    daily: [200, 150, 100, 50],
  };

  const categories = {
    hourly: ["<1h", "1-3h", "3-6h", "6-12h", "12-24h", ">24h"],
    daily: ["<1 day", "1-3 days", "3-7 days", ">7 days"],
  };

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#465fff"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    xaxis: {
      categories: categories[timeFrame],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: { text: "Orders" },
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    grid: {
      yaxis: {
        lines: { show: true },
      },
    },
    tooltip: {
      enabled: true,
    },
    responsive: [
      {
        breakpoint: 768, // Tablets
        options: {
          plotOptions: { bar: { columnWidth: "40%" } },
          xaxis: { labels: { style: { fontSize: "10px" } } },
          yaxis: { labels: { style: { fontSize: "10px" } } },
        },
      },
      {
        breakpoint: 480, // Mobile
        options: {
          plotOptions: { bar: { columnWidth: "35%" } },
          xaxis: { labels: { style: { fontSize: "9px" } } },
          yaxis: { labels: { style: { fontSize: "9px" } } },
        },
      },
    ],
  };

  const series = [{ name: "Orders", data: data[timeFrame] }];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 py-5 shadow-default dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 w-full">
      {size === "full" && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Order Processing Time
          </h2>

          {/* More options dropdown */}
          <div className="relative inline-block">
            <button
              className="dropdown-toggle"
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>

            {isDropdownOpen && (
              <Dropdown
                isOpen={isDropdownOpen}
                onClose={() => setDropdownOpen(false)}
                className="w-32 sm:w-40 p-2"
              >
                <DropdownItem
                  onItemClick={() => setDropdownOpen(false)}
                  className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  View More
                </DropdownItem>
                <DropdownItem
                  onItemClick={() => setDropdownOpen(false)}
                  className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  Remove
                </DropdownItem>
              </Dropdown>
            )}
          </div>
        </div>
      )}

      {/* Responsive Chart Container */}
      <div className="w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-0">
          <Chart options={options} series={series} type="bar" height={size === "small" ? 200 : 300} />
        </div>
      </div>
    </div>
  );
};

export default OrderProcessingTime;
