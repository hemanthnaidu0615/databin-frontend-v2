import { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { Dropdown } from "primereact/dropdown";
import { ApexOptions } from "apexcharts";
import dayjs from "dayjs";
import { useTheme } from "next-themes";
import { axiosInstance } from "../../../../axios";
import { formatDate } from "../../../utils/kpiUtils";
import { getBaseToolTip, salesTooltip } from "../../../modularity/graphs/graphWidget";
import { useDateRangeEnterprise } from "../../../utils/useGlobalFilters";

import { PrimeSelectFilter } from "../../../modularity/dropdowns/Dropdown";

// NEW IMPORTS FOR DETAILED TABLE & DIALOG
import { FaTable } from "react-icons/fa";
import FilteredDataDialog from "../../../modularity/tables/FilteredDataDialog";
import { TableColumn } from "../../../modularity/tables/BaseDataTable";

const SalesTrendsChart = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Chart states (UNCHANGED)
  const [chartType, setChartType] = useState<"bar" | "line">("line");
  const [channels, setChannels] = useState<string[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [salesData, setSalesData] = useState<
    { period: string; total_amount: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aggregationLevel, setAggregationLevel] = useState<string>("day");

  const { dateRange, enterpriseKey } = useDateRangeEnterprise();

  const [startDate, endDate] = dateRange || [];

  // --- NEW STATES for dialog and filtered params
  const [showDialog, setShowDialog] = useState(false);
  const [filteredParams, setFilteredParams] = useState<{ period?: string; channel?: string }>({});

  // Chart data fetching (UNCHANGED)
  useEffect(() => {
    const fetchSalesData = async () => {
      if (!startDate || !endDate) return;

      setLoading(true);
      setError(null);

      const formattedStart = formatDate(startDate);
      const formattedEnd = formatDate(endDate);

      const params = new URLSearchParams({
        startDate: formattedStart,
        endDate: formattedEnd,
      });

      if (enterpriseKey) {
        params.append("enterpriseKey", enterpriseKey);
      }

      if (selectedChannel && selectedChannel !== "all") {
        params.append("fulfillmentChannel", selectedChannel);
      }

      try {
        const res = await axiosInstance.get(
          `analysis/sales-by-date?${params.toString()}`
        );
        const data = res.data as {
          sales?: { period: string; total_amount: number }[];
          aggregation_level?: string;
        };

        setSalesData(data.sales || []);
        setAggregationLevel(data.aggregation_level || "day");
      } catch (err) {
        console.error("Error fetching sales data", err);
        setError("Failed to load sales data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [startDate, endDate, enterpriseKey, selectedChannel]);

  // Channel fetching (UNCHANGED)
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await axiosInstance.get("analysis/channels");
        const data = res.data as { channels?: string[] };
        setChannels(data.channels || []);
      } catch (err) {
        console.error("Error fetching channels", err);
        setError("Failed to load channel options. Using default channels.");
      }
    };

    fetchChannels();
  }, []);

  // Memoized chart categories and values (UNCHANGED)
  const { categories, values } = useMemo(() => {
    if (!salesData.length) return { categories: [], values: [] };

    const categories = salesData.map((entry) => {
      const date = dayjs(entry.period);
      switch (aggregationLevel) {
        case "week":
          return `${date.format("MMM D")}`;
        case "month":
          return date.format("MMMM YYYY");
        case "year":
          return date.format("YYYY");
        case "day":
        default:
          return date.format("MMM D, YYYY");
      }
    });

    const values = salesData.map((entry) => entry.total_amount);

    return { categories, values };
  }, [salesData, aggregationLevel]);

  // Chart options with new event for dataPointSelection to open dialog
  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: chartType,
        toolbar: { show: false },
        foreColor: theme === "dark" ? "#CBD5E1" : "#374151",
        zoom: { enabled: false },

        // NEW EVENT: open dialog on chart point click
        events: {
          dataPointSelection: (_event, _chartContext, config) => {
            const clickedPeriod = salesData[config.dataPointIndex]?.period;
            if (clickedPeriod) {
              setFilteredParams({ period: clickedPeriod, channel: selectedChannel });
              setShowDialog(true);
            }
          },
        },
      },

      tooltip: getBaseToolTip(isDark, salesTooltip),

      xaxis: {
        type: "category",
        categories: categories,
        labels: {
          rotate: -45,
          style: {
            colors: theme === "dark" ? "#CBD5E1" : "#374151",
          },
        },
        title: {
          text:
            aggregationLevel === "day"
              ? "Date"
              : aggregationLevel === "week"
                ? "Week"
                : aggregationLevel === "month"
                  ? "Month"
                  : "Year",
          style: {
            fontSize: "14px",
            fontWeight: "normal",
            color: theme === "dark" ? "#CBD5E1" : "#64748B",
          },
        },
      },
      yaxis: {
        title: {
          text: "Sales ($)",
          style: {
            fontSize: "14px",
            fontWeight: "normal",
            color: theme === "dark" ? "#CBD5E1" : "#64748B",
          },
        },
        labels: {
          formatter: (val: number) => {
            if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
            if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
            return `$${val}`;
          },
        },
      },
      stroke: {
        curve: "smooth",
        width: chartType === "line" ? 2 : 0,
      },
      markers: {
        size: 5,
        colors: ["#ffffff"],
        strokeColors: "#a855f7",
        strokeWidth: 3,
        hover: { size: 7 },
      },
      dataLabels: { enabled: false },
      colors: ["#a855f7"],
      grid: {
        borderColor: theme === "dark" ? "#334155" : "#e5e7eb",
      },
      legend: { show: false },
    }),
    [chartType, theme, categories, aggregationLevel, salesData, selectedChannel, isDark]
  );

  // New: columns definition for FilteredDataDialog
  const columns: TableColumn<any>[] = [
    { field: "order_id", header: "Order ID", sortable: true, filter: true },
    { field: "fulfillment_channel", header: "Channel", sortable: true, filter: true },
    { field: "subtotal", header: "Subtotal", sortable: true, filter: true },
    { field: "shipping_fee", header: "Shipping Fee", sortable: true, filter: true },
    { field: "tax_amount", header: "Tax", sortable: true, filter: true },
    { field: "discount_amount", header: "Discount", sortable: true, filter: true },
    { field: "total_amount", header: "Total", sortable: true, filter: true },
  ];

  // New: data fetch function for dialog table with filters
  const fetchTableData = (extraFilters: any = {}) => async (tableParams: any) => {
    const response = await axiosInstance.get("/analysis/details-sales-trends-grid", {
      params: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        enterpriseKey,
        fulfillmentChannel: extraFilters.channel !== "all" ? extraFilters.channel : undefined,
        period: extraFilters.period,
        ...tableParams,
      },
    });

    return {
      data: response.data.data,
      count: response.data.totalRecords,
    };
  };

  // New: mobile card renderer for FilteredDataDialog
  const renderMobileCard = (item: any, index: number) => (
    <div key={index} className="p-4 mb-3 border rounded shadow-sm bg-white dark:bg-gray-800">
      <div><b>Order ID:</b> {item.order_id}</div>
      <div><b>Channel:</b> {item.fulfillment_channel}</div>
      <div><b>Subtotal:</b> ${item.subtotal}</div>
      <div><b>Shipping:</b> ${item.shipping_fee}</div>
      <div><b>Tax:</b> ${item.tax_amount}</div>
      <div><b>Discount:</b> ${item.discount_amount}</div>
      <div><b>Total:</b> ${item.total_amount}</div>
    </div>
  );

  if (!startDate || !endDate) {
    return (
      <div className="border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-md bg-white dark:bg-gray-900 rounded-xl">
        <div className="text-center text-gray-500 dark:text-gray-400">
          Please select a date range to view sales trends
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-md bg-white dark:bg-gray-900 rounded-xl">
        <div className="text-center text-gray-500 dark:text-gray-400">
          Loading sales data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-md bg-white dark:bg-gray-900 rounded-xl">
        <div className="text-center text-red-500 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="relative border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-md bg-white dark:bg-gray-900 rounded-xl">
      {/* FILTERS & CHART UI (UNCHANGED) */}
      <div className="flex gap-2 flex-wrap mb-4">
        <PrimeSelectFilter<"line" | "bar">
          value={chartType}
          options={[
            { label: "Line", value: "line" as "line" },
            { label: "Bar", value: "bar" as "bar" },
          ]}
          onChange={setChartType}
          className="w-46"
        />
        <Dropdown
          value={selectedChannel}
          options={[
            { label: "Sales Channel", value: "all" },
            ...channels.map((ch) => ({
              label: ch,
              value: ch,
            })),
          ]}
          onChange={(e) => setSelectedChannel(e.value)}
          placeholder="Select Channel"
          className="w-46"
          disabled={channels.length === 0}
        />
      </div>

      {/* NEW BUTTON to open full table dialog */}
      <div className="absolute top-4 right-4">
        <button
          className="text-purple-500 hover:text-purple-700 p-2 rounded"
          title="View All"
          onClick={() => {
            setFilteredParams({ channel: selectedChannel });
            setShowDialog(true);
          }}
          aria-label="View All"
        >
          <FaTable size={18} />
        </button>
      </div>


      {/* YOUR EXISTING CHART (UNCHANGED) */}
      {categories.length > 0 ? (
        <Chart
          options={chartOptions}
          series={[
            {
              name: "Sales",
              data: values,
            },
          ]}
          type={chartType}
          height={350}
        />
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 h-[350px] flex items-center justify-center">
          No sales data available for the selected filters
        </div>
      )}

      {/* NEW DIALOG with detailed sales data */}
      <FilteredDataDialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header="Sales Trends – Detailed View"
        fetchData={(params?: any) => fetchTableData({ ...filteredParams, ...params })}
        columns={columns}
        mobileCardRender={renderMobileCard}
      />
    </div>
  );
};

export default SalesTrendsChart;
