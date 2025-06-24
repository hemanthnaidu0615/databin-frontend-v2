import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import ReactApexChart from "react-apexcharts";
import { axiosInstance } from "../../../axios";
import { useDateRangeEnterprise } from "../../utils/useGlobalFilters";
import { formatDateTime } from "../../utils/kpiUtils";
import { getBaseTooltip, percentageTooltip, turnoverRateTooltip } from "../../modularity/graphs/graphWidget";

interface Filters {
  selectedRegion: string;
  selectedSource: string;
  selectedLocation: string;
}

interface RegionData {
  region: string;
  percentage: string;
}

interface AlertAPIResponse {
  out_of_stock_percentage: string;
  available_percentage: string;
  low_stock_percentage: string;
  out_of_stock: number;
  total_products: number;
  low_stock: number;
  available: number;
}

const InventoryOverview: React.FC<{ filters: Filters; isSidebarOpen?: boolean }> = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [warehouseData, setWarehouseData] = useState<RegionData[]>([]);
  const [alertsData, setAlertsData] = useState([
    { label: "Available", value: "0%", count: 0, color: "text-green-500" },
    { label: "Low Stock", value: "0%", count: 0, color: "text-yellow-500" },
    { label: "Out of Stock", value: "0%", count: 0, color: "text-red-500" },
  ]);
  const [turnoverRates, setTurnoverRates] = useState<number[]>([]);
  const [turnoverCategories, setTurnoverCategories] = useState<string[]>([]);
  const [restockSchedule, setRestockSchedule] = useState<any[]>([]);

  const { dateRange } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange || [];

  const warehouseTooltip = {
    ...getBaseTooltip(isDark, percentageTooltip),
    y: {
      ...getBaseTooltip(isDark, percentageTooltip).y,
      formatter: (val: number) => val.toLocaleString(),
    },
  };

  const turnoverTooltip = {
    ...getBaseTooltip(isDark, turnoverRateTooltip),
    y: {
      ...getBaseTooltip(isDark, turnoverRateTooltip).y,
      formatter: (val: number) => val.toLocaleString(),
    },
  };

  useEffect(() => {
    const fetchRegionData = async () => {
      if (!startDate || !endDate) return;

      const formattedStart = formatDateTime(startDate);
      const formattedEnd = formatDateTime(endDate);

      try {
        const response = await axiosInstance.get<RegionData[]>(
          "/inventory/region-distribution",
          {
            params: { startDate: formattedStart, endDate: formattedEnd },
          }
        );
        const data = response.data;

        const topFour = data
          .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
          .slice(0, 4);

        setWarehouseData(topFour);
      } catch (error) {
        console.error("Failed to fetch region distribution data:", error);
      }
    };

    fetchRegionData();
  }, [startDate, endDate]);

  useEffect(() => {
    const fetchTurnoverAndAlerts = async () => {
      if (!startDate || !endDate) return;

      const formattedStart = formatDateTime(startDate);
      const formattedEnd = formatDateTime(endDate);

      try {
        const response = await axiosInstance.get(
          "/inventory/turnover-and-alerts",
          {
            params: { startDate: formattedStart, endDate: formattedEnd },
          }
        );
        const data = response.data as {
          turnover_rates: { turnover_rate: number }[];
          low_stock_alerts: any[];
        };

        const rates = data.turnover_rates.map(
          (item: any) => item.turnover_rate
        );
        setTurnoverRates(rates);

        const start = new Date(startDate);
        const end = new Date(endDate);
        const daysDiff =
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        let labels: string[] = [];

        if (daysDiff > 360) {
          const startYear = start.getFullYear();
          const endYear = end.getFullYear();
          for (let y = startYear; y <= endYear; y++) {
            labels.push(`${y}`);
          }
        } else if (daysDiff > 60) {
          const date = new Date(start);
          while (date <= end) {
            labels.push(
              `${date.getFullYear()}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}`
            );
            date.setMonth(date.getMonth() + 1);
          }
        } else {
          const date = new Date(start);
          while (date <= end) {
            labels.push(
              `${date.getFullYear()}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${date
                  .getDate()
                  .toString()
                  .padStart(2, "0")}`
            );
            date.setDate(date.getDate() + 1);
          }
        }

        setTurnoverCategories(labels);
        setRestockSchedule(data.low_stock_alerts);
      } catch (error) {
        console.error("Failed to fetch turnover and alerts data:", error);
      }
    };

    fetchTurnoverAndAlerts();
  }, [startDate, endDate]);

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!startDate || !endDate) return;

      const formattedStart = formatDateTime(startDate);
      const formattedEnd = formatDateTime(endDate);

      try {
        const res = await axiosInstance.get("/inventory/turnover-alerts", {
          params: { startDate: formattedStart, endDate: formattedEnd },
        });
        const data = res.data as AlertAPIResponse;

        setAlertsData([
          {
            label: "Available",
            value: data.available_percentage,
            count: data.available,
            color: "text-green-500",
          },
          {
            label: "Low Stock",
            value: data.low_stock_percentage,
            count: data.low_stock,
            color: "text-yellow-500",
          },
          {
            label: "Out of Stock",
            value: data.out_of_stock_percentage,
            count: data.out_of_stock,
            color: "text-red-500",
          },
        ]);
      } catch (err) {
        console.error("Failed to fetch alert data:", err);
      }
    };

    fetchAlerts();
  }, [startDate, endDate]);

  const warehouseChartOptions = {
    chart: { id: "warehouse-chart", type: "bar", toolbar: { show: false } },
    colors: ["#a855f7"],
    plotOptions: { bar: { borderRadius: 6, columnWidth: "50%" } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: warehouseData.map((d) => d.region),
      labels: { style: { colors: isDark ? "#ccc" : "#333" } },
      title: {
        text: "Region",
        style: { color: isDark ? "#ccc" : "#333", fontWeight: 600 },
      },
      crosshairs: {
        show: false,
      },
    },

    yaxis: {
      labels: { style: { colors: isDark ? "#ccc" : "#333" } },
      title: {
        text: "Inventory %",
        style: { color: isDark ? "#ccc" : "#333", fontWeight: 600 },
      },
      crosshairs: {
        show: false,
      },
    },
    tooltip: warehouseTooltip,
  };

  const warehouseChartSeries = [
    {
      name: "Percentage",
      data: warehouseData.map((d) => parseFloat(d.percentage)),
    },
  ];

  const turnoverChartOptions = {
    chart: { id: "turnover-chart", type: "line", toolbar: { show: false } },
    colors: ["#a855f7"],
    stroke: { curve: "smooth", width: 3 },
    markers: {
      size: 4,
      colors: ["#fff"],
      strokeColors: "#a855f7",
      strokeWidth: 2,
    },
    xaxis: {
      categories: turnoverCategories,
      labels: { style: { colors: isDark ? "#ccc" : "#333" } },
      title: {
        text:
          turnoverCategories.length > 0 && turnoverCategories[0].length === 4
            ? "Year"
            : turnoverCategories[0]?.length <= 7
              ? "Month"
              : "Date",
        style: { color: isDark ? "#ccc" : "#333", fontWeight: 600 },
      },
      crosshairs: {
        show: false,
      },
    },
    yaxis: {
      labels: { style: { colors: isDark ? "#ccc" : "#333" } },
      title: {
        text: "Turnover Rate",
        style: { color: isDark ? "#ccc" : "#333", fontWeight: 600 },
      },
    },
    tooltip: turnoverTooltip,
    crosshairs: {
      show: false,
    },
  };

  const turnoverChartSeries = [
    {
      name: "Turnover Rate",
      data: turnoverRates.map((rate, i) => ({
        x: turnoverCategories[i] ?? `Point ${i + 1}`,
        y: rate,
      })),
    },
  ];

  const restockTable = restockSchedule.map((item) => ({
    product: item.product_name,
    stock: item.stock_quantity,
    date: item.restock_date,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 transition-all duration-500 ease-in-out">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md">
        <h3 className="app-subheading mb-1">Warehouse Inventory</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Regional Performance
        </p>

        <div className="space-y-3 mb-6">
          {warehouseData.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="app-table-content">{item.region}</span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400 app-table-content">
                {item.percentage}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full h-65 overflow-hidden">
          <ReactApexChart
            options={warehouseChartOptions as any}
            series={warehouseChartSeries}
            type="bar"
            height="100%"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md">
        <h3 className="app-subheading mb-4 text-gray-800 dark:text-white">
          Inventory Turnover & Alerts
        </h3>

        <div className="grid grid-cols-3 gap-3 text-center mb-4">
          {alertsData.map((item, i) => (
            <div key={i}>
              <p className="app-widget-label text-gray-500 dark:text-gray-400">
                {item.label}
              </p>
              <p className={`app-widget-value ${item.color}`}>{item.value}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {item.count} products
              </p>
            </div>
          ))}
        </div>

        <div className="h-40 mb-6">
          <ReactApexChart
            options={turnoverChartOptions as any}
            series={turnoverChartSeries}
            type="line"
            height="100%"
          />
        </div>

        <div className="text-sm">
          <h4 className="mb-2 font-medium text-gray-800 dark:text-white app-widget-label">
            Restock Schedule
          </h4>
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500 dark:text-gray-400">
              <tr>
                <th className="py-1.5 app-table-heading">Product</th>
                <th className="py-1.5 app-table-heading">Stock</th>
                <th className="py-1.5 app-table-heading">Restock</th>
              </tr>
            </thead>
            <tbody>
              {restockTable
                .sort((a, b) => a.stock - b.stock)
                .map((item, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-200 dark:border-gray-700"
                  >
                    <td className="py-2 text-gray-800 dark:text-gray-100 app-table-content">
                      {item.product}
                    </td>
                    <td className="py-2 text-gray-700 dark:text-gray-300 app-table-content">
                      {item.stock}
                    </td>
                    <td className="py-2 text-gray-700 dark:text-gray-300 app-table-content">
                      {item.date}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryOverview;
