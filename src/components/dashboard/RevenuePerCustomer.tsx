import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import ApexCharts from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { axiosInstance } from "../../axios";
import { formatDateTime, formatValue } from "../utils/kpiUtils";
import { useDateRangeEnterprise } from "../utils/useGlobalFilters";
import { getBaseTooltip, revenueTooltip } from "../modularity/graphs/graphWidget";

type RevenuePerCustomerProps = {
  size?: "small" | "full";
  hasTableRow?: boolean;
};

const RevenuePerCustomer: React.FC<RevenuePerCustomerProps> = ({
  size = "full",
  hasTableRow = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [data, setData] = useState<{ customer: string; revenue: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange;

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
      setIsLoading(true);

      const response = await axiosInstance.get(
        `/revenue/top-customers?${params.toString()}`
      );

      const result = response.data as {
        top_customers: { customer_name: string; revenue: number }[];
      };

      const formattedData = result.top_customers.map((item: any) => ({
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

  useEffect(() => {
    const scrollY = sessionStorage.getItem("scrollPosition");
    if (scrollY) {
      window.scrollTo({ top: parseInt(scrollY), behavior: "auto" });
      sessionStorage.removeItem("scrollPosition");
    }
  }, []);

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
        style: {
          fontWeight: "normal",
          fontSize: "14px",
          color: isDark ? "#a78bfa" : "#a855f7",
        },
      },

      labels: {
        style: {
          colors: isDark ? "#a78bfa" : "#a855f7",
        },
      },
      crosshairs: { show: false },
    },
    yaxis: {
      title: {
        text: "Revenue",
        style: {
          fontWeight: "normal",
          fontSize: "14px",
          color: isDark ? "#a78bfa" : "#a855f7",
        },
      },
      labels: {
        formatter: formatValue,
        style: {
          colors: isDark ? "#a78bfa" : "#a855f7",
        },
      },
    },
    plotOptions: {
      bar: {
        dataLabels: { position: "top" },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: getBaseTooltip(isDark, revenueTooltip),
    series: [
      {
        name: "Revenue",
        data: data.map((d) => d.revenue),
      },
    ],
  };

  return (
    <div className="relative border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-md bg-white dark:bg-gray-900 rounded-xl">
      {size === "full" && (
        <div className="flex justify-between items-start sm:items-center flex-wrap sm:flex-nowrap gap-2 mb-4">
          <div className="flex items-start justify-between w-full sm:w-auto">
            <h2 className="app-subheading flex-1 mr-2">Revenue Per Customer</h2>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading data...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <>
          <ApexCharts
            options={apexOptions}
            series={apexOptions.series}
            type="bar"
            height={size === "small" ? 150 : 300}
          />

          {hasTableRow && (
            <DataTable value={data} className="mt-4">
              <Column field="customer" header="Customer" />
              <Column field="revenue" header="Revenue" />
            </DataTable>
          )}
        </>
      )}
    </div>
  );
};

export default RevenuePerCustomer;
