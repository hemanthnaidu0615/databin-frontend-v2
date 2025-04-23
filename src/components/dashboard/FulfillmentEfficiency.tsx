import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

// Utility to format date string (yyyy-mm-dd)
const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
};

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
  const [chartData, setChartData] = useState({
    categories: [] as string[],
    picked: [] as number[],
    packed: [] as number[],
    shipped: [] as number[],
    delivered: [] as number[],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    document.documentElement.classList.contains("dark")
  );

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // 🧠 Get start and end date from Redux
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const formattedStart = `${formatDate(startDate)} 00:00:00.000`;
        const formattedEnd = `${formatDate(endDate)} 23:59:59.9919`;

        const response = await fetch(
          `http://localhost:8080/api/fulfillment-efficiency/summary?startDate=${encodeURIComponent(
            formattedStart
          )}&endDate=${encodeURIComponent(formattedEnd)}`
        );

        if (!response.ok) throw new Error("Failed to fetch fulfillment data");

        const result = await response.json();
        const summary = result.fulfillment_summary;

        const categories = Object.keys(summary);
        const picked = categories.map((date) => summary[date].Picked);
        const packed = categories.map((date) => summary[date].Packed);
        const shipped = categories.map((date) => summary[date].Shipped);
        const delivered = categories.map((date) => summary[date].Delivered);

        setChartData({ categories, picked, packed, shipped, delivered });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

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
      categories: chartData.categories,
      labels: {
        style: {
          fontSize: "12px",
          colors: isDarkMode ? "#D1D5DB" : "#4B5563",
        },
      },
    },
    yaxis: {
      title: {
        text: "Orders",
        style: {
          color: isDarkMode ? "#D1D5DB" : "#4B5563",
        },
      },
      labels: {
        style: {
          fontSize: "12px",
          colors: isDarkMode ? "#D1D5DB" : "#4B5563",
        },
      },
    },
    tooltip: { theme: isDarkMode ? "dark" : "light" },
    responsive: [{ breakpoint: 768, options: { chart: { height: 250 } } }],
  };

  const series = [
    { name: "Picked", data: chartData.picked },
    { name: "Packed", data: chartData.packed },
    { name: "Shipped", data: chartData.shipped },
    { name: "Delivered", data: chartData.delivered },
  ];

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${
        isDarkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"
      } px-5 pt-5 sm:px-6 sm:pt-6`}
    >
      {size === "full" && (
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-lg font-semibold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Fulfillment Efficiency Tracker
          </h2>

          <div className="relative inline-block">
            <button
              ref={buttonRef}
              className="dropdown-toggle"
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
              <MoreDotIcon
                className={`size-6 ${
                  isDarkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className={`absolute right-0 mt-2 w-40 ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-white text-gray-600"
                } shadow-md rounded-lg z-50`}
              >
                <Dropdown
                  isOpen={isDropdownOpen}
                  onClose={() => setDropdownOpen(false)}
                >
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

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-sm text-red-500">Error: {error}</p>
      ) : (
        <Chart
          options={apexOptions}
          series={series}
          type="bar"
          height={size === "small" ? 200 : 300}
        />
      )}
    </div>
  );
};

export default FulfillmentEfficiency;
