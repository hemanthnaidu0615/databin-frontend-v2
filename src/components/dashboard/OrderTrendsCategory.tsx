import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../axios";
import { formatDateTime, formatVal } from "../utils/kpiUtils";
import { useDateRangeEnterprise } from "../utils/useGlobalFilters";
import CommonButton from "../modularity/buttons/Button";
import FilteredDataDialog from "../modularity/tables/FilteredDataDialog";
import { TableColumn } from "../modularity/tables/BaseDataTable";
import { FaTable } from "react-icons/fa";

type OrderTrendsCategoryProps = {
  size?: "small" | "full";
  onViewMore?: () => void;
  onRemove?: () => void;
};

type TrendItem = {
  month: string;
  category: string;
  sales: number;
};

const renderMobileCard = (item: TrendItem, index: number) => (
  <div key={index} className="p-4 mb-3 rounded shadow-md bg-white dark:bg-gray-800 border dark:border-gray-700">
    <div className="text-sm font-semibold mb-2">Month: {item.month}</div>
    <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
      Category: <span className="font-medium">{item.category}</span>
    </div>
    <div className="text-sm text-gray-500 dark:text-gray-300">
      Sales: <span className="font-medium">{formatVal(item.sales)}</span>
    </div>
  </div>
);

const OrderTrendsCategory: React.FC<OrderTrendsCategoryProps> = ({
  size = "full",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [chartData, setChartData] = useState<{
    categories: string[];
    series: { name: string; data: number[] }[];
  }>({ categories: [], series: [] });

  const [dialogVisible, setDialogVisible] = useState(false);
  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange;
  const navigate = useNavigate();

  // 👉 Fetch chart data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedStartDate = formatDateTime(startDate);
        const formattedEndDate = formatDateTime(endDate);

        const params = new URLSearchParams({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        });

        if (enterpriseKey) {
          params.append("enterpriseKey", enterpriseKey);
        }

        const response = await axiosInstance.get(`/order-trends-by-category?${params.toString()}`);
        const data = (response.data as { data: TrendItem[] }).data;

        const trendsByMonth: Record<string, Record<string, number>> = {};

        for (const item of data) {
          const { month, category, sales } = item;
          if (!trendsByMonth[month]) trendsByMonth[month] = {};
          trendsByMonth[month][category] = sales;
        }

        const months = Object.keys(trendsByMonth).sort();
        const categoryTotals: Record<string, number> = {};

        for (const month of months) {
          const monthData = trendsByMonth[month];
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
          data: months.map((month) => trendsByMonth[month]?.[category] || 0),
        }));

        setChartData({ categories: months, series });
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
      title: { text: "Month", style: { color: isDark ? "#d1d5db" : "#a855f7" } },
      labels: { style: { colors: isDark ? "#d1d5db" : "#a855f7" } },
    },
    yaxis: {
      title: { text: "Order Amount", style: { color: isDark ? "#d1d5db" : "#a855f7" } },
      labels: { style: { colors: isDark ? "#d1d5db" : "#a855f7" }, formatter: formatVal },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: { formatter: formatVal },
    },
    stroke: { curve: "smooth", width: 2 },
    markers: { size: 4 },
    colors: isDark ? ["#c084fc", "#86efac", "#fde047"] : ["#a855f7", "#22C55E", "#EAB308"],
    legend: {
      position: "bottom",
      labels: { colors: isDark ? "#d1d5db" : "#a855f7" },
    },
  };

  const handleViewMore = () => {
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    navigate("/orders");
  };

  const columns: TableColumn<TrendItem>[] = [
    { field: "month", header: "Month", sortable: true, filter: true },
    { field: "category", header: "Category", sortable: true, filter: true },
    {
      field: "sales",
      header: "Sales",
      sortable: true,
      filter: true,
      body: (row) => <span>{formatVal(row.sales)}</span>,
    },
  ];

  const fetchData = () => async (params: any) => {
    const query = new URLSearchParams({
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      page: params.page,
      size: params.size,
      sortField: params.sortField || "month",
      sortOrder: params.sortOrder || "asc",
      ...(enterpriseKey ? { enterpriseKey } : {}),
    });

    for (const key in params) {
      if (key.endsWith("Filter")) {
        const field = key.replace("Filter", "");
        query.append(`${field}.value`, params[key]);
        query.append(`${field}.matchMode`, "contains");
      }
    }

    const res = await axiosInstance.get(`/order-trends-by-category?${query.toString()}`);
    const responseData = res.data as { data?: TrendItem[]; count?: number };
    return {
      data: responseData.data || [],
      count: responseData.count || 0,
    };
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-900 p-4 sm:p-5">
        {size === "full" && (
          <div className="flex justify-between items-center mb-8">
            <h2 className="app-subheading">Order Trends By Product Category</h2>
            <div className="flex items-center ">
              <CommonButton
                variant="responsive"
                onClick={handleViewMore}
                text="View more"
                className="h-9 flex items-center"
              />
              <button
                onClick={() => setDialogVisible(true)}
                className="h-9 w-9 flex items-center justify-center text-purple-500 hover:text-purple-700 dark:hover:text-purple-400 transition-colors"
                aria-label="View data in table"
              >
                <FaTable size={18} />
              </button>
            </div>
          </div>
        )}

        <div className="h-[420px] sm:h-[490px]">
          <Chart options={options} series={chartData.series} type="line" height="100%" />
        </div>
      </div>

      <FilteredDataDialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header="Order Trends by Product Category"
        columns={columns}
        fetchData={fetchData}
        width="90vw"
        mobileCardRender={renderMobileCard}
      />


    </>
  );
};

export default OrderTrendsCategory;
