"use client";

import React, { useState, useEffect, useMemo } from "react";
import Chart from "react-apexcharts";
import { useTheme } from "next-themes";
import { ApexOptions } from "apexcharts";
import { axiosInstance } from "../../../../axios";
import { formatDateTime, formatValue } from "../../../utils/kpiUtils";
import { getBaseTooltip, salesTooltip } from "../../../modularity/graphs/graphWidget";
import { useDateRangeEnterprise } from "../../../utils/useGlobalFilters";
import { PrimeSelectFilter } from "../../../modularity/dropdowns/Dropdown";
import { FaTable } from "react-icons/fa";
import FilteredDataDialog from "../../../modularity/tables/FilteredDataDialog";
import { TableColumn } from "../../../modularity/tables/BaseDataTable";

interface Props {
  company: "AWW" | "AWD";
}

interface OrderData {
  period: string;
  fulfilment_channel: string;
  total_order_amount: number;
}

const usdRate = 83;

function getXAxisTitle(categories: string[]): string {
  if (categories.length === 0) return "Date";
  const first = new Date(categories[0]),
    last = new Date(categories[categories.length - 1]);
  const diffDays = (last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays <= 1) return "Date";
  if (diffDays <= 7) return "Dates";
  if (diffDays <= 30) return "Weeks";
  if (diffDays <= 365) return "Months";
  return "Year";
}

