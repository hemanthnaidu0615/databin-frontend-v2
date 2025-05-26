"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../axios";

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
  onViewMore,
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const navigate = useNavigate();

  const [chartData, setChartData] = useState({
    categories: ["Picked", "Packed", "Shipped", "Delivered"],
    totals: [0, 0, 0, 0],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange || [];
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);

  const formatValue = (Orders: number) => {
    if (Orders >= 1_000_000) return (Orders / 1_000_000).toFixed(1) + "M";
    if (Orders >= 1_000) return (Orders / 1_000).toFixed(1) + "K";
    return Orders.toFixed(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) return;

      setIsLoading(true);
      setError(null);

      try {
        const formattedStart = `${formatDate(startDate)} 00:00:00.000`;
        const formattedEnd = `${formatDate(endDate)} 23:59:59.999`;

        const params = new URLSearchParams({
          startDate: formattedStart,
          endDate: formattedEnd,
        });

        if (enterpriseKey) {
          params.append("enterpriseKey", enterpriseKey);
        }

        const response = await axiosInstance.get(
          `/fulfillment-efficiency/summary?${params.toString()}`
        );

        const result = response.data as {
          fulfillment_summary: Record<
            "Picked" | "Packed" | "Shipped" | "Delivered",
            Record<string, number>
          >;
        };

        const summary = result.fulfillment_summary;

        const sumValues = (obj: Record<string, number>) =>
          Object.values(obj || {}).reduce((sum, value) => sum + value, 0);

        const picked = sumValues(summary.Picked);
        const packed = sumValues(summary.Packed);
        const shipped = sumValues(summary.Shipped);
        const delivered = sumValues(summary.Delivered);

        setChartData({
          categories: ["Picked", "Packed", "Shipped", "Delivered"],
          totals: [picked, packed, shipped, delivered],
        });
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, enterpriseKey]);

  const apexOptions: ApexOptions = {
    chart: {
      type: "bar",
      stacked: false,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
      background: "transparent",
    },
    colors: ["#3B82F6"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
      },
    },
    fill: {
      opacity: 1,
    },
    grid: {
      borderColor: isDarkMode ? "#374151" : "#E5E7EB",
      strokeDashArray: 5,
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    xaxis: {
      categories: chartData.categories,
      title: {
        text: "Stage",
        offsetY: 10,
        style: {
          fontSize: "16px",
          fontWeight: 400,
          color: isDarkMode ? "#F3F4F6" : "#1F2937",
        },
      },
      labels: {
        style: {
          fontSize: "12px",
          colors: isDarkMode ? "#D1D5DB" : "#4B5563",
          fontWeight: 400,
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
          fontWeight: 400,
          color: isDarkMode ? "#F3F4F6" : "#1F2937",
        },
      },
      labels: {
        formatter: formatValue,
        style: {
          fontSize: "12px",
          colors: isDarkMode ? "#D1D5DB" : "#4B5563",
          fontWeight: 400,
        },
      },
    },
    tooltip: { theme: isDarkMode ? "dark" : "light" },
    responsive: [{ breakpoint: 768, options: { chart: { height: 300 } } }],
  };

  const series = [
    {
      name: "Orders",
      data: chartData.totals,
    },
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
      className={`overflow-hidden rounded-2xl shadow-md border ${
        isDarkMode
          ? "border-gray-700 bg-gray-900 dark:border-gray-800"
          : "border-gray-200 bg-white"
      }`}
      style={{ padding: "1rem" }}
    >
      {size === "full" && (
        <div className="flex justify-between items-center mb-15 app-subheading">
          <h2
            className="app-subheading"
          >
            Fulfillment Efficiency Summary
          </h2>

          <button
            onClick={handleViewMore}
            className="text-xs font-medium hover:underline"
            style={{ color: "#9614d0" }}
          >
            View More
          </button>
        </div>
      )}
      <div className="w-full" style={{ height: size === "small" ? 220 : 400 }}>
        {isLoading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-500">Error: {error}</p>
        ) : (
          <Chart
            options={apexOptions}
            series={series}
            type="bar"
            height="100%"
            width="100%"
          />
        )}
      </div>
    </div>
  );
};

export default FulfillmentEfficiency;
