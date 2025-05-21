import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Chart from "react-apexcharts";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { ApexOptions } from "apexcharts";
import dayjs from "dayjs";
import { useTheme } from "next-themes";
import { axiosInstance } from "../../../../axios";

const chartTypes = [
  { label: "Bar", value: "bar" },
  { label: "Line", value: "line" },
];

const formatDate = (date: Date) => dayjs(date).format("YYYY-MM-DD");

const SalesTrendsChart = () => {
  const { theme } = useTheme();
  const [chartType, setChartType] = useState<"bar" | "line">("line");
  const [channels, setChannels] = useState<string[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [drilledMonth, setDrilledMonth] = useState<string | null>(null);
  const [salesData, setSalesData] = useState<{ order_date: string; total_amount: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange || [];

  useEffect(() => {
    const fetchSalesData = async () => {
      if (!startDate || !endDate) return;

      setLoading(true);
      setError(null);

      const formattedStart = formatDate(new Date(startDate));
      const formattedEnd = formatDate(new Date(endDate));

      const params = new URLSearchParams({
        startDate: formattedStart,
        endDate: formattedEnd,
      });

      if (enterpriseKey) {
        params.append('enterpriseKey', enterpriseKey);
      }

      if (selectedChannel && selectedChannel !== "all") {
        params.append('fulfillmentChannel', selectedChannel);
      }

      try {
        const res = await axiosInstance.get(
          `analysis/sales-by-date?${params.toString()}`
        );
        const data = res.data as { sales?: { order_date: string; total_amount: number }[] };
        setSalesData(data.sales || []);
      } catch (err) {
        console.error("Error fetching sales data", err);
        setError('Failed to load sales data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [startDate, endDate, enterpriseKey, selectedChannel]);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await axiosInstance.get("analysis/channels");
        const data = res.data as { channels?: string[] };
        setChannels(data.channels || []);
      } catch (err) {
        console.error("Error fetching channels", err);
        setError('Failed to load channel options. Using default channels.');
      }
    };

    fetchChannels();
  }, []);

  const { categories, values } = useMemo(() => {
    if (!salesData.length) return { categories: [], values: [] };

    const start = dayjs(salesData[0].order_date);
    const end = dayjs(salesData[salesData.length - 1].order_date);

    const map: Record<string, number> = {};
    salesData.forEach(({ order_date, total_amount }) => {
      const date = dayjs(order_date).format("YYYY-MM-DD");
      map[date] = total_amount;
    });

    const days: string[] = [];
    const values: number[] = [];
    let curr = start;

    while (curr.isBefore(end) || curr.isSame(end)) {
      const dateStr = curr.format("YYYY-MM-DD");
      days.push(dateStr);
      values.push(map[dateStr] ?? 0);
      curr = curr.add(1, "day");
    }

    return { categories: days, values };
  }, [salesData]);



  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: chartType,
        toolbar: { show: false },
        events: {
          dataPointSelection: (_e, _ctx, config) => {
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
        x: { formatter: (val) => String(val) },
        y: {
          formatter: (val: number) => `$${val.toLocaleString()}`,
          title: { formatter: () => "Sales" },
        },
        marker: { show: true },
      },
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
        labels: {
          formatter: (val: number) => `$${val.toLocaleString()}`,
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
        hover: { size: 7 },
      },
      dataLabels: { enabled: false },
      colors: ["#2563eb"],
      grid: {
        borderColor: theme === "dark" ? "#334155" : "#e5e7eb",
      },
      legend: { show: false },
    }),
    [chartType, theme, categories, drilledMonth]
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
      <div className="flex gap-2 flex-wrap mb-4">
        <Dropdown
          value={chartType}
          options={chartTypes}
          onChange={(e) => setChartType(e.value)}
          className="w-32"
        />
        <Dropdown
          value={selectedChannel}
          options={[
            { label: "All", value: "all" },
            ...channels.map((ch) => ({
              label: ch,
              value: ch,
            })),
          ]}
          onChange={(e) => {
            setSelectedChannel(e.value);
            setDrilledMonth(null);
          }}
          className="w-40"
          placeholder="Select Channel"
          disabled={channels.length === 0}
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
    </div>
  );
};

export default SalesTrendsChart;