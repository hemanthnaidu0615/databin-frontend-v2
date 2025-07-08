import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import ApexCharts from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { axiosInstance } from "../../axios";
import { formatDateTime, formatValue } from "../utils/kpiUtils";
import { useDateRangeEnterprise } from "../utils/useGlobalFilters";
import FilteredDataDialog from "../modularity/tables/FilteredDataDialog";
import { FaTable } from "react-icons/fa";
import { getBaseTooltip, revenueTooltip } from "../modularity/graphs/graphWidget";

const RevenuePerCustomer: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [data, setData] = useState<{ customer: string; revenue: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGridDialog, setShowGridDialog] = useState(false);

  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange;

  const fetchData = async () => {
    if (!startDate || !endDate) return;

    const params = new URLSearchParams({
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
    });
    if (enterpriseKey) params.append("enterpriseKey", enterpriseKey);

    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/revenue/top-customers?${params}`);
      const result = response.data as {
        data: { customer_name: string; revenue: number }[];
      };
      const formattedData = result.data.slice(0, 5).map((item) => ({
        customer: item.customer_name,
        revenue: item.revenue,
      }));
      setData(formattedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, enterpriseKey]);

  const fetchGridData = () => async (tableParams: any = {}) => {
    const {
      page = 0,
      rows = 10,
      sortField = "revenue",
      sortOrder = "desc",
      filters = {},
    } = tableParams;

    const queryParams: Record<string, any> = {
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      page,
      size: rows,
      sortField,
      sortOrder,
    };

    if (enterpriseKey) {
      queryParams.enterpriseKey = enterpriseKey;
    }

    // Convert PrimeReact-style filters to backend query parameters
    Object.entries(filters).forEach(([key, { value, matchMode }]: any) => {
      if (value) {
        queryParams[`${key}.value`] = value;
        queryParams[`${key}.matchMode`] = matchMode || "contains";
      }
    });

    const response = await axiosInstance.get("/revenue/top-customers", { params: queryParams });

    return {
      data: response.data.data,
      count: response.data.count,
    };
  };

  const apexOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      foreColor: isDark ? "#d1d5db" : "#a855f7",
      background: isDark ? "#1f2937" : "transparent",
    },
    colors: [isDark ? "#a78bfa" : "#a855f7"],
    xaxis: {
      categories: data.map((d) => d.customer),
      title: {
        text: "Customer",
        style: { fontWeight: "normal", fontSize: "14px", color: isDark ? "#a78bfa" : "#a855f7" },
      },
      labels: { style: { colors: isDark ? "#a78bfa" : "#a855f7" } },
      crosshairs: { show: false },
    },
    yaxis: {
      title: {
        text: "Revenue",
        style: { fontWeight: "normal", fontSize: "14px", color: isDark ? "#a78bfa" : "#a855f7" },
      },
      labels: {
        formatter: formatValue,
        style: { colors: isDark ? "#a78bfa" : "#a855f7" },
      },
    },
    plotOptions: {
      bar: { dataLabels: { position: "top" } },
    },
    dataLabels: { enabled: false },
    tooltip: getBaseTooltip(isDark, revenueTooltip),
    series: [{ name: "Revenue", data: data.map((d) => d.revenue) }],
  };

  const tableColumns = [
    {
      field: "customer_id",
      header: "Customer ID",
      sortable: true,
      filter: true,
    },
    {
      field: "customer_name",
      header: "Customer Name",
      sortable: true,
      filter: true,
    },
    {
      field: "revenue",
      header: "Revenue",
      sortable: true,
      // filter: true,
      body: (row: any) => formatValue(row.revenue),
    },
  ];

  // ✅ Mobile card renderer
  const renderMobileCard = (item: any, index: number) => (
    <div key={index} className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg mb-3 bg-white dark:bg-gray-800">
      <div className="text-sm text-gray-500 dark:text-gray-400">Customer ID</div>
      <div className="font-medium text-gray-800 dark:text-white mb-2">{item.customer_id}</div>

      <div className="text-sm text-gray-500 dark:text-gray-400">Name</div>
      <div className="font-medium text-gray-800 dark:text-white mb-2">{item.customer_name}</div>

      <div className="text-sm text-gray-500 dark:text-gray-400">Revenue</div>
      <div className="font-semibold text-green-600 dark:text-green-400">{formatValue(item.revenue)}</div>
    </div>
  );

  return (
    <div className="relative border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-md bg-white dark:bg-gray-900 rounded-xl">
      <div className="flex justify-between items-start sm:items-center mb-4">
        <h2 className="app-subheading">Revenue Per Customer</h2>
        <button
          onClick={() => setShowGridDialog(true)}
          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-600"
          title="View Grid"
        >
          <FaTable size={18} />
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading data...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <ApexCharts options={apexOptions} series={apexOptions.series} type="bar" height={300} />
      )}

      <FilteredDataDialog
        visible={showGridDialog}
        onHide={() => setShowGridDialog(false)}
        header="Top Customers by Revenue"
        columns={tableColumns}
        fetchData={fetchGridData}
        mobileCardRender={renderMobileCard}
      />
    </div>
  );
};

export default RevenuePerCustomer;
