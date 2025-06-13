import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Button } from "primereact/button";
import { axiosInstance } from "../../axios";
import ResponsiveViewMoreButton from "../modularity/buttons/Button";

const formatValue = (value: number) => {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
  return value.toFixed(0);
};

const formatDateTime = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ${d
      .getHours()
      .toString()
      .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d
        .getSeconds()
        .toString()
        .padStart(2, "0")}.000`;
};

const ShipmentPerformance: React.FC<{
  size?: "small" | "full";
  onRemove?: () => void;
  onViewMore?: () => void;
}> = ({ size = "full" }) => {
  const [data, setData] = useState<{
    carriers: string[];
    standard: number[];
    expedited: number[];
    sameDay: number[];
  }>({
    carriers: [],
    standard: [],
    expedited: [],
    sameDay: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(() => {
    return localStorage.getItem("shipmentPerformanceVisible") !== "false";
  });

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange;

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("shipmentPerformanceVisible", String(isVisible));
  }, [isVisible]);

  useEffect(() => {
    const scrollY = sessionStorage.getItem("scrollPosition");
    if (scrollY) {
      window.scrollTo({ top: parseInt(scrollY, 10), behavior: "auto" });
      sessionStorage.removeItem("scrollPosition");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const formattedStartDate = formatDateTime(startDate);
        const formattedEndDate = formatDateTime(endDate);

        const params = new URLSearchParams({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        });

        if (enterpriseKey) {
          params.append("enterpriseKey", enterpriseKey);
        }

        const res = await axiosInstance.get("/shipment-performance", {
          params,
        });

        const dataResponse = res.data as { shipment_performance: any[] };
        const responseData = dataResponse.shipment_performance;

        const carriers = responseData.map((item: any) => item.carrier);
        const standard = responseData.map((item: any) => item.standard);
        const expedited = responseData.map((item: any) => item.expedited);
        const sameDay = responseData.map((item: any) => item.same_day);

        setData({ carriers, standard, expedited, sameDay });
      } catch (err: any) {
        setError(err.message || "Failed to fetch shipment data");
      } finally {
        setIsLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate, enterpriseKey]);

  const barOptions: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
      foreColor: "#a855f7",
    },
    colors: ["#4CAF50", "#FF9800", "#a855f7"],
    plotOptions: {
      bar: {
        columnWidth: "70%",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return formatValue(val);
      },
      style: {
        colors: ["#fff"],
        fontSize: "12px",
      },
    },
    xaxis: {
      categories: data.carriers,
      title: {
        text: "Carriers",
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
        text: "Number of Shipments",
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
    tooltip: {
      y: {
        formatter: (val: number) => formatValue(val),
      },
    },
    legend: {
      position: "bottom",
      labels: {
        colors: "#a855f7",
      },
    },
  };

  const barSeries = [
    { name: "Standard", data: data.standard },
    { name: "Expedited", data: data.expedited },
    { name: "Same-Day", data: data.sameDay },
  ];

  const handleViewMore = () => {
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    navigate("/shipment");
  };
  const restoreChart = () => setIsVisible(true);

  return (
    <div className="border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-md bg-white dark:bg-gray-900 rounded-xl">
      {!isVisible && (
        <div className="flex justify-center py-4">
          <Button
            label="Restore Chart"
            className="p-button-primary"
            onClick={restoreChart}
          />
        </div>
      )}

      {isVisible && (
        <>
          <div className="flex justify-between items-start sm:items-center flex-wrap sm:flex-nowrap gap-2 mb-17">
            <div className="flex items-start justify-between w-full sm:w-auto">
              <h2 className="app-subheading flex-1 mr-2">
                Shipment Performance
              </h2>

              {/* Mobile arrow (→) aligned right */}
              <ResponsiveViewMoreButton onClick={handleViewMore} showDesktop={false} />
            </div>

            {/* Desktop & tablet "View More" */}
            <ResponsiveViewMoreButton onClick={handleViewMore} showMobile={false} />
          </div>

          {isLoading ? (
            <p className="text-gray-600 dark:text-gray-300">Loading data...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <Chart
              options={barOptions}
              series={barSeries}
              type="bar"
              height={size === "small" ? 150 : 300}
            />
          )}

          <div className="grid grid-cols-3 gap-3 px-5 py-3 sm:gap-4 sm:py-4">
            {[
              {
                label: "Standard",
                count: data.standard.reduce((a, b) => a + b, 0),
              },
              {
                label: "Expedited",
                count: data.expedited.reduce((a, b) => a + b, 0),
              },
              {
                label: "Same-Day",
                count: data.sameDay.reduce((a, b) => a + b, 0),
              },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <p className="mb-1 text-xs text-gray-500">{item.label}</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {formatValue(item.count)}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ShipmentPerformance;
