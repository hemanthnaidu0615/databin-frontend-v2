import React, { useState, useRef, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../../ui/dropdown/Dropdown";
import { DropdownItem } from "../../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../../icons";

type CustomerSegmentationProps = {
  size?: "small" | "full";
  onRemove?: () => void;
  onViewMore?: () => void;
};

const CustomerSegmentation: React.FC<CustomerSegmentationProps> = ({
  size = "full",
  onRemove,
  onViewMore,
}) => {
  const [timeFrame, setTimeFrame] = useState<"weekly" | "monthly">("weekly");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const data = {
    weekly: [120, 150, 100, 50],  // Customer counts per segment
    monthly: [500, 600, 400, 200],
  };

  const categories = ["High Value", "Medium Value", "Low Value", "Inactive"];

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

  const apexOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: true,
        tools: { download: true, selection: false, zoom: false },
      },
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#4CAF50", "#FF9800", "#2196F3", "#F44336"], // Colors for customer segments
    plotOptions: {
      bar: { horizontal: false, columnWidth: "50%", borderRadius: 5 },
    },
    xaxis: {
      categories: categories,
      labels: { style: { fontSize: "12px" } },
    },
    yaxis: {
      title: { text: "Customers" },
      labels: { style: { fontSize: "12px" } },
    },
    tooltip: { enabled: true },
    responsive: [
      {
        breakpoint: 768,
        options: { plotOptions: { bar: { columnWidth: "40%" } } },
      },
      {
        breakpoint: 480,
        options: { plotOptions: { bar: { columnWidth: "35%" } } },
      },
    ],
  };

  const series = [{ name: "Customer Segments", data: data[timeFrame] }];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-transparent px-5 pt-5 dark:border-gray-800 sm:px-6 sm:pt-6">
      {size === "full" && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Customer Segmentation
          </h2>

          {/* More options dropdown */}
          <div className="relative inline-block">
            <button
              ref={buttonRef}
              className="dropdown-toggle"
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>

            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-md rounded-lg z-50"
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

      {/* Chart Component */}
      <Chart options={apexOptions} series={series} type="bar" height={size === "small" ? 200 : 300} />
    </div>
  );
};

export default CustomerSegmentation;
