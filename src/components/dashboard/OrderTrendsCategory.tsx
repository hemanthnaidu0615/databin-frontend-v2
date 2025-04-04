import React, { useState, useEffect } from "react";
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

const OrderTrendsCategory: React.FC<OrderTrendsCategoryProps> = ({
  size = "full",
  onViewMore,
  onRemove,
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [chartData, setChartData] = useState<{ categories: string[]; series: any[] }>({
    categories: [],
    series: [],
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/order-trends-by-category")
      .then((res) => res.json())
      .then((data) => {
        const trends = data.order_trends || {};
        const allMonths = Object.keys(trends).sort();

        const categoryTotals: Record<string, number> = {};

        allMonths.forEach((month) => {
          const monthData = trends[month];
          Object.entries(monthData).forEach(([category, value]) => {
            const sales = typeof value === "number" ? value : parseFloat(value);
            categoryTotals[category] = (categoryTotals[category] || 0) + sales;
          });
        });

        const topCategories = Object.entries(categoryTotals)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([category]) => category);

        const series = topCategories.map((category) => ({
          name: category,
          data: allMonths.map((month) => trends[month][category] || 0),
        }));

        setChartData({
          categories: allMonths,
          series,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch order trends:", err);
      });
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: size === "small" ? 150 : 300,
      zoom: { enabled: false },
    },
    xaxis: {
      categories: chartData.categories,
      labels: { style: { colors: "#6B7280" } }, // Gray-500
    },
    yaxis: {
      labels: { style: { colors: "#6B7280" } }, // Gray-500
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

          {/* More Options Menu */}
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

      {/* ApexCharts Line Chart */}
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
