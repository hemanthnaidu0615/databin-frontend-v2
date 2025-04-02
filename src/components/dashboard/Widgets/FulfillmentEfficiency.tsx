import React, { useState, useRef, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../../ui/dropdown/Dropdown";
import { DropdownItem } from "../../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../../icons";

type FulfillmentEfficiencyProps = {
  size?: "small" | "full";
  onRemove?: () => void;
  onViewMore?: () => void;
};

const FulfillmentEfficiency: React.FC<FulfillmentEfficiencyProps> = ({
  size = "full",
  onRemove,
  onViewMore,
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    document.documentElement.classList.contains("dark")
  );

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

    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      observer.disconnect();
    };
  }, []);

  const data = {
    picked: [30, 40, 45, 50, 49, 60, 70],
    packed: [20, 30, 40, 35, 50, 55, 65],
    shipped: [10, 20, 25, 30, 35, 40, 50],
    delivered: [5, 10, 15, 20, 25, 30, 40],
  };

  const categories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const apexOptions: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
      background: "transparent",
    },
    colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
      },
    },
    grid: {
      borderColor: isDarkMode ? "#374151" : "#E5E7EB",
      strokeDashArray: 5,
    },
    xaxis: {
      categories: categories,
      labels: { style: { fontSize: "12px", colors: isDarkMode ? "#D1D5DB" : "#4B5563" } },
    },
    yaxis: {
      title: { text: "Orders", style: { color: isDarkMode ? "#D1D5DB" : "#4B5563" } },
      labels: { style: { fontSize: "12px", colors: isDarkMode ? "#D1D5DB" : "#4B5563" } },
    },
    tooltip: { theme: isDarkMode ? "dark" : "light" },
    responsive: [{ breakpoint: 768, options: { chart: { height: 250 } } }],
  };

  const series = [
    { name: "Picked", data: data.picked },
    { name: "Packed", data: data.packed },
    { name: "Shipped", data: data.shipped },
    { name: "Delivered", data: data.delivered },
  ];

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${
        isDarkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"
      } px-5 pt-5 sm:px-6 sm:pt-6`}
    >
      {size === "full" && (
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Fulfillment Efficiency Tracker
          </h2>

          <div className="relative inline-block">
            <button
              ref={buttonRef}
              className="dropdown-toggle"
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
              <MoreDotIcon
                className={`size-6 ${isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
              />
            </button>

            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className={`absolute right-0 mt-2 w-40 ${
                  isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600"
                } shadow-md rounded-lg z-50`}
              >
                <Dropdown isOpen={isDropdownOpen} onClose={() => setDropdownOpen(false)}>
                  <DropdownItem
                    onItemClick={() => {
                      setDropdownOpen(false);
                      onViewMore?.();
                    }}
                  >
                    View More
                  </DropdownItem>
                  <DropdownItem
                    onItemClick={() => {
                      setDropdownOpen(false);
                      onRemove?.();
                    }}
                  >
                    Remove
                  </DropdownItem>
                </Dropdown>
              </div>
            )}
          </div>
        </div>
      )}

      <Chart options={apexOptions} series={series} type="bar" height={size === "small" ? 200 : 300} />
    </div>
  );
};

export default FulfillmentEfficiency;