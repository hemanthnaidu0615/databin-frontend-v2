import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { axiosInstance } from "../../../axios";
import { useDateRangeEnterprise } from "../../utils/useGlobalFilters";
import { formatDateTime, formatDateMDY } from "../../utils/kpiUtils";
import { getBaseTooltip, avgTimeTooltip } from "../../modularity/graphs/graphWidget";
import { TableColumn } from "../../modularity/tables/BaseDataTable";
import FilteredDataDialog from "../../modularity/tables/FilteredDataDialog";
import { FaTable } from "react-icons/fa";
import * as XLSX from "xlsx";

const BottleneckChart = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const baseTooltip = getBaseTooltip(isDark, avgTimeTooltip);

  const tooltipWithoutDollar = {
    ...baseTooltip,
    y: {
      ...baseTooltip.y,
      formatter: (val: number) => val.toLocaleString(),
    },
  };

  const [chartOptions, setChartOptions] = useState<ApexOptions>({
    chart: {
      type: "bar",
      height: 320,
      width: "100%",
      toolbar: { show: false },
      background: "transparent",
      foreColor: isDark ? "#d1d5db" : "#333",
      events: {
        dataPointSelection: (_event, _chartContext, config) => {
          const category = chartOptions.xaxis?.categories?.[config.dataPointIndex];
          if (category) {
            setFilterParams({ eventType: category });
            setShowFilteredDialog(true);
          }
        },
      },
    },
    tooltip: tooltipWithoutDollar,
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: "60%",
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#fff"],
      },
    },
    colors: ["#a855f7"],
    xaxis: {
      categories: [],
      title: {
        text: "Process Stage",
        style: {
          color: "#a855f7",
          fontWeight: 600,
        },
      },
      labels: {
        style: {
          colors: "#a855f7",
        },
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
      labels: {
        style: {
          colors: "#a855f7",
          fontSize: "12px",
        },
      },
    },
    grid: {
      show: true,
      borderColor: isDark ? "#3f3f46" : "#e5e7eb",
      row: {
        colors: ["transparent"],
      },
    },
    theme: {
      mode: isDark ? "dark" : "light",
    },
  });

  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([
    {
      name: "Avg Time (hrs)",
      data: [],
    },
  ]);

  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange || [];

  const [showAllDialog, setShowAllDialog] = useState(false);
  const [showFilteredDialog, setShowFilteredDialog] = useState(false);
  
