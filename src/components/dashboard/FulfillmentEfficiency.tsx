"use client";

import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../axios";
import { formatDateTime, formatValue } from "../utils/kpiUtils";
import { useDateRangeEnterprise } from "../utils/useGlobalFilters";
import { getBaseTooltip, ordersTooltip } from "../modularity/graphs/graphWidget";
import CommonButton from "../modularity/buttons/Button";
        
type FulfillmentEfficiencyProps = {
  size?: "small" | "full";
  onRemove?: () => void;
  onViewMore?: () => void;
};

const FulfillmentEfficiency: React.FC<FulfillmentEfficiencyProps> = ({
  size = "full",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [chartData, setChartData] = useState({
    categories: ["Picked", "Packed", "Shipped", "Delivered"],
    totals: [0, 0, 0, 0],
  });
  const baseTooltip = getBaseTooltip(isDark, ordersTooltip);

  const tooltipWithoutDollar = {
    ...baseTooltip,
    y: {
      ...baseTooltip.y,
      formatter: (val: number) => val.toLocaleString(),
    },
  };
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange || [];

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
        const formattedStart = formatDateTime(startDate);
        const formattedEnd = formatDateTime(endDate);

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
      stacked: true,
      toolbar: { show: false },
      foreColor: "#a855f7",
    },
    colors: ["#a855f7"],
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
          color: "#a855f7",
        },
      },
      labels: {
        style: {
          fontSize: "12px",
          colors: "#a855f7",
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
          color: "#a855f7",
        },
      },
      labels: {
        formatter: (val: number) => formatValue(val),
        style: {
          fontSize: "12px",
          colors: "#a855f7",
        },
      },
    },
    tooltip: tooltipWithoutDollar,
    legend: {
      position: "bottom",
      labels: {
        colors: "#a855f7",
      },
    },
  };

  const series = [
    {
      name: "Orders",
      data: chartData.totals,
    },
  ];

  const handleViewMore = () => {
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    navigate("/fulfillment");
  };

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
            <CommonButton variant="responsive" onClick={handleViewMore}  showDesktop={false}/>
          </div>

          {/* Desktop & tablet "View More" */}
          <CommonButton variant="responsive" onClick={handleViewMore} showMobile={false} text="View more"/>
        </div>
      )}
      <div
        className="w-full mb-11"
        style={{ height: size === "small" ? 220 : 400 }}
      >
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
