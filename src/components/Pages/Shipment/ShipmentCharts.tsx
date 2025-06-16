import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { axiosInstance } from "../../../axios";
import { formatDateTime, formatValue } from "../../utils/kpiUtils";
import { useDateRangeEnterprise } from "../../utils/useGlobalFilters";
import { getBaseTooltip, shipmentsTooltip } from "../../modularity/graphs/graphWidget";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange || [];
  const labelColor = isDark ? "#d4d4d8" : "#52525b";
  const baseTooltip = getBaseTooltip(isDark, shipmentsTooltip);

  const tooltipWithoutDollar = {
    ...baseTooltip,
    y: {
      ...baseTooltip.y,
      formatter: (val: number) => val.toLocaleString(),
    },
  };

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
    colors: ["#22c55e", "#a855f7", "#facc15", "#ef4444"],
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

      const formattedStart = formatDateTime(startDate);
      const formattedEnd = formatDateTime(endDate);

      try {
        const response = await axiosInstance.get(
          "shipment-status/distribution",
          {
            params: {
              startDate: formattedStart,
              endDate: formattedEnd,
              ...(enterpriseKey && { enterpriseKey }),
              ...(selectedCarrier && { carrier: selectedCarrier }),
              ...(selectedMethod && { shippingMethod: selectedMethod }),
            },
          }
        );
        const data = response.data as {
          delivered?: string;
          in_transit?: string;
          delayed?: string;
          cancelled?: string;
        };

        console.log("Shipment status distribution:", data);

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
      crosshairs: { show: false },
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
    grid: { borderColor: isDark ? "#4b5563" : "#e5e7eb", strokeDashArray: 4 },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "45%" } },
    colors: ["#a855f7"],
    dataLabels: { enabled: false },
    tooltip: tooltipWithoutDollar,
  };

  useEffect(() => {
    const fetchCarrierPerformance = async () => {
      if (!startDate || !endDate) {
        console.error("Start and end date are required.");
        return;
      }

      const formattedStart = formatDateTime(startDate);
      const formattedEnd = formatDateTime(endDate);

      try {
        const response = await axiosInstance.get("carrier-performance", {
          params: {
            startDate: formattedStart,
            endDate: formattedEnd,
            ...(enterpriseKey && { enterpriseKey }),
            ...(selectedCarrier && { carrier: selectedCarrier }),
            ...(selectedMethod && { shippingMethod: selectedMethod }),
          },
        });
        const data = response.data as Array<{
          carrier: string;
          shipment_count: number;
        }>;

        console.log("Carrier performance data:", data);

        const categories = data.map((item) => item.carrier);
        const seriesData = data.map((item) => item.shipment_count);

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
        <h3 className="app-subheading">Shipment Status</h3>
        <Chart
          options={statusOptions}
          series={statusSeries}
          type="donut"
          height={300}
        />
      </div>

      {/* Carrier Performance Bar Chart */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-zinc-200 dark:border-gray-800">
        <h3 className="app-subheading">Carrier Performance</h3>
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
