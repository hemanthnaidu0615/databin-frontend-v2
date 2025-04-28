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

// Dummy Data
const dummyData = {
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
    chart: {
      type: "bar",
      stacked: true,
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    colors: ["#34c997", "#5470c6"],
    xaxis: {
      categories: dummyData.categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      crosshairs: {
        show: false, // 👈 Added to remove white hover line
      },
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    legend: {
      show: size === "full",
      position: "bottom",
    },
    tooltip: {
      theme: "dark",
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: { bar: { columnWidth: "35%" } },
          xaxis: { labels: { style: { fontSize: "10px" } } },
          yaxis: { labels: { style: { fontSize: "10px" } } },
        },
      },
    ],
  };
  
  
  return (
    <div className="relative border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-md bg-white dark:bg-gray-900 rounded-xl">
      {size === "full" && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Order Value by Customer Segment
          </h2>

          <div className="relative">
            <button ref={buttonRef} className="p-2" onClick={() => setDropdownOpen(!isDropdownOpen)}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>

            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50"
              >
                <Dropdown isOpen={isDropdownOpen} onClose={() => setDropdownOpen(false)}>
                  <DropdownItem
                    onItemClick={() => {
                      setDropdownOpen(false);
                      onViewMore?.();
                    }}
                    className="flex w-full font-normal text-left text-gray-500 rounded-lg px-4 py-2 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                  >
                    View More
                  </DropdownItem>
                  <DropdownItem
                    onItemClick={() => {
                      setDropdownOpen(false);
                      onRemove?.();
                    }}
                    className="flex w-full font-normal text-left text-gray-500 rounded-lg px-4 py-2 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                  >
                    Remove
                  </DropdownItem>
                </Dropdown>
              </div>
            )}
          </div>
        </div>
      )}

      <Chart
        options={options}
        series={dummyData.series}
        type="bar"
        height={size === "small" ? 180 : 400}
      />
    </div>
  );
};

export default OrderValueSegment;