const ChartSection: React.FC<Props> = ({ company }) => {
  const [selectedChart, setSelectedChart] = useState("Bar");
  const [categories, setCategories] = useState<string[]>([]);
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);
  const [pieSeries, setPieSeries] = useState<number[]>([]);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { dateRange } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange;
  const labelColor = isDark ? "#f1f5f9" : "#1e293b";
  const gridColor = isDark ? "#334155" : "#e2e8f0";

  const [showAllDialog, setShowAllDialog] = useState(false);
  const [showFilteredDialog, setShowFilteredDialog] = useState(false);
  const [filterParams, setFilterParams] = useState<Record<string, any>>({});

  const columns: TableColumn<any>[] = [
    { field: "order_date", header: "Order Date", sortable: true, filter: true },
    { field: "fulfilment_channel", header: "Channel", sortable: true, filter: true },
    { field: "enterprise_key", header: "Enterprise", sortable: true, filter: true },
    { field: "quantity", header: "Qty", sortable: true },
    { field: "unit_price", header: "Unit Price", sortable: true },
    { field: "subtotal", header: "Subtotal", sortable: true },
    { field: "shipping_fee", header: "Shipping", sortable: true },
    { field: "tax_amount", header: "Tax", sortable: true },
    { field: "discount_amount", header: "Discount", sortable: true },
    { field: "total_amount", header: "Total", sortable: true },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) return;
      const url = company === "AWW" ? "/sales/charts/aww" : "/sales/charts/awd";

      try {
        const resp = await axiosInstance.get<{ data: OrderData[] }>(url, {
          params: { startDate: formatDateTime(startDate), endDate: formatDateTime(endDate) },
        });

        const raw = resp.data.data;
        const channels = ["Online", "Retail Store", "Warehouse"];
        const dateMap = new Map<string, Record<string, number>>();

        raw.forEach(item => {
          if (!dateMap.has(item.period)) dateMap.set(item.period, {});
          dateMap.get(item.period)![item.fulfilment_channel] = item.total_order_amount / usdRate;
        });

        const sortedDates = Array.from(dateMap.keys()).sort();
        const transformed = channels.map(ch => ({
          name: ch,
          data: sortedDates.map(d => dateMap.get(d)?.[ch] ?? 0),
        }));

        // Set Bar/Line chart data
        setCategories(sortedDates);
        setSeries(transformed);

        // Set Pie chart data
        const pieData = transformed.map(s =>
          s.data.slice(0, 4).reduce((a, b) => a + b, 0)
        );
        setPieSeries(pieData);
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };
    fetchData();
  }, [company, startDate, endDate]);

  const fetchGrid = (customFilters?: Record<string, any>) => {
    return async (tableParams: any): Promise<{ data: any[]; count: number }> => {
      if (!startDate || !endDate) return { data: [], count: 0 };

      const url =
        company === "AWW"
          ? "/sales/charts/details-grid/aww"
          : "/sales/charts/details-grid/awd";

      const params = {
        startDate: formatDateTime(startDate),
        endDate: formatDateTime(endDate),
        ...customFilters,
        page: tableParams.page,
        size: tableParams.size,
        sortField: tableParams.sortField,
        sortOrder: tableParams.sortOrder,
      };

      try {
        const response = await axiosInstance.get(url, { params });
        return {
          data: response.data.data ?? response.data,
          count: response.data.count ?? response.data.data?.length ?? 0,
        };
      } catch (error) {
        console.error("Error fetching table data:", error);
        return { data: [], count: 0 };
      }
    };
  };

  const wrappedFetchGrid = (params?: any) => {
    return fetchGrid(params);
  };

  const baseTooltip = getBaseTooltip(isDark, salesTooltip);

  const chartOpts: ApexOptions = {
    chart: {
      type: selectedChart === "Pie" ? "pie" : "bar",
      background: "transparent",
      foreColor: labelColor,
      toolbar: { show: false },
      events: {
  dataPointSelection: (_e, _ctx, cfg) => {
    const seriesIdx = cfg.seriesIndex ?? 0;
    if (selectedChart === "Pie") {
      // For pie, get label from labels array instead of series
      const labels = ["Online", "Retail Store", "Warehouse"];
      const selectedChannel = labels[seriesIdx];
      if (selectedChannel) {
        setFilterParams({
          "fulfilment_channel.value": selectedChannel,
          "fulfilment_channel.matchMode": "equals",
        });
        setShowFilteredDialog(true);
      }
    } else {
      // For Bar/Line
      const selectedChannel = series[seriesIdx]?.name;
      if (selectedChannel) {
        setFilterParams({
          "fulfilment_channel.value": selectedChannel,
          "fulfilment_channel.matchMode": "equals",
        });
        setShowFilteredDialog(true);
      }
    }
  },
},


    },
    theme: { mode: isDark ? "dark" : "light" },
    legend: { labels: { colors: labelColor }, position: "bottom" },
    grid: { borderColor: gridColor },
    colors: ["#14b8a6", "#a855f7", "#db2777"],
    tooltip: { ...baseTooltip, y: { formatter: (v) => `$${v.toFixed(2)}` } },
    xaxis:
      selectedChart !== "Pie"
        ? {
            categories,
            labels: {
              style: { colors: Array(categories.length).fill(labelColor) },
              rotate: -45,
              rotateAlways: true,
            },
            title: {
              text: getXAxisTitle(categories),
              style: { color: labelColor },
              offsetY: -15,
            },
            crosshairs: { show: false },
          }
        : undefined,
    yaxis:
      selectedChart !== "Pie"
        ? {
            labels: { style: { colors: labelColor }, formatter: formatValue },
            title: { text: "Order Amount ($)", style: { color: labelColor } },
          }
        : undefined,
    plotOptions: { bar: { horizontal: false, columnWidth: "60%" } },
    stroke: { show: true, width: 3, curve: "smooth" },
    dataLabels: { enabled: false },
    ...(selectedChart === "Pie" && {
      labels: ["Online", "Retail Store", "Warehouse"],
      dataLabels: {
        enabled: true,
        style: { fontSize: "14px", fontWeight: "bold", colors: [isDark ? "#FFFFFF" : "#1e293b"] },
        formatter: (val: number) => `${val.toFixed(1)}%`,
      },
      tooltip: { enabled: true, y: { formatter: (v) => `$${v.toFixed(2)}` } },
    }),
  };

  useEffect(() => {
    if (filterParams["fulfilment_channel.value"]) {
      setShowFilteredDialog(true);
    }
  }, [filterParams]);

  const dynamicChartWidth = useMemo(() => {
    const calc = categories.length * 40 + 100;
    return `clamp(320px, ${calc}px, 1400px)`;
  }, [categories.length, selectedChart]);

  const chartOptionsList = ["Bar", "Line", "Pie", "Table"].map((type) => ({
    label: type,
    value: type,
  }));

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <PrimeSelectFilter
          value={selectedChart}
          onChange={setSelectedChart}
          options={chartOptionsList}
          placeholder="Select Chart Type"
          className="w-29 text-sm h-[35px] text-xs leading-[0.6]"
        />
        <button onClick={() => setShowAllDialog(true)} title="View all data">
          <FaTable size={18} className="text-purple-500" />
        </button>
      </div>

      {["Bar", "Line", "Pie"].includes(selectedChart) && (
        <div className="flex justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-2 overflow-visible">
          <div style={{ width: dynamicChartWidth, height: selectedChart === "Pie" ? "350px" : "370px" }}>
            <Chart
              options={chartOpts}
              series={selectedChart === "Pie" ? pieSeries : series}
              type={selectedChart.toLowerCase() as any}
              height="100%"
              width="100%"
            />
          </div>
        </div>
      )}

      {selectedChart === "Table" && (
        <div>
          <div className="hidden sm:block overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="max-h-[220px] overflow-y-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                  <tr>
                    <th className="p-2">Date</th>
                    <th className="p-2">Online</th>
                    <th className="p-2">Retail Store</th>
                    <th className="p-2">Warehouse</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((d, i) => (
                    <tr key={i} className="border-t dark:border-gray-700">
                      <td className="p-2">{d}</td>
                      <td className="p-2">{series[0]?.data[i].toFixed(2)}</td>
                      <td className="p-2">{series[1]?.data[i].toFixed(2)}</td>
                      <td className="p-2">{series[2]?.data[i].toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <FilteredDataDialog
        visible={showAllDialog}
        onHide={() => setShowAllDialog(false)}
        header={`All ${company} Orders`}
        columns={columns}
        fetchData={wrappedFetchGrid}
      />

      <FilteredDataDialog
        visible={showFilteredDialog}
        onHide={() => { setShowFilteredDialog(false); setFilterParams({}); }}
        header={`Filtered Channel: ${filterParams["fulfilment_channel.value"]}`}
        columns={columns}
        fetchData={wrappedFetchGrid}
        filterParams={filterParams}
      />
    </div>
  );
};

export default ChartSection;
