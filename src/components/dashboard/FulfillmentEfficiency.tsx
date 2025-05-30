"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareFromSquare } from '@fortawesome/free-solid-svg-icons';

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
    const savedScroll = sessionStorage.getItem("scrollPosition");
    if (savedScroll) {
      window.scrollTo({ top: parseInt(savedScroll, 10), behavior: "auto" });
      sessionStorage.removeItem("scrollPosition");
    }
  }, []);


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

  // Simplified barOptions style
  const apexOptions: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    colors: ["#3B82F6", "#FF9800", "#4CAF50"],
    plotOptions: {
      bar: {
        columnWidth: "70%",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => formatValue(val),
      style: {
        colors: ["#fff"],
        fontSize: "12px",
      },
    },
    xaxis: {
      categories: chartData.categories,
      title: {
        text: "Stage",
        style: {
          fontWeight: "400",
          fontSize: "14px",
        },
      },
      labels: {
        style: {
          fontSize: "12px",
        },
      },
      crosshairs: { show: false },
    },
    yaxis: {
      title: {
        text: "Orders",
        style: {
          fontWeight: "400",
          fontSize: "14px",
        },
      },
      labels: {
        formatter: (val: number) => formatValue(val),
        style: {
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => formatValue(val),
      },
    },
    legend: { position: "bottom" },
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
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());

    if (onViewMore) {
      onViewMore();
    } else {
      navigate("/fulfillment");
    }
  }


  return (
    <div
      className={`overflow-hidden rounded-2xl shadow-md border ${theme === "dark"
        ? "border-gray-700 bg-gray-900 dark:border-gray-800"
        : "border-gray-200 bg-white"
        }`}
      style={{ padding: "1rem" }}
    >
      {size === "full" && (
        <div className="flex justify-between items-start sm:items-center flex-wrap sm:flex-nowrap gap-2 mb-4">
          <div className="flex items-start justify-between w-full sm:w-auto">
            <h2 className="app-subheading flex-1 mr-2">
              Fulfillment Efficeincy Summary
            </h2>

            {/* Mobile arrow (→) aligned right */}
            <button
              onClick={handleViewMore}
              className="sm:hidden text-purple-600 text-sm font-medium self-start"
            >
              <FontAwesomeIcon icon={faShareFromSquare} size="lg" style={{ color: "#9614d0", }} />
            </button>
          </div>

          {/* Desktop & tablet "View More" */}
          <button
            onClick={handleViewMore}
            className="hidden sm:block text-xs font-medium text-purple-600 hover:underline"
          >
            View More
          </button>
        </div>

      )}
      <div className="w-full mb-11" style={{ height: size === "small" ? 220 : 400 }}>
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
