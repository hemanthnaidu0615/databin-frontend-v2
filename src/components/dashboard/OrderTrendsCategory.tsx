import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons"; // More options icon

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/order-trends-by-category"
        );
        const data: ApiResponse = await response.json();

        const trends = data.order_trends;

        const months = Object.keys(trends).sort(); // e.g. ["2025-03"]
        const categoryTotals: Record<string, number> = {};

        // Step 1: Sum sales across months per category
        for (const month of months) {
          const monthData = trends[month];
          for (const [category, sales] of Object.entries(monthData)) {
            categoryTotals[category] = (categoryTotals[category] || 0) + sales;
          }
        }

        // Step 2: Get top 3 categories by total sales
        const topCategories = Object.entries(categoryTotals)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([category]) => category);

        // Step 3: Build chart data for those top 3 categories
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

    fetchData();
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: size === "small" ? 150 : 300,
      zoom: { enabled: false },
    },
    xaxis: {
      categories: chartData.categories,
      labels: { style: { colors: "#6B7280" } },
    },
    yaxis: {
      labels: { style: { colors: "#6B7280" } },
    },
    stroke: { curve: "smooth", width: 2 },
    markers: { size: 4 },
    colors: ["#6366F1", "#22C55E", "#EAB308"],
    legend: { position: "top" },
    tooltip: { theme: "light", x: { show: true } },
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
              <Dropdown
                isOpen={isDropdownOpen}
                onClose={() => setDropdownOpen(false)}
              >
                <DropdownItem
                  className="text-gray-700 dark:text-gray-300"
                  onItemClick={() => {
                    setDropdownOpen(false);
                    onViewMore?.();
                  }}
                >
                  View More
                </DropdownItem>
                <DropdownItem
                  className="text-gray-700 dark:text-gray-300"
                  onItemClick={() => {
                    setDropdownOpen(false);
                    onRemove?.();
                  }}
                >
                  Remove
                </DropdownItem>
              </Dropdown>
            )}
          </div>
        </div>
      )}

      <Chart
        options={options}
        series={chartData.series}
        type="line"
        height={size === "small" ? 150 : 300}
      />
    </div>
  );
};

export default OrderTrendsCategory;
