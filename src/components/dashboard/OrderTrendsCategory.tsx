import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../axios";

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
        .padStart(3, "0")}`;
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

// Conversion Rate: INR to USD
const INR_TO_USD = 1 / 83.3;

const formatValue = (value: number) => {
  const usd = value * INR_TO_USD;
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}m`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(1)}k`;
  return `$${usd.toFixed(0)}`;
};

const OrderTrendsCategory: React.FC<OrderTrendsCategoryProps> = ({
  size = "full",
}) => {
  const [chartData, setChartData] = useState<{
    categories: string[];
    series: { name: string; data: number[] }[];
  }>({
    categories: [],
    series: [],
  });

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        const params = new URLSearchParams({
          startDate: encodeURIComponent(formattedStartDate),
          endDate: encodeURIComponent(formattedEndDate),
        });

        if (enterpriseKey) {
          params.append("enterpriseKey", enterpriseKey);
        }

        const response = await axiosInstance.get<ApiResponse>(
          `/order-trends-by-category?${params.toString()}`
        );
        const data = response.data;

        const trends = data.order_trends;

        if (!trends || Object.keys(trends).length === 0) {
          setChartData({ categories: [], series: [] });
          return;
        }

        const months = Object.keys(trends).sort();
        const categoryTotals: Record<string, number> = {};

        for (const month of months) {
          const monthData = trends[month];
          for (const [category, sales] of Object.entries(monthData)) {
            categoryTotals[category] = (categoryTotals[category] || 0) + sales;
          }
        }

        const topCategories = Object.entries(categoryTotals)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([category]) => category);

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
  }, [startDate, endDate, enterpriseKey]);

  const options: ApexOptions = {
    chart: {
      type: "line",
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    xaxis: {
      categories: chartData.categories,
      title: {
        text: "Month",
        style: {
          color: "#9CA3AF",
          fontSize: "14px",
          fontWeight: 400,
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
          fontWeight: 400,
        },
      },
      labels: {
        style: { colors: "#6B7280" },
        formatter: formatValue,
      },
    },
    tooltip: {
      theme: "light",
      x: { show: true },
      y: {
        formatter: formatValue,
      },
    },
    stroke: { curve: "smooth", width: 2 },
    markers: { size: 4 },
    colors: ["#6366F1", "#22C55E", "#EAB308"],
    legend: { position: "bottom" },
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

  const handleViewMore = () => {
    navigate("/orders");
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-900 p-4 sm:p-5">
      {size === "full" && (
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Order Trends by Product Category
          </h2>
          <div className="relative">
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

      <div className="h-[420px] sm:h-[490px]">
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
