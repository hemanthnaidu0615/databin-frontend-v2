import  { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { ApexOptions } from "apexcharts";
import dayjs from "dayjs";
import { useTheme } from "next-themes";

const allDates = Array.from({ length: 365 }, (_, i) =>
  dayjs("2024-01-01").add(i, "day")
);

const fullDummyData: Record<string, { date: string; value: number }[]> = {
  all: allDates.map((d) => ({
    date: d.format("YYYY-MM-DD"),
    value: Math.floor(200 + Math.random() * 400),
  })),
  online: allDates.map((d) => ({
    date: d.format("YYYY-MM-DD"),
    value: Math.floor(100 + Math.random() * 200),
  })),
  retail: allDates.map((d) => ({
    date: d.format("YYYY-MM-DD"),
    value: Math.floor(80 + Math.random() * 150),
  })),
  wholesale: allDates.map((d) => ({
    date: d.format("YYYY-MM-DD"),
    value: Math.floor(50 + Math.random() * 100),
  })),
};

const chartTypes = [
  { label: "Bar", value: "bar" },
  { label: "Line", value: "line" },
];

const orderTypes = [
  { label: "All", value: "all" },
  { label: "Online", value: "online" },
  { label: "Retail", value: "retail" },
  { label: "Wholesale", value: "wholesale" },
];

const SalesTrendsChart = () => {
  const { theme } = useTheme();
  const [chartType, setChartType] = useState<"bar" | "line">("line"); // default to line
  const [selectedOrderType, setSelectedOrderType] = useState("all");
  const [drilledMonth, setDrilledMonth] = useState<string | null>(null);

  const { categories, values } = useMemo(() => {
    const data = fullDummyData[selectedOrderType];
    const buckets: Record<string, number[]> = {};

    const filtered = drilledMonth
      ? data.filter((d) => dayjs(d.date).format("MMM YYYY") === drilledMonth)
      : data;

    filtered.forEach((entry) => {
      const date = dayjs(entry.date);
      const key = drilledMonth ? date.format("MMM D") : date.format("MMM YYYY");

      if (!buckets[key]) buckets[key] = [];
      buckets[key].push(entry.value);
    });

    const categories = Object.keys(buckets);
    const values = categories.map((key) =>
      Math.round(buckets[key].reduce((a, b) => a + b, 0) / buckets[key].length)
    );

    return { categories, values };
  }, [selectedOrderType, drilledMonth]);

  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: chartType,
        toolbar: { show: false },
        events: {
          dataPointSelection: (_event:any, _chartContext:any, config:any) => {
            if (!drilledMonth && categories[config.dataPointIndex]) {
              setDrilledMonth(categories[config.dataPointIndex]);
            }
          },
        },
        foreColor: theme === "dark" ? "#CBD5E1" : "#374151",
        zoom: { enabled: false },
      },
      tooltip: {
        enabled: true,
        theme: theme === "dark" ? "dark" : "light",
        x: {
          formatter: (val:any) => String(val),
        },
        y: {
          formatter: (val: number) => `$${val}`,
          title: {
            formatter: () => "Sales",
          },
        },
        marker: {
          show: true,
        },
        shared: false,
      },
      xaxis: {
        type: "category",
        crosshairs: { show: false },
        labels: {
          rotate: -45,
          style: {
            colors: theme === "dark" ? "#CBD5E1" : "#374151",
          },
        },
        title: {
          text: "Date",
          style: {
            fontSize: "14px",
            fontWeight: "normal",
            color: theme === "dark" ? "#CBD5E1" : "#64748B",
          },
        },
      },

      yaxis: {
        title: {
          text: "Sales",
          style: {
            fontSize: "14px",
            fontWeight: "normal",
            color: theme === "dark" ? "#CBD5E1" : "#64748B",
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
        strokeColors: "#2563eb",
        strokeWidth: 3,
        hover: {
          size: 7,
        },
      },
      dataLabels: { enabled: false },
      colors: ["#2563eb"],
      grid: {
        borderColor: theme === "dark" ? "#334155" : "#e5e7eb",
      },
      legend: { show: false },
    }),
    [chartType, categories, theme, drilledMonth]
  );

  return (
    <div className="relative border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-md bg-white dark:bg-gray-900 rounded-xl">
      <div className="flex gap-2 flex-wrap mb-4">
        <Dropdown
          value={chartType}
          options={chartTypes}
          onChange={(e) => setChartType(e.value)}
          className="w-32"
        />
        <Dropdown
          value={selectedOrderType}
          options={orderTypes}
          onChange={(e) => {
            setSelectedOrderType(e.value);
            setDrilledMonth(null);
          }}
          className="w-40"
        />
      </div>

      {drilledMonth && (
        <div className="pt-2 pb-2">
          <div className="flex justify-between items-center text-sm text-blue-600 dark:text-blue-300">
            <span>
              Showing detailed view for <strong>{drilledMonth}</strong>
            </span>
            <Button
              label="Back to Year"
              icon="pi pi-arrow-left"
              onClick={() => setDrilledMonth(null)}
              className="p-button-text text-blue-500 dark:text-blue-300"
            />
          </div>
        </div>
      )}

      <Chart
        options={chartOptions}
        series={[
          {
            name: "Sales",
            data: categories.map((label, i) => ({
              x: label,
              y: values[i],
            })),
          },
        ]}
        type={chartType}
        height={350}
      />
    </div>
  );
};

export default SalesTrendsChart;