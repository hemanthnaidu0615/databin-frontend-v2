import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useNavigate } from "react-router-dom";

interface StatisticsChartProps {
  onRemove?: () => void;
  onViewMore?: () => void;
}

const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ${d
    .getHours()
    .toString()
    .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d
    .getSeconds()
    .toString()
    .padStart(2, "0")}.000`;
};

export default function StatisticsChart({}: StatisticsChartProps) {
  const navigate = useNavigate();

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key); // Get the enterprise key from the Redux store

  const [startDate, endDate] = dateRange;

  const [salesByMonth, setSalesByMonth] = useState<number[]>(new Array(12).fill(0));
  const [forecastedSales, setForecastedSales] = useState<number[]>(new Array(12).fill(0));
  const [revenue, setRevenue] = useState<number[]>(new Array(12).fill(0));

  const fetchChartData = async () => {
    if (!startDate || !endDate) return; // Ensure start and end dates are provided

    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(endDate);

    // Define the API call params conditionally based on whether enterpriseKey exists
    const apiParams = enterpriseKey
      ? { startDate: formattedStart, endDate: formattedEnd, enterpriseKey }
      : { startDate: formattedStart, endDate: formattedEnd }; // If no enterpriseKey, exclude it

    try {
      const [salesRes, revenueRes, forecastedSalesRes] = await Promise.all([
        axios.get("http://localhost:8080/api/sales-revenue/sales-data", { params: apiParams }),
        axios.get("http://localhost:8080/api/sales-revenue/revenue-trends", { params: apiParams }),
        axios.get("http://localhost:8080/api/sales-revenue/forecasted-sales", { params: apiParams }),
      ]);

      const salesMap = new Array(12).fill(0);
      salesRes.data.sales_data.forEach((item: any) => {
        const monthIndex = new Date(item.month).getMonth();
        salesMap[monthIndex] = item.total_sales;
      });
      setSalesByMonth(salesMap);

      const monthlyRevenueMap = new Array(12).fill(0);
      revenueRes.data.revenue_trends.forEach((item: any) => {
        const monthIndex = new Date(item.month).getMonth();
        monthlyRevenueMap[monthIndex] = item.monthly_revenue;
      });
      setRevenue(monthlyRevenueMap);

      const forecastMap = new Array(12).fill(0);
      forecastedSalesRes.data.forecasted_sales.forEach((item: any) => {
        const monthIndex = new Date(item.month).getMonth();
        forecastMap[monthIndex] = item.forecasted_sales;
      });
      setForecastedSales(forecastMap);
    } catch (error) {
      console.error("Error fetching statistics chart data:", error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [startDate, endDate, enterpriseKey]); // Add enterpriseKey as a dependency

  const formatValue = (value: number) => {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "m";
    if (value >= 1_000) return (value / 1_000).toFixed(1) + "k";
    return value.toFixed(0);
  };

  const options: ApexOptions = {
    legend: { show: true },
    colors: ["#465FFF", "#9CB9FF", "#F59E0B"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      toolbar: { show: false },
    },
    stroke: { curve: "smooth", width: [2, 2, 2] },
    fill: { type: "gradient", gradient: { opacityFrom: 0.65, opacityTo: 0 } },
    markers: {
      size: 3,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 5 },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      y: {
        formatter: formatValue,
      },
    },
    xaxis: {
      type: "category",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      title: {
        text: "Month",
        style: {
          fontSize: "14px",
          fontWeight: "normal",
          color: "#6B7280",
        },
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: "11px", colors: ["#6B7280"] },
        formatter: formatValue,
      },
      title: {
        text: "Value",
        style: {
          fontSize: "14px",
          fontWeight: "normal",
          color: "#6B7280",
        },
      },
    },
  };

  const handleViewMore = () => {
    navigate("/sales/dashboard");
  };

  const series = [
    { name: "Sales", data: salesByMonth },
    { name: "Revenue", data: revenue },
    {
      name: "Forecasted Sales",
      data: forecastedSales,
    },
  ];

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex justify-between mb-1">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Sales & Revenue
        </h3>
        <button
          onClick={handleViewMore}
          className="text-xs font-medium hover:underline"
          style={{ color: "#9614d0" }}
        >
          View More
        </button>
      </div>

      <div className="flex-1 w-full mt-3">
        <Chart options={options} series={series} type="area" height="100%" />
      </div>
    </div>
  );
}
