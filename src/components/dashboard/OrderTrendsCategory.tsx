import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import { formatDateTime, formatVal } from "../utils/kpiUtils";
import { useDateRangeEnterprise } from "../utils/useGlobalFilters";
import CommonButton from "../modularity/buttons/Button";

type OrderTrendsCategoryProps = {
  size?: "small" | "full";
  onViewMore?: () => void;
  onRemove?: () => void;
};

type ApiResponse = {
  order_trends: {
    [month: string]: Record<string, number>;
  };
};

const OrderTrendsCategory: React.FC<OrderTrendsCategoryProps> = ({
  size = "full",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [chartData, setChartData] = useState<{
    categories: string[];
    series: { name: string; data: number[] }[];
  }>({
    categories: [],
    series: [],
  });
  const { dateRange, enterpriseKey } = useDateRangeEnterprise();

  const [startDate, endDate] = dateRange;
  const navigate = useNavigate();

  useEffect(() => {
    const savedScroll = sessionStorage.getItem("scrollPosition");
    if (savedScroll !== null) {
      window.scrollTo({ top: parseInt(savedScroll, 10), behavior: "auto" });
      sessionStorage.removeItem("scrollPosition");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedStartDate = formatDateTime(startDate);
        const formattedEndDate = formatDateTime(endDate);

        const params = new URLSearchParams({
          startDate: encodeURIComponent(formattedStartDate),
          endDate: encodeURIComponent(formattedEndDate),
        });

        if (enterpriseKey) {
          params.append("enterpriseKey", enterpriseKey);
        }

        const response = await axiosInstance.get<ApiResponse>(
          `/order-trends-by-category?${params.toString()}`
        );
        const data = response.data;

        const trends = data.order_trends;

        if (!trends || Object.keys(trends).length === 0) {
          setChartData({ categories: [], series: [] });
          return;
        }

        const months = Object.keys(trends).sort();
        const categoryTotals: Record<string, number> = {};

        for (const month of months) {
          const monthData = trends[month];
          for (const [category, sales] of Object.entries(monthData)) {
            categoryTotals[category] = (categoryTotals[category] || 0) + sales;
          }
        }

        const topCategories = Object.entries(categoryTotals)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([category]) => category);

        const series = topCategories.map((category) => ({
          name: category,
          data: months.map((month) => trends[month]?.[category] || 0),
        }));

        setChartData({
          categories: months,
          series,
        });
      } catch (error) {
        console.error("Failed to fetch order trends:", error);
      }
    };

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate, enterpriseKey]);


  const options: ApexOptions = {
    chart: {
      type: "line",
      zoom: { enabled: false },
      toolbar: { show: false },
      foreColor: isDark ? "#d1d5db" : "#a855f7",
    },
    xaxis: {
      categories: chartData.categories,
      title: {
        text: "Month",
        style: {
          color: isDark ? "#d1d5db" : "#a855f7",
          fontSize: "14px",
          fontWeight: 400,
        },
      },
      labels: {
        style: {
          colors: isDark ? "#d1d5db" : "#a855f7",
        },
      },
    },
    yaxis: {
      title: {
        text: "Order Amount",
        style: {
          color: isDark ? "#d1d5db" : "#a855f7",
          fontSize: "14px",
          fontWeight: 400,
        },
      },
      labels: {
        style: {
          colors: isDark ? "#d1d5db" : "#a855f7",
        },
        formatter: formatVal,
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      x: { show: true },
      y: {
        formatter: formatVal,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    markers: {
      size: 4,
    },
    colors: isDark
      ? ["#c084fc", "#86efac", "#fde047"]
      : ["#a855f7", "#22C55E", "#EAB308"], // ✅ Dark vs Light color palettes
    legend: {
      position: "bottom",
      labels: {
        colors: isDark ? "#d1d5db" : "#a855f7",
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          xaxis: {
            labels: {
              style: {
                fontSize: "10px",
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: "10px",
              },
            },
          },
        },
      },
    ],
  };

  const handleViewMore = () => {
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    navigate("/orders");
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-900 p-4 sm:p-5">
      {size === "full" && (
        <div className="flex justify-between items-start sm:items-center flex-wrap sm:flex-nowrap gap-2 mb-8">
          <div className="flex items-start justify-between w-full sm:w-auto">
            <h2 className="app-subheading flex-1 mr-2">
              Order Trends By Product Category
            </h2>

            {/* Mobile arrow (→) aligned right */}
          <CommonButton variant="responsive" onClick={handleViewMore}  showDesktop={false}/>
          </div>

          {/* Desktop & tablet "View More" */}
          <CommonButton variant="responsive" onClick={handleViewMore} showMobile={false} text="View more"/>
        </div>
      )}

      <div className="h-[420px] sm:h-[490px]">
        <Chart
          options={options}
          series={chartData.series}
          type="line"
          height="100%"
        />
      </div>
    </div>
  );
};

export default OrderTrendsCategory;
