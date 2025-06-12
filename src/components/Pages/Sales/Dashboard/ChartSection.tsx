import React, { useState, useEffect, useMemo } from "react";
import Chart from "react-apexcharts";
import { useTheme } from "next-themes";
import { ApexOptions } from "apexcharts";
import { axiosInstance } from "../../../../axios";
import { formatDateTime } from "../../../utils/kpiUtils";
import { useDateRangeEnterprise } from "../../../utils/useGlobalFilters";
import {chartTypeOptions,fulfillmentChannels,getCommonChartOptions,  getXAxisTitle} from "../../../utils/chartUtils";

interface Props {
  company: "AWW" | "AWD";
}

interface OrderData {
  period: string;
  fulfilment_channel: string;
  total_order_amount: number;
}

const usdRate = 83;




const ChartSection: React.FC<Props> = ({ company }) => {
  const [selectedChart, setSelectedChart] = useState("Bar");
  const [categories, setCategories] = useState<string[]>([]);
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);
  const [pieSeries, setPieSeries] = useState<number[]>([]);
  const { theme } = useTheme();

  const { dateRange } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange;

  const isDark = theme === "dark";
  const labelColor = isDark ? "#f1f5f9" : "#1e293b";
  const gridColor = isDark ? "#334155" : "#e2e8f0";

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) return;

      const url = company === "AWW" ? "/sales/charts/aww" : "/sales/charts/awd";

      try {
        const response = await axiosInstance.get<{
          data: OrderData[];
        }>(url, {
          params: {
            startDate: formatDateTime(startDate),
            endDate: formatDateTime(endDate),
          },
        });

        const rawData = response.data.data;

const channels = fulfillmentChannels;
        const dateMap = new Map<string, Record<string, number>>();

        rawData.forEach((item) => {
          const date = item.period;
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
const getChartOptions = (type: "bar" | "line" | "pie"): ApexOptions =>
  getCommonChartOptions({
    type,
    isDark,
    labelColor,
    gridColor,
    categories,
    xAxisTitle: getXAxisTitle(categories),
  });


  const dynamicChartWidth = useMemo(() => {
    const baseWidthPerCategory = 40;
    const minWidth = 320;
    const maxWidth = 1400;
    const calculatedWidth = categories.length * baseWidthPerCategory + 100;

    return `clamp(${minWidth}px, ${calculatedWidth}px, ${maxWidth}px)`;
  }, [categories.length, selectedChart]);

const chartOptions = chartTypeOptions;

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
          <div
            className="flex justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-2"
            style={{ overflow: "visible" }}
          >
            <div
              style={{
                width: dynamicChartWidth,
                height: selectedChart === "Pie" ? "350px" : "370px",
                maxWidth: "100%",
                overflow: "visible",
              }}
            >
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
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
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

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-2">
            {categories.map((date, i) => (
              <div
                key={i}
                className="border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-white dark:bg-gray-800"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">
                  Date: {date}
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-200">
                  Online: {series[0]?.data[i]?.toFixed(2) ?? "-"}
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-200">
                  Retail Store: {series[1]?.data[i]?.toFixed(2) ?? "-"}
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-200">
                  Warehouse: {series[2]?.data[i]?.toFixed(2) ?? "-"}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ChartSection;
