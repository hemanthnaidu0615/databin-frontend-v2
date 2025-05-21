import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../../../axios';

const BottleneckChart = () => {
  const [isDark, setIsDark] = useState<boolean>(
    typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark")
  );

  const [chartOptions, setChartOptions] = useState<ApexOptions>({
chart: {
  type: 'bar',
  height: 320,
  width: '100%', 
  toolbar: { show: false },
  background: 'transparent',
  foreColor: isDark ? '#d1d5db' : '#333',
},



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
    colors: ["#9614d0"],
    xaxis: {
      categories: [],
      title: {
        text: "Process Stage",
        style: {
          color: isDark ? "#d1d5db" : "#333",
          fontWeight: 600,
        },
      },
      labels: {
        style: {
          colors: isDark ? "#d1d5db" : "#333",
        },
      },
    },
    yaxis: {
      title: {
        text: undefined, 
      },
      labels: {
        style: {
          colors: isDark ? "#d1d5db" : "#333",
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      theme: "dark",
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

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange || [];

  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

  useEffect(() => {
    const dark = document.documentElement.classList.contains("dark");
    setIsDark(dark);

    setChartOptions((prev) => ({
      ...prev,
      chart: {
        ...prev.chart,
        background: "transparent",
        foreColor: dark ? "#d1d5db" : "#333",
        offsetX: -10,
      },
      xaxis: {
        ...prev.xaxis,
        title: {
          text: "Process Stage",
          style: {
            color: dark ? "#d1d5db" : "#333",
            fontWeight: 600,
          },
        },
        labels: {
          style: {
            colors: dark ? "#d1d5db" : "#333",
          },
        },
      },
      yaxis: {
        ...prev.yaxis,
        title: {
          text: undefined,
        },
        labels: {
          style: {
            colors: dark ? "#d1d5db" : "#333",
            fontSize: "12px",
          },
        },
      },
      grid: {
        show: true,
        borderColor: dark ? "#3f3f46" : "#e5e7eb",
        row: {
          colors: ["transparent"],
        },
      },
      theme: {
        mode: dark ? "dark" : "light",
      },
    }));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) return;

      const formattedStart = formatDate(new Date(startDate));
      const formattedEnd = formatDate(new Date(endDate));

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
        const data = response.data as Array<{ process_stage: string; avg_time: number }>;


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
      <h2 className="app-subheading">
        Bottleneck Analysis
      </h2>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-2 overflow-hidden">
        <div className="w-full overflow-hidden">
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
