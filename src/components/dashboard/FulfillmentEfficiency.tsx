"use client";

import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../axios";
import { formatDateTime, formatValue, formatDateMDY } from "../utils/kpiUtils";
import { useDateRangeEnterprise } from "../utils/useGlobalFilters";
import { getBaseTooltip, ordersTooltip } from "../modularity/graphs/graphWidget";
import CommonButton from "../modularity/buttons/Button";
import { FaTable } from "react-icons/fa";
import FilteredDataDialog from "../modularity/tables/FilteredDataDialog";
import { TableColumn } from "../modularity/tables/BaseDataTable";

type FulfillmentEfficiencyProps = {
  size?: "small" | "full";
};

const fulfillmentColumns: TableColumn<any>[] = [
  { field: "order_id", header: "Order ID", sortable: true, filter: true },
  { field: "category", header: "Category", sortable: true, filter: true },
  { field: "event_type", header: "Event Type", sortable: true, filter: true },
  { field: "event_description", header: "Description", filter: true },
  {
    field: "event_time",
    header: "Timestamp",
    sortable: true,
    // Change this line to use formatDateMDY
    body: (row) => formatDateMDY(row.event_time),
  },
  { field: "handler_name", header: "Handler", filter: true },
];

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

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange || [];

  const [showAllDialog, setShowAllDialog] = useState(false);
  const [showFilteredDialog, setShowFilteredDialog] = useState(false);
  const [filterParams, setFilterParams] = useState<Record<string, any>>({});

  

  const baseTooltip = getBaseTooltip(isDark, ordersTooltip);
  const tooltip = {
    ...baseTooltip,
    y: { ...baseTooltip.y, formatter: (val: number) => formatValue(val) },
  };

  useEffect(() => {
    const savedScroll = sessionStorage.getItem("scrollPosition");
    if (savedScroll) {
      window.scrollTo({ top: parseInt(savedScroll, 10), behavior: "auto" });
      sessionStorage.removeItem("scrollPosition");
    }
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchSummary = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          startDate: formatDateTime(startDate),
          endDate: formatDateTime(endDate),
        });
        if (enterpriseKey) params.append("enterpriseKey", enterpriseKey);

        const response = await axiosInstance.get(
          `/fulfillment-efficiency/summary?${params.toString()}`
        );
        const summary = response.data.fulfillment_summary;

        const sumValues = (obj: Record<string, number>) =>
          Object.values(obj || {}).reduce((sum, value) => sum + value, 0);

        setChartData({
          categories: ["Picked", "Packed", "Shipped", "Delivered"],
          totals: [
            sumValues(summary.Picked),
            sumValues(summary.Packed),
            sumValues(summary.Shipped),
            sumValues(summary.Delivered),
          ],
        });
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [startDate, endDate, enterpriseKey]);

  useEffect(() => {
    if (filterParams.category) {
      setShowFilteredDialog(true);
    }
  }, [filterParams]);

  const fetchFulfillmentData = (customFilters: any = {}) => {
  return async (tableParams: any) => {
    if (!startDate || !endDate) return { data: [], count: 0 };

    const requestParams = {
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      enterpriseKey,
      ...customFilters,
      ...tableParams,
    };

    const res = await axiosInstance.get("/fulfillment-efficiency/details-grid", {
      params: requestParams,
    });

    return {
      data: Array.isArray(res.data.fulfillment_details) ? res.data.fulfillment_details : [],
      count: typeof res.data.count === "number" ? res.data.count : 0,
    };
  };
};


  const handleViewMore = () => {
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    navigate("/fulfillment");
  };

  const apexOptions: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
      foreColor: "#a855f7",
      events: {
        dataPointSelection: (_e, _ctx, config) => {
          const category = chartData.categories[config.dataPointIndex];
         setFilterParams({
      category,
      "category.value": category,
      "category.matchMode": "equals"
    });
        },
      },
    },
    colors: ["#a855f7"],
    plotOptions: { bar: { columnWidth: "70%" } },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => formatValue(val),
      style: { colors: ["#fff"], fontSize: "12px" },
    },
    xaxis: {
      categories: chartData.categories,
      title: { text: "Stage", style: { fontWeight: "400", fontSize: "14px", color: "#a855f7" } },
      labels: { style: { fontSize: "12px", colors: "#a855f7" } },
      crosshairs: { show: false },
    },
    yaxis: {
      title: { text: "Orders", style: { fontWeight: "400", fontSize: "14px", color: "#a855f7" } },
      labels: { formatter: (val) => formatValue(val), style: { fontSize: "12px", colors: "#a855f7" } },
    },
    tooltip,
    legend: { position: "bottom", labels: { colors: "#a855f7" } },
  };

  const mobileCardRender = (item: any, index: number) => (
  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100">
        Order ID: {item.order_id}
      </h3>
      <span
        className={`px-2 py-1 text-xs font-medium rounded ${item.event_type === "Completed"
          ? "bg-green-100 text-green-800"
          : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          }`}
      >
        {item.event_type}
      </span>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1"><strong>Category:</strong> {item.category}</p>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1"><strong>Description:</strong> {item.event_description}</p>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1"><strong>Handler:</strong> {item.handler_name}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400"><strong>Timestamp:</strong> {formatDateMDY(item.event_time)}</p>
  </div>
);

  return (
    <div className={`overflow-hidden rounded-2xl shadow-md border ${theme === "dark" ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`} style={{ padding: "1rem" }}>
      <div className="flex justify-between items-center mb-14">
        <h2 className="app-subheading">Fulfillment Efficiency Summary</h2>
        <div className="flex gap-2 items-center">
          <CommonButton variant="responsive" onClick={handleViewMore} text="View More" showMobile={true} showDesktop={true} />
          <button onClick={() => setShowAllDialog(true)} className="text-purple-500" title="View all data">
            <FaTable size={18} />
          </button>
        </div>
      </div>

      <div style={{ height: size === "small" ? 220 : 400 }}>
        {isLoading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-500">Error: {error}</p>
        ) : (
          <Chart options={apexOptions} series={[{ name: "Orders", data: chartData.totals }]} type="bar" height="100%" width="100%" />
        )}
      </div>

      <FilteredDataDialog
        visible={showAllDialog}
        onHide={() => setShowAllDialog(false)}
        header="All Fulfillment Events"
        columns={fulfillmentColumns}
        fetchData={() => fetchFulfillmentData(filterParams)}
        mobileCardRender={mobileCardRender}
      />

      <FilteredDataDialog
        visible={showFilteredDialog}
        onHide={() => {
          setShowFilteredDialog(false);
          setFilterParams({});
        }}
        header={`Filtered Category: ${filterParams["category.value"] ?? "N/A"}`}
        columns={fulfillmentColumns}
        fetchData={() => fetchFulfillmentData(filterParams)}
        filterParams={filterParams}
        mobileCardRender={mobileCardRender}
      />
    </div>
  );
};

export default FulfillmentEfficiency;
