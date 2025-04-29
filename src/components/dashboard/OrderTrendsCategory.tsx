import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ${d
    .getHours()
    .toString()
    .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d
    .getSeconds()
    .toString()
    .padStart(2, "0")}.${d.getMilliseconds().toString().padStart(3, "0")}`;
};

type OrderTrendsCategoryProps = {
  size?: "small" | "full";
  onViewMore?: () => void;
  onRemove?: () => void;
};

type ApiResponse = {
  order_trends: {
    [month: string]: Record<string, number>;
  };
};

const OrderTrendsCategory: React.FC<OrderTrendsCategoryProps> = ({
  size = "full",
  onViewMore,
  onRemove,
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [chartData, setChartData] = useState<{
    categories: string[];
    series: { name: string; data: number[] }[];
  }>({
    categories: [],
    series: [],
  });

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        const response = await fetch(
          `http://localhost:8080/api/order-trends-by-category?startDate=${encodeURIComponent(
            formattedStartDate
          )}&endDate=${encodeURIComponent(formattedEndDate)}`
        );
        const data: ApiResponse = await response.json();
        const trends = data.order_trends;

        if (!trends || Object.keys(trends).length === 0) {
          setChartData({ categories: [], series: [] });
          return;
        }

        const months = Object.keys(trends).sort(); // e.g. ["2025-03"]
        const categoryTotals: Record<string, number> = {};

        // Step 1: Calculate total per category
        for (const month of months) {
          const monthData = trends[month];
          for (const [category, sales] of Object.entries(monthData)) {
            categoryTotals[category] = (categoryTotals[category] || 0) + sales;
          }
        }

        // Step 2: Get top 3 categories
        const topCategories = Object.entries(categoryTotals)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([category]) => category);

        // Step 3: Construct chart series
        const series = topCategories.map((category) => ({
          name: category,
          data: months.map((month) => trends[month]?.[category] || 0),
        }));

        setChartData({
          categories: months,
          series,
        });
      } catch (error) {
        console.error("Failed to fetch order trends:", error);
      }
    };

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  const options: ApexOptions = {
    chart: {
      type: "line",
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    xaxis: {
      categories: chartData.categories,
      title: {
        text: "Month", // X Axis Label
        style: {
          color: "#9CA3AF", // Tailwind gray-400
          fontSize: "14px",
          fontWeight: 400, // <-- Not bold
        },
      },
      labels: { style: { colors: "#6B7280" } },
    },
    yaxis: {
      title: {
        text: "Order Amount", // Y Axis Label
        style: {
          color: "#9CA3AF",
          fontSize: "14px",
          fontWeight: 400, // <-- Not bold
        },
      },
      labels: { style: { colors: "#6B7280" } },
    },
    stroke: { curve: "smooth", width: 2 },
    markers: { size: 4 },
    colors: ["#6366F1", "#22C55E", "#EAB308"],
    legend: { position: "bottom" },
    tooltip: { theme: "light", x: { show: true } },
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
    <div className="rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-900 p-4 sm:p-5">
      {size === "full" && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Order Trends by Product Category
          </h2>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10"
              aria-label="More options"
            >
              <MoreDotIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-md z-50">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onViewMore?.();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
                >
                  View More
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onRemove?.();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="h-[400px] sm:h-[500px]">
        {" "}
        {/* Adjust height as needed */}
        <Chart
          options={options}
          series={chartData.series}
          type="line"
          height="100%"
        />
      </div>
    </div>
  );
};

export default OrderTrendsCategory;
