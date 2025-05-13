"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
// import { MoreDotIcon } from "../../icons";
import { useTheme } from "../../context/ThemeContext";

import { useNavigate } from "react-router-dom";

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
  // onRemove,
  onViewMore,
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const navigate = useNavigate();

  const [chartData, setChartData] = useState({
    categories: [] as string[],
    picked: [] as number[],
    packed: [] as number[],
    shipped: [] as number[],
    delivered: [] as number[],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [isDropdownOpen, setDropdownOpen] = useState(false);

  // const dropdownRef = useRef<HTMLDivElement | null>(null);
  // const buttonRef = useRef<HTMLButtonElement | null>(null);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange || [];
  // Get enterpriseKey from Redux
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);

  const formatValue = (Orders: number) => {
    if (Orders >= 1_000_000) return (Orders / 1_000_000).toFixed(1) + "m";
    if (Orders >= 1_000) return (Orders / 1_000).toFixed(1) + "k";
    return Orders.toFixed(0);
  };

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       dropdownRef.current &&
  //       !dropdownRef.current.contains(event.target as Node) &&
  //       buttonRef.current &&
  //       !buttonRef.current.contains(event.target as Node)
  //     ) {
  //       setDropdownOpen(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) return;

      setIsLoading(true);
      setError(null);

      try {
        const formattedStart = `${formatDate(startDate)} 00:00:00.000`;
        const formattedEnd = `${formatDate(endDate)} 23:59:59.999`;

        // Construct the API URL with the enterpriseKey if it exists
        const params = new URLSearchParams({
          startDate: formattedStart,
          endDate: formattedEnd,
        });

        if (enterpriseKey) {
          params.append("enterpriseKey", enterpriseKey);
        }

        const response = await fetch(
          `http://localhost:8080/api/fulfillment-efficiency/summary?${params.toString()}`
        );

        if (!response.ok) throw new Error("Failed to fetch fulfillment data");

        const result = await response.json();
        const summary = result.fulfillment_summary;

        const categories = Object.keys(summary);
        const picked = categories.map((date) => summary[date].Picked ?? 0);
        const packed = categories.map((date) => summary[date].Packed ?? 0);
        const shipped = categories.map((date) => summary[date].Shipped ?? 0);
        const delivered = categories.map(
          (date) => summary[date].Delivered ?? 0
        );

        setChartData({ categories, picked, packed, shipped, delivered });
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, enterpriseKey]); // Add `enterpriseKey` as a dependency

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
    fill: {
      opacity: 1,
    },
    grid: {
      borderColor: isDarkMode ? "#374151" : "#E5E7EB",
      strokeDashArray: 5,
    },
    xaxis: {
      categories: chartData.categories,
      crosshairs: { show: false },
      title: {
        text: "Day",
        offsetY: 10,
        style: {
          fontSize: "16px",
          fontWeight: 700,
          color: isDarkMode ? "#F3F4F6" : "#1F2937",
        },
      },
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
        rotate: -90,
        offsetX: -10,
        style: {
          fontSize: "16px",
          fontWeight: 700,
          color: isDarkMode ? "#F3F4F6" : "#1F2937",
        },
      },
      labels: {
        formatter: formatValue,
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

  function handleViewMore(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault();
    if (onViewMore) {
      onViewMore();
    } else {
      navigate("/fulfillment");
    }
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${
        isDarkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"
      } px-5 pt-5 sm:px-6 sm:pt-6`}
    >
      {size === "full" && (
        <div className="flex justify-between items-center mb-21">
          <h2
            className={`text-lg font-semibold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Fulfillment Efficiency Tracker
          </h2>

          <div className="relative inline-block">
            {/* Dropdown section commented out */}
            {/* <button
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
                className={`absolute right-0 mt-2 w-40 rounded-lg shadow-md z-50 ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-white text-gray-600"
                }`}
              >
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onViewMore?.();
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-white/10"
                >
                  View More
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onRemove?.();
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-white/10"
                >
                  Remove
                </button>
              </div>
            )} */}
            <button
              onClick={handleViewMore}
              className="text-xs font-medium hover:underline"
              style={{ color: "#9614d0" }}
            >
              View More
            </button>
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
