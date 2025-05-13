import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";

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

const InventoryOverview: React.FC<{
  filters: Filters;
  isSidebarOpen?: boolean;
  isDarkTheme?: boolean;
}> = ({ filters, isSidebarOpen = true, isDarkTheme = false }) => {
  const [warehouseData, setWarehouseData] = useState<RegionData[]>([]);
  const [alertsData, setAlertsData] = useState([
    { label: "Available", value: "0%", count: 0, color: "text-green-500" },
    { label: "Low Stock", value: "0%", count: 0, color: "text-yellow-500" },
    { label: "Out of Stock", value: "0%", count: 0, color: "text-red-500" },
  ]);
  const [turnoverRates, setTurnoverRates] = useState<number[]>([]);
  const [restockSchedule, setRestockSchedule] = useState<any[]>([]);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange || [];

  const formatDate = (date: Date): string =>
    `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

  // Region distribution API
  useEffect(() => {
    const fetchRegionData = async () => {
      if (!startDate || !endDate) return;

      const formattedStart = formatDate(new Date(startDate));
      const formattedEnd = formatDate(new Date(endDate));

      try {
        const response = await fetch(
          `http://localhost:8080/api/inventory/region-distribution?startDate=${formattedStart}&endDate=${formattedEnd}`
        );
        const data: RegionData[] = await response.json();
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

  // Turnover rates and low stock alerts API
  useEffect(() => {
    const fetchTurnoverAndAlerts = async () => {
      if (!startDate || !endDate) return;

      const formattedStart = formatDate(new Date(startDate));
      const formattedEnd = formatDate(new Date(endDate));

      const params = new URLSearchParams({
        startDate: formattedStart,
        endDate: formattedEnd,
      });

      try {
        const response = await fetch(
          `http://localhost:8080/api/inventory/turnover-and-alerts?${params.toString()}`
        );
        const data = await response.json();

        // Set turnover rates and restock schedule
        setTurnoverRates(data.turnover_rates.map((item: any) => item.turnover_rate));
        setRestockSchedule(data.low_stock_alerts);
      } catch (error) {
        console.error("Failed to fetch turnover and alerts data:", error);
      }
    };

    fetchTurnoverAndAlerts();
  }, [startDate, endDate]);

  // Alerts API
  useEffect(() => {
    const fetchAlerts = async () => {
      if (!startDate || !endDate) return;

      const formattedStart = formatDate(new Date(startDate));
      const formattedEnd = formatDate(new Date(endDate));

      try {
        const res = await fetch(
          `http://localhost:8080/api/inventory/turnover-alerts?startDate=${formattedStart}&endDate=${formattedEnd}`
        );
        const data: AlertAPIResponse = await res.json();

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      ApexCharts.exec("warehouse-chart", "updateOptions", {});
      ApexCharts.exec("turnover-chart", "updateOptions", {});
    }, 400);
    return () => clearTimeout(timeout);
  }, [isSidebarOpen]);

  const warehouseChartOptions = {
    chart: { id: "warehouse-chart", type: "bar", toolbar: { show: false } },
    colors: ["#9614d0"],
    plotOptions: {
      bar: { borderRadius: 6, columnWidth: "50%" },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: warehouseData.map((d) => d.region),
      labels: { style: { colors: isDarkTheme ? "#ccc" : "#333" } },
      title: {
        text: "Region",
        style: { color: isDarkTheme ? "#ccc" : "#333", fontWeight: 600 },
      },
    },
    yaxis: {
      labels: { style: { colors: isDarkTheme ? "#ccc" : "#333" } },
      title: {
        text: "Inventory %",
        style: { color: isDarkTheme ? "#ccc" : "#333", fontWeight: 600 },
      },
    },
    tooltip: { theme: isDarkTheme ? "dark" : "light" },
  };

  const warehouseChartSeries = [
    {
      name: "Percentage",
      data: warehouseData.map((d) => parseFloat(d.percentage)),
    },
  ];

  const turnoverChartOptions = {
    chart: { id: "turnover-chart", type: "line", toolbar: { show: false } },
    colors: ["#9614d0"],
    stroke: { curve: "smooth", width: 3 },
    markers: {
      size: 4,
      colors: ["#fff"],
      strokeColors: "#9614d0",
      strokeWidth: 2,
    },
    xaxis: {
      categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
      labels: { style: { colors: isDarkTheme ? "#ccc" : "#333" } },
      title: {
        text: "Week",
        style: { color: isDarkTheme ? "#ccc" : "#333", fontWeight: 600 },
      },
    },
    yaxis: {
      labels: { style: { colors: isDarkTheme ? "#ccc" : "#333" } },
      title: {
        text: "Turnover Rate",
        style: { color: isDarkTheme ? "#ccc" : "#333", fontWeight: 600 },
      },
    },
    tooltip: { theme: isDarkTheme ? "dark" : "light" },
  };

  const turnoverChartSeries = [
    {
      name: "Turnover Rate",
      data: turnoverRates,
    },
  ];

  const restockTable = restockSchedule.map((item) => ({
    product: item.product_name,
    stock: item.stock_quantity,
    date: item.restock_date,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 transition-all duration-500 ease-in-out">
      {/* Left Column */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-1">Warehouse Inventory</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Regional Performance
        </p>

        <div className="space-y-3 mb-6">
          {warehouseData.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>{item.region}</span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                {item.percentage}
              </span>
            </div>
          ))}
        </div>

        <div className="h-56">
          <ReactApexChart
            options={warehouseChartOptions as any}
            series={warehouseChartSeries}
            type="bar"
            height="100%"
          />
        </div>
      </div>

      {/* Right Column */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Inventory Turnover & Alerts
        </h3>

        <div className="grid grid-cols-3 gap-3 text-center mb-4">
          {alertsData.map((item, i) => (
            <div key={i}>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.label}
              </p>
              <p className={`text-xl font-semibold ${item.color}`}>
                {item.value}
              </p>
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
          <h4 className="mb-2 font-medium text-gray-800 dark:text-white">
            Restock Schedule
          </h4>
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500 dark:text-gray-400">
              <tr>
                <th className="py-1.5">Product</th>
                <th className="py-1.5">Stock</th>
                <th className="py-1.5">Restock</th>
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
                    <td className="py-2 text-gray-800 dark:text-gray-100">
                      {item.product}
                    </td>
                    <td className="py-2 text-gray-700 dark:text-gray-300">
                      {item.stock}
                    </td>
                    <td className="py-2 text-gray-700 dark:text-gray-300">
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
