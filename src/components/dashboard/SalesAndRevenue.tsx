import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../axios";
import { useDateRangeEnterprise } from "../utils/useGlobalFilters";
import { formatDateTime, formatValue } from "../utils/kpiUtils";
import CommonButton from "../modularity/buttons/Button";


interface StatisticsChartProps {
  onRemove?: () => void;
  onViewMore?: () => void;
}

export default function StatisticsChart({ }: StatisticsChartProps) {
  const navigate = useNavigate();
  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange;

  const [salesByMonth, setSalesByMonth] = useState<number[]>(
    new Array(12).fill(0)
  );
  const [revenue, setRevenue] = useState<number[]>(new Array(12).fill(0));

  const fetchChartData = async () => {
    if (!startDate || !endDate) return;

    const formattedStart = formatDateTime(startDate);
    const formattedEnd = formatDateTime(endDate);

    const apiParams = enterpriseKey
      ? { startDate: formattedStart, endDate: formattedEnd, enterpriseKey }
      : { startDate: formattedStart, endDate: formattedEnd };

    try {
      const [salesRes, revenueRes] = await Promise.all([
        axiosInstance.get("/sales-revenue/sales-data", { params: apiParams }),
        axiosInstance.get("/sales-revenue/revenue-trends", {
          params: apiParams,
        }),
      ]);

      const salesMap = new Array(12).fill(0);
      (
        salesRes.data as {
          sales_data: { month: string; total_sales: number }[];
        }
      ).sales_data.forEach((item) => {
        const monthIndex = new Date(item.month).getMonth();
        salesMap[monthIndex] = item.total_sales;
      });
      setSalesByMonth(salesMap);

      const monthlyRevenueMap = new Array(12).fill(0);
      (
        revenueRes.data as {
          revenue_trends: { month: string; monthly_revenue: number }[];
        }
      ).revenue_trends.forEach((item) => {
        const monthIndex = new Date(item.month).getMonth();
        monthlyRevenueMap[monthIndex] = item.monthly_revenue;
      });
      setRevenue(monthlyRevenueMap);
    } catch (error) {
      console.error("Error fetching statistics chart data:", error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [startDate, endDate, enterpriseKey]);

  useEffect(() => {
    const scrollY = sessionStorage.getItem("scrollPosition");
    if (scrollY) {
      window.scrollTo({ top: parseInt(scrollY), behavior: "auto" });
      sessionStorage.removeItem("scrollPosition");
    }
  }, []);

  const options: ApexOptions = {
    legend: { show: true, position: "bottom" },
    colors: ["#a855f7", "#d5baff"],
    chart: {
      type: "area",
      toolbar: { show: false },
    },
    stroke: { curve: "smooth", width: [2, 2] },
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
          fontWeight: "normal",
          fontSize: "14px",
          color: "#a855f7",
        },
      },
      labels: {
        style: {
          fontSize: "12px",
        },
      },
      crosshairs: { show: false },
    },
    yaxis: {
      title: {
        text: "Value",
        style: {
          fontWeight: "normal",
          fontSize: "14px",
          color: "#a855f7",
        },
      },
      labels: {
        formatter: formatValue,
        style: {
          fontSize: "12px",
        },
      },
    },
  };

  const handleViewMore = () => {
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    navigate("/sales/dashboard");
  };

  const series = [
    { name: "Sales", data: salesByMonth },
    { name: "Revenue", data: revenue },
  ];

  return (
    <div className="min-h-[400px] flex flex-col flex-1 h-full overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex justify-between items-start sm:items-center flex-wrap sm:flex-nowrap gap-2 mb-4">
        <div className="flex items-start justify-between w-full sm:w-auto">
          <h2 className="app-subheading flex-1 mr-2">Sales & Revenue</h2>

          {/* Mobile arrow (→) aligned right */}
          <CommonButton variant="responsive" onClick={handleViewMore}  showDesktop={false}/>
        </div>

        {/* Desktop & tablet "View More" */}
        <CommonButton variant="responsive" onClick={handleViewMore} showMobile={false} text="View more"/>
      </div>

      <div className="flex-1 w-full mt-3">
        <Chart options={options} series={series} type="area" height="100%" />
      </div>
    </div>
  );
}
