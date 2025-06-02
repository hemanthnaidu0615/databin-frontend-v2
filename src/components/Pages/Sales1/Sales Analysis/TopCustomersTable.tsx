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
import { axiosInstance } from "../../../../axios";

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
const convertToUSD = (rupees: number): number => rupees * 0.012;

const formatValue = (value: number): string => {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
  return value.toFixed(0);
};

const TopCustomersTable = () => {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<"revenue" | "orders">("revenue");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange || [];

  useEffect(() => {
    setPage(0);
  }, [startDate, endDate, enterpriseKey]);

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
        page: page.toString(),
        size: rows.toString(),
      });

      if (enterpriseKey) {
        params.append("enterpriseKey", enterpriseKey);
      }

      try {
        const response = await axiosInstance.get(
          `analysis/customer-order-summary?${params.toString()}`
        );
        const data = response.data as {
          customers?: Customer[];
          count?: number;
        };

        setCustomers(data.customers || []);
        setTotalRecords(data.count || 0);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError("Failed to load customer data");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [startDate, endDate, enterpriseKey, page, rows]);

  const onPage = (event: any) => {
    setPage(event.page);
    setRows(event.rows);
  };

  const topCustomers = useMemo(() => {
    return [...customers]
      .sort((a, b) =>
        viewMode === "revenue"
          ? b.total_spent - a.total_spent
          : b.total_orders - a.total_orders
      )
      .slice(0, 10);
  }, [viewMode, customers]);

  const chartOptions: ApexOptions = useMemo(
    () => ({
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
          formatter: (value: string) =>
            value.length > 20 ? value.substring(0, 20) + "..." : value,
        },
        title: {
          text: "Customers",
          style: {
            fontSize: "14px",
            fontWeight: "normal",
            color: theme === "dark" ? "#CBD5E1" : "#64748B",
          },
        },
      },
      yaxis: {
        title: {
          text: viewMode === "revenue" ? "Total Spent ($)" : "Orders",
          style: {
            fontSize: "14px",
            fontWeight: "normal",
            color: theme === "dark" ? "#CBD5E1" : "#64748B",
          },
        },
        labels: {
          formatter: (val: number) =>
            viewMode === "revenue" ? `$${formatValue(val)}` : formatValue(val),
        },
      },
      dataLabels: { enabled: false },
      plotOptions: { bar: { borderRadius: 4, columnWidth: "50%" } },
      grid: { borderColor: theme === "dark" ? "#334155" : "#E5E7EB" },
      colors: ["#2563eb"],
      legend: { show: false },
      tooltip: {
        y: {
          formatter: (val: number) =>
            viewMode === "revenue"
              ? `$${val.toFixed(2)}`
              : `${val.toFixed(0)} orders`,
        },
      },
    }),
    [theme, viewMode, topCustomers]
  );

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
      <Card className="...">
        <div className="text-center text-gray-500 dark:text-gray-400 p-4">
          Please select a date range to view top customers
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="...">
        <div className="p-4">
          <Skeleton width="150px" height="30px" className="mb-4" />
          <Skeleton width="100%" height="300px" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="...">
        <div className="p-4 text-red-500 dark:text-red-400">{error}</div>
      </Card>
    );
  }

  return (
    <Card className="...">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 pt-4 gap-4 product-sales-header">
        <h2 className="app-subheading">Customer Orders</h2>
        <Dropdown
          value={viewMode}
          options={viewOptions}
          onChange={(e) => setViewMode(e.value)}
          className="w-50"
        />
      </div>

      <div className="px-4 pt-2 pb-6 app-table-heading">
        {/* 🟣 DataTable - Only on desktop */}
        <div className="hidden sm:block">
          <DataTable
            value={customers}
            stripedRows
            responsiveLayout="scroll"
            scrollable
            scrollHeight="400px"
            sortMode="multiple"
            emptyMessage="No customers found for the selected filters"
            paginator
            paginatorClassName="hidden sm:flex"
            lazy
            loading={loading}
            totalRecords={totalRecords}
            first={page * rows}
            rows={rows}
            onPage={onPage}
            rowsPerPageOptions={[5, 10, 20, 50, 100]}
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} customers"
            paginatorTemplate="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          >
            <Column field="customer_name" header="Customer Name" sortable />
            <Column
              field="total_orders"
              header="Orders"
              sortable
              body={(rowData) => formatValue(rowData.total_orders)}
            />
            <Column
              field="total_spent"
              header="Total Spent ($)"
              sortable
              body={(rowData) =>
                `$${formatValue(convertToUSD(rowData.total_spent))}`
              }
            />
          </DataTable>
        </div>

        {/* 🟣 Mobile-friendly stacked cards */}
        <div className="block sm:hidden space-y-4 mt-4">
          {customers
            .slice(page * rows, page * rows + rows)
            .map((customer, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-2 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Customer:
                  </span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 break-words">
                    {customer.customer_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Orders:
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {formatValue(customer.total_orders)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total Spent:
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    ${formatValue(convertToUSD(customer.total_spent))}
                  </span>
                </div>
              </div>
            ))}
        </div>

        {/* 🟣 Mobile Pagination */}
        <div className="mt-4 text-sm text-gray-800 dark:text-gray-100 sm:hidden">
          <div className="flex flex-col gap-2 mb-2">
            <div>
              <label htmlFor="mobileRows">Rows per page:</label>
              <select
                id="mobileRows"
                value={rows}
                onChange={(e) => {
                  setRows(Number(e.target.value));
                  setPage(0);
                }}
                className="px-2 py-1 rounded w-full border dark:bg-gray-800 bg-gray-100"
              >
                {[5, 10, 20, 50, 100].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              Page {page + 1} of {Math.ceil(totalRecords / rows)}
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-2">
            <button onClick={() => setPage(0)} disabled={page === 0}>
              ⏮ First
            </button>
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              Prev
            </button>
            <button
              onClick={() =>
                setPage(
                  page + 1 < Math.ceil(totalRecords / rows) ? page + 1 : page
                )
              }
              disabled={(page + 1) * rows >= totalRecords}
            >
              Next
            </button>
            <button
              onClick={() => setPage(Math.ceil(totalRecords / rows) - 1)}
              disabled={(page + 1) * rows >= totalRecords}
            >
              ⏭ Last
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pb-6">
        <h3 className="app-subheading mb-4">Top 10 Customers Visualization</h3>
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
