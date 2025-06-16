import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { axiosInstance } from "../../../axios";
import { useDateRangeEnterprise } from "../../utils/useGlobalFilters";
import { formatDateTime } from "../../utils/kpiUtils";
import { getBaseTooltip, avgTimeTooltip } from "../../modularity/graphs/graphWidget";

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
        const response = await axiosInstance.get(
          `/fulfillment/bottleneck-analysis`,
          {
            params,
          }
        );
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
      <h2 className="app-subheading">Bottleneck Analysis</h2>
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
    </div>
  );
};

export default BottleneckChart;
