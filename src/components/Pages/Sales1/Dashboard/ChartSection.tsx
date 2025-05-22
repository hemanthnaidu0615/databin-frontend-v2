import React, { useState, useEffect, useMemo } from "react";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import { useTheme } from "next-themes";
import { ApexOptions } from "apexcharts";
import { axiosInstance } from "../../../../axios";

interface Props {
  company: "AWW" | "AWD";
}

interface OrderData {
  order_date: string;
  fulfilment_channel: string;
  total_order_amount: number;
}

const usdRate = 83;

const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}T00:00:00`;
};

const ChartSection: React.FC<Props> = ({ company }) => {
  const [selectedChart, setSelectedChart] = useState("Bar");
  const [categories, setCategories] = useState<string[]>([]);
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);
  const [pieSeries, setPieSeries] = useState<number[]>([]);
  const { theme } = useTheme();

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;

  const isDark = theme === "dark";
  const labelColor = isDark ? "#f1f5f9" : "#1e293b";
  const gridColor = isDark ? "#334155" : "#e2e8f0";

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) return;

      const url = company === "AWW" ? "/sales/charts/aww" : "/sales/charts/awd";

      try {
        const response = await axiosInstance.get<OrderData[]>(url, {
          params: {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
          },
        });

        const rawData = response.data;

        const channels = ["Online", "Retail Store", "Warehouse"];
        const dateMap = new Map<string, Record<string, number>>();

        rawData.forEach((item) => {
          const date = item.order_date;
          const channel = item.fulfilment_channel;
          const amountUsd = item.total_order_amount / usdRate;

          if (!dateMap.has(date)) dateMap.set(date, {});
          dateMap.get(date)![channel] = amountUsd;
        });

        const sortedDates = Array.from(dateMap.keys()).sort();
        const transformedSeries = channels.map((channel) => ({
          name: channel,
          data: sortedDates.map((date) => dateMap.get(date)?.[channel] ?? 0),
        }));

        const calculatedPie = transformedSeries.map((s) =>
          s.data.slice(0, 4).reduce((a, b) => a + b, 0)
        );

        setCategories(sortedDates);
        setSeries(transformedSeries);
        setPieSeries(calculatedPie);
      } catch (err) {
        console.error(`Failed to fetch ${company} data`, err);
      }
    };

    fetchData();
  }, [company, startDate, endDate]);

  const getChartOptions = (type: "bar" | "line" | "pie"): ApexOptions => {
    const baseOptions: ApexOptions = {
      chart: {
        type,
        background: "transparent",
        foreColor: labelColor,
        toolbar: { show: false },
      },
      theme: {
        mode: isDark ? "dark" : "light",
      },
      legend: {
        labels: { colors: labelColor },
        position: "top",
      },
      grid: {
        borderColor: gridColor,
      },
      colors: ["#b76fcf", "#f84aad", "#8de2c4"],
      tooltip: {
        theme: isDark ? "dark" : "light",
      },
    };

    if (type === "bar" || type === "line") {
      return {
        ...baseOptions,
        xaxis: {
          categories,
          labels: {
            style: {
              colors: Array(categories.length).fill(labelColor),
            },
          },
          title: {
            text: "Dates",
            style: { color: labelColor },
          },
          crosshairs: {
            show: false, 
          },
        },
        yaxis: {
          labels: {
            style: { colors: labelColor },
            formatter: (value: number) => `$${(value / 1_000_000).toFixed(1)}M`,
          },
          title: {
            text: "Order Amount ($)",
            style: { color: labelColor },
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "60%",
          },
        },
        dataLabels: { enabled: false },
      };
    }

    if (type === "pie") {
      return {
        ...baseOptions,
        labels: ["Online", "Retail Store", "Warehouse"],
      };
    }

    return baseOptions;
  };

  const dynamicChartWidth = useMemo(() => {
    const baseWidthPerCategory = 60;
    const padding = 100;
    return selectedChart === "Pie"
      ? "100%"
      : `${categories.length * baseWidthPerCategory + padding}px`;
  }, [categories.length, selectedChart]);

  const chartOptions = ["Bar", "Line", "Pie", "Table"];

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Chart Type
        </p>
        <select
          value={selectedChart}
          onChange={(e) => setSelectedChart(e.target.value)}
          className="px-3 py-1.5 text-sm rounded-md border bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          {chartOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {(selectedChart === "Bar" ||
        selectedChart === "Line" ||
        selectedChart === "Pie") && (
        <div className="flex justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
          <div style={{ width: dynamicChartWidth, height: "400px" }}>
            <Chart
              options={getChartOptions(
                selectedChart.toLowerCase() as "bar" | "line" | "pie"
              )}
              series={selectedChart === "Pie" ? pieSeries : series}
              type={selectedChart.toLowerCase() as any}
              height="100%"
              width="100%"
            />
          </div>
        </div>
      )}

      {selectedChart === "Table" && (
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="max-h-[220px] overflow-y-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                <tr>
                  <th className="p-2 font-medium">Date</th>
                  <th className="p-2 font-medium">Online</th>
                  <th className="p-2 font-medium">Retail Store</th>
                  <th className="p-2 font-medium">Warehouse</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((date, i) => (
                  <tr key={i} className="border-t dark:border-gray-700">
                    <td className="p-2">{date}</td>
                    <td className="p-2">
                      {series[0]?.data[i]?.toFixed(2) ?? "-"}
                    </td>
                    <td className="p-2">
                      {series[1]?.data[i]?.toFixed(2) ?? "-"}
                    </td>
                    <td className="p-2">
                      {series[2]?.data[i]?.toFixed(2) ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="text-center mt-3 text-gray-400 dark:text-gray-500 text-xs">
        [ {company} Chart Placeholder ]
      </div>
    </div>
  );
};

export default ChartSection;
