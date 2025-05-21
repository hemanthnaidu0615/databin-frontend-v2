import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Button } from "primereact/button";
import { axiosInstance } from "../../axios";

const formatValue = (value: number) => {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "m";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "k";
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

        const res = await axiosInstance.get(
          "/shipment-performance", // Use axiosInstance with the base URL
          { params }
        );

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
    chart: { type: "bar", stacked: true, toolbar: { show: false } },
    colors: ["#4CAF50", "#FF9800", "#2196F3"],
    plotOptions: { bar: { columnWidth: "50%" } },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return formatValue(val);
      },
      style: {
        colors: ["#fff"],
      },
    },
    xaxis: {
      categories: data.carriers,
      title: {
        text: "Carriers",
        style: { fontWeight: "normal" },
      },
      crosshairs: { show: false },
    },
    yaxis: {
      title: {
        text: "Number of Shipments",
        style: { fontWeight: "normal" },
      },
      labels: {
        formatter: (val: number) => formatValue(val),
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => formatValue(val),
      },
    },
    legend: { position: "bottom" },
  };

  const barSeries = [
    { name: "Standard", data: data.standard },
    { name: "Expedited", data: data.expedited },
    { name: "Same-Day", data: data.sameDay },
  ];

  const handleViewMore = () => navigate("/shipment");
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
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Shipment Performance
            </h2>

            <button
              onClick={handleViewMore}
              className="text-xs font-medium text-purple-600 hover:underline"
            >
              View More
            </button>
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
