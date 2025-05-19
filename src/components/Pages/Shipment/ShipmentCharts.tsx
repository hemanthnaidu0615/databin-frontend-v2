import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const formatValue = (value: number) => {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "m";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "k";
  return value.toFixed(0);
};

// Utility function to format YYYY-MM-DD
const formatDate = (date: Date): string => date.toISOString().split("T")[0];

interface ShipmentChartsProps {
  selectedCarrier: string | null;
  selectedMethod: string | null;
}

const ShipmentCharts: React.FC<ShipmentChartsProps> = ({
  selectedCarrier,
  selectedMethod,
}) => {
  const [carrierSeries, setCarrierSeries] = useState<any[]>([]);
  const [carrierCategories, setCarrierCategories] = useState<string[]>([]);
  const [statusSeries, setStatusSeries] = useState<number[]>([]);

  // Redux selectors
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange || [];

  const labelColor = "#a1a1aa";

  const statusOptions: ApexOptions = {
    chart: {
      type: "donut",
      background: "transparent",
      fontFamily: "Inter, sans-serif",
    },
    labels: ["Delivered", "In Transit", "Delayed", "Cancelled"],
    legend: {
      position: "bottom",
      fontSize: "14px",
      fontWeight: 500,
      labels: { colors: [labelColor] },
    },
    colors: ["#22c55e", "#8b5cf6", "#facc15", "#ef4444"],
    stroke: { show: false },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "13px",
        fontWeight: 600,
        colors: ["#fff"],
      },
    },
    tooltip: {
      theme: "dark",
      style: { fontSize: "13px" },
    },
  };

  useEffect(() => {
    const fetchStatusDistribution = async () => {
      if (!startDate || !endDate) return;

      const formattedStart = formatDate(new Date(startDate));
      const formattedEnd = formatDate(new Date(endDate));

      const params = new URLSearchParams({
        startDate: formattedStart,
        endDate: formattedEnd,
      });

      if (enterpriseKey) params.append("enterpriseKey", enterpriseKey);
      if (selectedCarrier) params.append("carrier", selectedCarrier);
      if (selectedMethod) params.append("shippingMethod", selectedMethod);

      try {
        const response = await fetch(
          `http://localhost:8080/api/shipment-status/distribution?${params.toString()}`
        );
        const data = await response.json();
        console.log("Shipment status distribution:", data);

        // Convert percentages to numbers (e.g., "33.4%" => 33.4)
        const delivered = parseFloat(data.delivered || "0");
        const inTransit = parseFloat(data.in_transit || "0");
        const delayed = parseFloat(data.delayed || "0");
        const cancelled = parseFloat(data.cancelled || "0");

        setStatusSeries([delivered, inTransit, delayed, cancelled]);
      } catch (error) {
        console.error("Failed to fetch shipment status distribution:", error);
        setStatusSeries([]);
      }
    };

    fetchStatusDistribution();
  }, [startDate, endDate, enterpriseKey, selectedCarrier, selectedMethod]);

  const carrierOptions: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      stacked: false,
      toolbar: { show: false },
    },
    xaxis: {
      categories: carrierCategories,
      labels: {
        style: {
          colors: labelColor,
          fontSize: "13px",
          fontWeight: 500,
        },
      },
      title: {
        text: "Carrier",
        style: { color: labelColor, fontSize: "13px", fontWeight: 500 },
      },
      crosshairs: {
        show: false, // ✅ disables crosshair on hover
      },
    },

    yaxis: {
      labels: {
        style: { colors: labelColor, fontSize: "13px", fontWeight: 500 },
        formatter: formatValue,
      },
      title: {
        text: "Number of Shipments",
        style: { color: labelColor, fontSize: "13px", fontWeight: 500 },
      },
    },
    grid: { borderColor: "#374151", strokeDashArray: 4 },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "45%" } },
    colors: ["#8b5cf6"],
    dataLabels: { enabled: false },
    tooltip: {
      theme: "dark",
      x: { show: true },
      y: {
        formatter: (val) => `${val} shipments`,
      },
    },
  };

  useEffect(() => {
    const fetchCarrierPerformance = async () => {
      if (!startDate || !endDate) {
        console.error("Start and end date are required.");
        return;
      }

      const formattedStart = formatDate(new Date(startDate));
      const formattedEnd = formatDate(new Date(endDate));

      const params = new URLSearchParams({
        startDate: formattedStart,
        endDate: formattedEnd,
      });

      if (enterpriseKey) {
        params.append("enterpriseKey", enterpriseKey);
      }

      if (selectedCarrier) {
        params.append("carrier", selectedCarrier);
      }

      if (selectedMethod) {
        params.append("shippingMethod", selectedMethod);
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/carrier-performance?${params.toString()}`
        );
        const data = await response.json();

        console.log("Carrier performance data:", data);

        const categories = data.map((item: any) => item.carrier);
        const seriesData = data.map((item: any) => item.shipment_count);

        setCarrierCategories(categories);
        setCarrierSeries([{ name: "Shipments", data: seriesData }]);
      } catch (error) {
        console.error("Failed to fetch carrier performance:", error);
        setCarrierCategories([]);
        setCarrierSeries([]);
      }
    };

    fetchCarrierPerformance();
  }, [startDate, endDate, selectedCarrier, selectedMethod, enterpriseKey]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
      {/* Shipment Status Donut Chart */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-zinc-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
          Shipment Status
        </h3>
        <Chart
          options={statusOptions}
          series={statusSeries}
          type="donut"
          height={300}
        />
      </div>

      {/* Carrier Performance Bar Chart */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-zinc-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
          Carrier Performance
        </h3>
        <Chart
          options={carrierOptions}
          series={carrierSeries}
          type="bar"
          height={300}
        />
      </div>
    </div>
  );
};

export default ShipmentCharts;