const exportToXLSX = (data: any[]) => {
  const renamedData = data.map((item) => ({
    "Process Stage": item.process_stage,
    "Average Time (hrs)": item.avg_time,
  }));

  const worksheet = XLSX.utils.json_to_sheet(renamedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Bottleneck Analysis");
  XLSX.writeFile(workbook, "bottleneck_analysis_export.xlsx");
};

const exportData = async () => {
  try {
    const [startDate, endDate] = dateRange || [];

    if (!startDate || !endDate) {
      alert("Date range not available. Please select a date range.");
      return;
    }

    const formattedStart = formatDateTime(startDate);
    const formattedEnd = formatDateTime(endDate);

    const params = {
      startDate: formattedStart,
      endDate: formattedEnd,
      enterpriseKey: enterpriseKey || undefined,
      size: "100000",
    };

    const response = await axiosInstance.get(
      `/fulfillment/bottleneck-analysis`,
      { params }
    );
    const dataToExport = response.data || [];
    exportToXLSX(dataToExport);
  } catch (err) {
    console.error("Export failed:", err);
    alert("Failed to export data.");
  }
};
  const [filterParams, setFilterParams] = useState<{ eventType?: string }>({});

  const bottleneckTableColumns: TableColumn<any>[] = [
  { field: "order_id", header: "Order ID", sortable: true, filter: true },
  { field: "event_id", header: "Event ID", sortable: true, filter: true },
  { field: "enterprise_key", header: "Enterprise", sortable: true, filter: true },
  { field: "event_type", header: "Event Type", sortable: true, filter: true },
  {
    field: "order_date",
    header: "Order Date",
    sortable: true,
    filter: true,
    body: (rowData: any) =>
      rowData?.order_date ? formatDateMDY(rowData.order_date) : "N/A",
  },
  {
    field: "event_time",
    header: "Event Time",
    sortable: true,
    filter: true,
    body: (rowData: any) =>
      rowData?.event_time ? formatDateMDY(rowData.event_time) : "N/A",
  },
  { field: "fulfillment_city", header: "City", sortable: true, filter: true },
];


  const fetchGridData = (customFilters: any = {}) => async (params: any) => {
    const p: any = {
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      enterpriseKey: enterpriseKey || undefined,
      ...customFilters,
      ...params,
    };

    const res = await axiosInstance.get("/fulfillment/details-grid", { params: p });
    const responseData = res.data as { data: any[]; count: number };
    return { data: responseData.data, count: responseData.count };
  };

  const renderMobileCard = (item: any, index: number) => (
  <div
    key={index}
    className="p-4 mb-3 rounded shadow-md bg-white dark:bg-gray-800 border dark:border-gray-700"
  >
    <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
      Order ID: <span className="font-semibold">{item.order_id ?? "N/A"}</span>
    </div>

    <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
      Event Type: <span className="font-semibold">{item.event_type ?? "N/A"}</span>
    </div>

    <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
      Order Date:{" "}
      <span className="font-semibold">
        {item?.order_date ? formatDateMDY(item.order_date) : "N/A"}
      </span>
    </div>

    <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
      Event Time:{" "}
      <span className="font-semibold">
        {item?.event_time ? formatDateMDY(item.event_time) : "N/A"}
      </span>
    </div>

    <div className="text-sm text-gray-500 dark:text-gray-300">
      City: <span className="font-semibold">{item.fulfillment_city ?? "N/A"}</span>
    </div>
  </div>
);


  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) return;

      const formattedStart = formatDateTime(startDate);
      const formattedEnd = formatDateTime(endDate);

      const params = new URLSearchParams({
        startDate: formattedStart,
        endDate: formattedEnd,
      });

      if (enterpriseKey) {
        params.append("enterpriseKey", enterpriseKey);
      }

      try {
        const response = await axiosInstance.get(`/fulfillment/bottleneck-analysis`, {
          params,
        });
        const data = response.data as Array<{
          process_stage: string;
          avg_time: number;
        }>;

        const defaultStagesOrder = [
          "Order Placed",
          "Processing",
          "Distribution Center",
          "Warehouse",
          "Store Pickup",
          "Ship to Home",
          "Vendor Drop Shipping",
          "Locker Pickup",
          "Same-Day Delivery",
          "Curbside Pickup",
        ];

        const stageMap: Record<string, number> = {};
        data.forEach((item) => {
          stageMap[item.process_stage] = parseFloat(item.avg_time.toFixed(2));
        });

        const categories: string[] = [];
        const values: number[] = [];

        defaultStagesOrder.forEach((stage) => {
          categories.push(stage);
          values.push(stageMap[stage] ?? 0.0);
        });

        setChartOptions((prev) => ({
          ...prev,
          xaxis: {
            ...prev.xaxis,
            categories,
          },
        }));

        setSeries([
          {
            name: "Avg Time (hrs)",
            data: values,
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch bottleneck analysis data:", error);
      }
    };

    fetchData();
  }, [startDate, endDate, enterpriseKey]);

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center px-4 mb-2">
  <h2 className="app-subheading">Bottleneck Analysis</h2>
  <div className="flex items-center gap-2"> {/* New wrapper for buttons */}
    <button
      className="px-4 py-2 text-sm border rounded-md dark:border-white/20 dark:hover:bg-white/10 dark:text-white/90"
      onClick={exportData}
    >
      Export
    </button>
    <button
      onClick={() => setShowAllDialog(true)}
      title="View Data Grid"
      className="text-purple-500 hover:text-purple-700"
    >
      <FaTable size={18} />
    </button>
  </div>
</div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-2 pt-6 overflow-hidden">
        <div className="relative z-10 overflow-visible">
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="bar"
            height={320}
            width="100%"
          />
        </div>
      </div>

      {/* All Data Grid */}
      <FilteredDataDialog
        visible={showAllDialog}
        onHide={() => setShowAllDialog(false)}
        header="All Bottleneck Events"
        columns={bottleneckTableColumns}
        fetchData={fetchGridData}
        mobileCardRender={renderMobileCard}
      />

      {/* Filtered Grid */}
      <FilteredDataDialog
        visible={showFilteredDialog}
        onHide={() => {
          setShowFilteredDialog(false);
          setFilterParams({});
        }}
        header={`Filtered: ${filterParams.eventType}`}
        columns={bottleneckTableColumns}
        fetchData={fetchGridData}
        filterParams={filterParams}
        mobileCardRender={renderMobileCard}
      />
    </div>
  );
};

export default BottleneckChart;
