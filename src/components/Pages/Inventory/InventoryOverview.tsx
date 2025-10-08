import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import ReactApexChart from "react-apexcharts";
import { axiosInstance } from "../../../axios";
import { useDateRangeEnterprise } from "../../utils/useGlobalFilters";
import { formatDateTime, formatDateMDY } from "../../utils/kpiUtils";
import {
  getBaseToolTip,
  getBaseTooltip,
  percentageTooltip,
  turnoverRateTooltip,
} from "../../modularity/graphs/graphWidget";

import { FaTable } from "react-icons/fa";
import FilteredDataDialog from "../../modularity/tables/FilteredDataDialog";
import * as XLSX from "xlsx";
import ExportIcon from '../../../images/export.png';

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

  const [openWarehouseDialog, setOpenWarehouseDialog] = useState(false);
  const [openTurnoverDialog, setOpenTurnoverDialog] = useState(false);
  const [filterParams, setFilterParams] = useState<any>({});

  useEffect(() => {
    if (filterParams.region) {
      setOpenWarehouseDialog(true);
    }
  }, [filterParams]);

  const { dateRange } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange || [];

  const exportToXLSX = (data: any[], fileName: string, sheetName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, fileName);
  };

  const exportWarehouseData = async () => {
    try {
      if (!startDate || !endDate) {
        alert('Date range not available. Please select a date range.');
        return;
      }

      const formattedStart = formatDateTime(startDate);
      const formattedEnd = formatDateTime(endDate);

      const response = await axiosInstance.get("/inventory/details-grid", {
        params: {
          startDate: formattedStart,
          endDate: formattedEnd,
          size: 100000,
        },
      });
      const dataToExport = response.data.data.map((item: any) => ({
        "Inventory ID": item.inventory_id,
        "Product ID": item.product_id,
        "Region": item.region,
        "Stock Quantity": item.stock_quantity,
        "Reserved Quantity": item.reserved_quantity,
      }));
      exportToXLSX(dataToExport, "warehouse_inventory_export.xlsx", "Warehouse Inventory");
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export data.");
    }
  };

  const exportTurnoverData = async () => {
    try {
      if (!startDate || !endDate) {
        alert('Date range not available. Please select a date range.');
        return;
      }

      const formattedStart = formatDateTime(startDate);
      const formattedEnd = formatDateTime(endDate);

      const response = await axiosInstance.get("/inventory/details-grid-turnover", {
        params: {
          startDate: formattedStart,
          endDate: formattedEnd,
          size: 100000,
        },
      });
      const dataToExport = response.data.data.map((item: any) => ({
        "Product ID": item.product_id,
        "Product Name": item.name,
        "Stock Quantity": item.stock_quantity,
        "Restock Date": item?.restock_date ? formatDateMDY(item.restock_date) : "N/A",
        "Status": item.status,
      }));
      exportToXLSX(dataToExport, "inventory_turnover_export.xlsx", "Inventory Turnover");
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export data.");
    }
  };

  const warehouseTooltip = {
    ...getBaseTooltip(isDark, percentageTooltip),
    y: {
      ...getBaseTooltip(isDark, percentageTooltip).y,
      formatter: (val: number) => val.toLocaleString(),
    },
  };

  const turnoverTooltip = {
    ...getBaseToolTip(isDark, turnoverRateTooltip),
    y: {
      ...getBaseToolTip(isDark, turnoverRateTooltip).y,
      formatter: (val: number) => val.toLocaleString(),
    },
  };

  const fetchWarehouseData = (params?: any) => async (tableParams: any) => {
    const formattedStart = formatDateTime(startDate);
    const formattedEnd = formatDateTime(endDate);

    const response = await axiosInstance.get("/inventory/details-grid", {
      params: {
        startDate: formattedStart,
        endDate: formattedEnd,
        ...params,
        ...tableParams,
      },
    });

    return {
      data: response.data.data,
      count: response.data.count,
    };
  };

  const fetchTurnoverData = (params?: any) => async (tableParams: any) => {
    const formattedStart = formatDateTime(startDate);
    const formattedEnd = formatDateTime(endDate);

    const response = await axiosInstance.get("/inventory/details-grid-turnover", {
      params: {
        startDate: formattedStart,
        endDate: formattedEnd,
        ...params,
        ...tableParams,
      },
    });

    return {
      data: response.data.data,
      count: response.data.count,
    };
  };

  const warehouseColumns = [
    { field: "inventory_id", header: "Inventory ID", sortable: true, filter: true },
    { field: "product_id", header: "Product ID", sortable: true, filter: true },
    { field: "region", header: "Region", sortable: true, filter: true },
    { field: "stock_quantity", header: "Stock Quantity", sortable: true, filter: true },
    { field: "reserved_quantity", header: "Reserved Quantity", sortable: true, filter: true },
  ];

  const turnoverColumns = [
    { field: "product_id", header: "Product ID", sortable: true, filter: true },
    { field: "name", header: "Product Name", sortable: true, filter: true },
    { field: "stock_quantity", header: "Stock Quantity", sortable: true, filter: true },
    {
      field: "restock_date",
      header: "Restock Date",
      sortable: true,
      filter: true,
      body: (rowData: any) =>
        rowData?.restock_date ? formatDateMDY(rowData.restock_date) : "N/A",
    },
    { field: "status", header: "Status", sortable: true, filter: true },
  ];

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
        const response = await axiosInstance.get("/inventory/turnover-and-alerts", {
          params: { startDate: formattedStart, endDate: formattedEnd },
        });
        const data = response.data as {
          turnover_rates: { turnover_rate: number }[];
          low_stock_alerts: any[];
        };

        const rates = data.turnover_rates.map((item) => item.turnover_rate);
        setTurnoverRates(rates);

        const start = new Date(startDate);
        const end = new Date(endDate);
        const daysDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

        let labels: string[] = [];

        if (daysDiff > 360) {
          for (let y = start.getFullYear(); y <= end.getFullYear(); y++) {
            labels.push(`${y}`);
          }
        } else if (daysDiff > 60) {
          const date = new Date(start);
          while (date <= end) {
            labels.push(`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`);
            date.setMonth(date.getMonth() + 1);
          }
        } else {
          const date = new Date(start);
          while (date <= end) {
            labels.push(
              `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
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
    chart: {
      id: "warehouse-chart",
      type: "bar",
      toolbar: { show: false },
      events: {
        dataPointSelection: (_event: any, _chartContext: any, config: any) => {
          const clickedIndex = config.dataPointIndex;
          const regionClicked = warehouseData[clickedIndex]?.region;
          if (regionClicked) {
            setFilterParams({
              "region.value": regionClicked,
              "region.matchMode": "equals"
            });
            setOpenWarehouseDialog(true);
          }
        }
      }
    },
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
    },
    yaxis: {
      labels: { style: { colors: isDark ? "#ccc" : "#333" } },
      title: {
        text: "Inventory %",
        style: { color: isDark ? "#ccc" : "#333", fontWeight: 600 },
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
    chart: {
      id: "turnover-chart",
      type: "line",
      toolbar: { show: false },
      events: {
        dataPointSelection: (_event: any, _chartContext: any, config: any) => {
          const clickedIndex = config.dataPointIndex;
          const clickedDate = turnoverCategories[clickedIndex];
          if (clickedDate) {
            setFilterParams({
              "restock_date.value": clickedDate,
              "restock_date.matchMode": "equals",
            });
            setOpenTurnoverDialog(true);
          }
        }
      }
    },
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
    },
    yaxis: {
      labels: { style: { colors: isDark ? "#ccc" : "#333" } },
      title: {
        text: "Turnover Rate",
        style: { color: isDark ? "#ccc" : "#333", fontWeight: 600 },
      },
    },
    tooltip: turnoverTooltip,
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
    date: item?.restock_date ? formatDateMDY(item.restock_date) : "N/A",
  }));

  const renderWarehouseMobileCard = (item: any, index: number) => (
    <div
      key={index}
      className="p-4 mb-3 rounded shadow-md bg-white dark:bg-gray-800 border dark:border-gray-700"
    >
      <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
        Inventory ID: <span className="font-semibold">{item.inventory_id}</span>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
        Product ID: <span className="font-semibold">{item.product_id}</span>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
        Region: <span className="font-semibold">{item.region}</span>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
        Stock Quantity: <span className="font-semibold">{item.stock_quantity}</span>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-300">
        Reserved Quantity: <span className="font-semibold">{item.reserved_quantity}</span>
      </div>
    </div>
  );

  const renderTurnoverMobileCard = (item: any, index: number) => (
    <div
      key={index}
      className="p-4 mb-3 rounded shadow-md bg-white dark:bg-gray-800 border dark:border-gray-700"
    >
      <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
        Product ID: <span className="font-semibold">{item.product_id}</span>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
        Product Name: <span className="font-semibold">{item.name}</span>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
        Stock Quantity: <span className="font-semibold">{item.stock_quantity}</span>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
        Restock Date: <span className="font-semibold">{item?.restock_date ? formatDateMDY(item.restock_date) : "N/A"}</span>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-300">
        Status: <span className="font-semibold">{item.status}</span>
      </div>
    </div>
  );

  return (
    <>
      <FilteredDataDialog
        visible={openWarehouseDialog}
        onHide={() => setOpenWarehouseDialog(false)}
        fetchData={() => fetchWarehouseData(filterParams)}
        columns={warehouseColumns}
        header={
          filterParams.region
            ? `Inventory Details for ${filterParams.region}`
            : "Warehouse Inventory Details"
        }
        mobileCardRender={renderWarehouseMobileCard}
      />

      <FilteredDataDialog
        visible={openTurnoverDialog}
        onHide={() => setOpenTurnoverDialog(false)}
        fetchData={() => fetchTurnoverData(filterParams)}
        columns={turnoverColumns}
        header="Inventory Turnover & Restock Details"
        mobileCardRender={renderTurnoverMobileCard}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="app-subheading">Warehouse Inventory</h3>
            <div className="flex items-center gap-2">
              <button                
              onClick={exportWarehouseData}
              >
              <img src={ExportIcon} alt="Export" className="w-6" />

              </button>
              <FaTable
                onClick={() => {
                  setFilterParams({});
                  setOpenWarehouseDialog(true);
                }}
                className="text-purple-500 hover:text-purple-700"
                title="View Table"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Regional Performance</p>

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

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md relative">
          <div className="flex justify-between items-center">
            <h3 className="app-subheading mb-4 text-gray-800 dark:text-white">
              Inventory Turnover & Alerts
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={exportTurnoverData}
              >
              <img src={ExportIcon} alt="Export" className="w-6" />

              </button>
              <FaTable
                onClick={() => {
                  setFilterParams({});
                  setOpenTurnoverDialog(true);
                }}
                className="text-purple-500 hover:text-purple-700"
                title="View Table"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center mb-4">
            {alertsData.map((item, i) => (
              <div
                key={i}
                className="cursor-pointer"
                onClick={() => {
                  setFilterParams({
                    "status.value": item.label,
                    "status.matchMode": "equals",
                  });
                  setOpenTurnoverDialog(true);
                }}
              >
                <p className="app-widget-label text-gray-500 dark:text-gray-400">{item.label}</p>
                <p className={`app-widget-value ${item.color}`}>{item.value}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{item.count} products</p>
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
    </>
  );
};

export default InventoryOverview;