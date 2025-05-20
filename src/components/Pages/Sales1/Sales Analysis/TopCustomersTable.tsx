import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import { Skeleton } from "primereact/skeleton";
import dayjs from "dayjs";

const viewOptions = [
  { label: "By Revenue", value: "revenue" },
  { label: "By Orders", value: "orders" },
];

interface Customer {
  customer_name: string;
  total_spent: number;
  total_orders: number;
}

const formatDate = (date: Date) => dayjs(date).format("YYYY-MM-DD");

// INR to USD conversion
const convertToUSD = (rupees: number): number => {
  const exchangeRate = 0.012; // Adjust as needed
  return rupees * exchangeRate;
};

// Number formatting helper
const formatValue = (value: number): string => {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "m";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "k";
  return value.toFixed(0);
};

const TopCustomersTable = () => {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<"revenue" | "orders">("revenue");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get filters from Redux
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange || [];

  // Fetch customers data when filters change
  useEffect(() => {
    const fetchCustomers = async () => {
      if (!startDate || !endDate) return;

      setLoading(true);
      setError(null);

      const formattedStart = formatDate(new Date(startDate));
      const formattedEnd = formatDate(new Date(endDate));

      const params = new URLSearchParams({
        startDate: formattedStart,
        endDate: formattedEnd,
      });

      if (enterpriseKey) {
        params.append('enterpriseKey', enterpriseKey);
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/analysis/customer-order-summary?${params.toString()}`
        );
        if (!response.ok) throw new Error("Failed to fetch customers");
        const data = await response.json();
        setCustomers(data.customers || []);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError("Failed to load customer data");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [startDate, endDate, enterpriseKey]);

  // Get all customers sorted by current view mode (for table)
  const sortedCustomers = useMemo(() => {
    return [...customers].sort((a, b) =>
      viewMode === "revenue" 
        ? b.total_spent - a.total_spent 
        : b.total_orders - a.total_orders
    );
  }, [viewMode, customers]);

  // Get top 10 customers sorted by current view mode (for chart)
  const topCustomers = useMemo(() => {
    return sortedCustomers.slice(0, 10);
  }, [sortedCustomers]);

  const chartOptions: ApexOptions = useMemo(() => ({
    chart: {
      type: "bar",
      toolbar: { show: false },
      foreColor: theme === "dark" ? "#CBD5E1" : "#334155",
    },
    xaxis: {
      categories: topCustomers.map((c) => c.customer_name),
      labels: {
        style: {
          fontSize: "12px",
          colors: theme === "dark" ? "#CBD5E1" : "#334155",
        },
        formatter: function(value: string) {
          return value.length > 20 ? value.substring(0, 20) + '...' : value;
        }
      },
      title: {
        text: "Customer",
        style: {
          fontSize: "14px",
          fontWeight: "normal",
          color: theme === "dark" ? "#CBD5E1" : "#64748B",
        },
      },
    },
    yaxis: {
      title: {
        text: viewMode === "revenue" ? "Total Spent (USD)" : "Orders",
        style: {
          fontSize: "14px",
          fontWeight: "normal",
          color: theme === "dark" ? "#CBD5E1" : "#64748B",
        },
      },
      labels: {
        formatter: function(val: number) {
          return viewMode === "revenue" 
            ? `$${formatValue(val)}` 
            : formatValue(val);
        }
      }
    },
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "50%",
      },
    },
    grid: {
      borderColor: theme === "dark" ? "#334155" : "#E5E7EB",
    },
    colors: ["#2563eb"],
    legend: { show: false },
    tooltip: {
      y: {
        formatter: function(val: number) {
          return viewMode === "revenue" 
            ? `$${val.toFixed(2)}` 
            : `${val} orders`;
        }
      }
    }
  }), [theme, viewMode, topCustomers]);

  const chartSeries = [
    {
      name: viewMode === "revenue" ? "Total Spent (USD)" : "Orders",
      data:
        viewMode === "revenue"
          ? topCustomers.map((c) => convertToUSD(c.total_spent))
          : topCustomers.map((c) => c.total_orders),
    },
  ];

  if (!startDate || !endDate) {
    return (
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-xl">
        <div className="text-center text-gray-500 dark:text-gray-400 p-4">
          Please select a date range to view top customers
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-xl">
        <div className="p-4">
          <Skeleton width="150px" height="30px" className="mb-4" />
          <Skeleton width="100%" height="300px" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-xl">
        <div className="p-4 text-red-500 dark:text-red-400">
          {error}
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 pt-4 gap-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Customer Orders
        </h2>
        <Dropdown
          value={viewMode}
          options={viewOptions}
          onChange={(e) => setViewMode(e.value)}
          className="w-40"
        />
      </div>

      <div className="px-4 pt-2 pb-6">
        <DataTable
          value={sortedCustomers}
          stripedRows
          responsiveLayout="scroll"
          scrollable
          scrollHeight="400px"
          sortMode="multiple"
          emptyMessage="No customers found for the selected filters"
        >
          <Column 
            field="customer_name" 
            header="Customer Name" 
            sortable 
            className="text-sm" 
            style={{ minWidth: '200px' }}
          />
          <Column
            field="total_orders"
            header="Orders"
            sortable
            className="text-sm"
            body={(rowData) => formatValue(rowData.total_orders)}
            style={{ minWidth: '100px' }}
          />
          <Column
            field="total_spent"
            header="Total Spent (USD)"
            sortable
            className="text-sm"
            body={(rowData) => `$${formatValue(convertToUSD(rowData.total_spent))}`}
            style={{ minWidth: '150px' }}
          />
        </DataTable>
      </div>

      <div className="px-4 pb-6">
        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Top 10 Customers Visualization
        </h3>
        {topCustomers.length > 0 ? (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={350}
          />
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 h-[280px] flex items-center justify-center">
            No customer data available for visualization
          </div>
        )}
      </div>
    </Card>
  );
};

export default TopCustomersTable;