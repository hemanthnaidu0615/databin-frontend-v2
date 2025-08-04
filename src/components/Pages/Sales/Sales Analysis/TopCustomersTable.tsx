import { useState, useMemo, useEffect } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import { Skeleton } from "primereact/skeleton";
import { axiosInstance } from "../../../../axios";
import { formatDateTime, formatValue } from "../../../utils/kpiUtils";
import { useDateRangeEnterprise } from "../../../utils/useGlobalFilters";
import { getBaseTooltip, revenueTooltip } from "../../../modularity/graphs/graphWidget";
import { PrimeSelectFilter } from "../../../modularity/dropdowns/Dropdown";
import { FaTable } from "react-icons/fa";
import FilteredDataDialog from "../../../modularity/tables/FilteredDataDialog";

interface Customer {
  customer_name: string;
  total_spent: number;
  total_orders: number;
}

const convertToUSD = (rupees: number): number => rupees * 0.012;

const customerDialogMobileCardRender = (row: any) => (
  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-2 shadow-sm border border-gray-200 dark:border-gray-700 mb-2">
    <div className="flex flex-col">
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        Name:
      </span>
      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 break-words">
        {row.first_name} {row.last_name}
      </span>
    </div>
    <div className="flex flex-col">
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        Email:
      </span>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 break-words">
        {row.email}
      </span>
    </div>
    <div className="flex flex-col">
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        Total Spent:
      </span>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
        ${formatValue(convertToUSD(row.total_spent))}
      </span>
    </div>
  </div>
);

const TopCustomersTable = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [viewMode, setViewMode] = useState<"revenue" | "orders">("revenue");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [startDate, endDate] = dateRange || [];

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!startDate || !endDate) return;

      setLoading(true);
      setError(null);

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
          `analysis/customer-order-summary?${params.toString()}`
        );
        const data = response.data as { customers?: Customer[] };
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

  const filteredCustomers = useMemo(() => {
    setCurrentPage(0); // Reset pagination on search
    if (!searchTerm) return customers;
    return customers.filter((c) =>
      c.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const paginatedCustomers = useMemo(() => {
    const start = currentPage * rowsPerPage;
    return filteredCustomers.slice(start, start + rowsPerPage);
  }, [filteredCustomers, currentPage, rowsPerPage]);

  const topCustomers = useMemo(() => {
    return [...filteredCustomers]
      .sort((a, b) =>
        viewMode === "revenue"
          ? b.total_spent - a.total_spent
          : b.total_orders - a.total_orders
      )
      .slice(0, 10);
  }, [viewMode, filteredCustomers]);

  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: { show: false },
        foreColor: isDark ? "#CBD5E1" : "#334155",
        events: {
          dataPointSelection: (_event, _chartContext, config) => {
            const customerName = topCustomers[config.dataPointIndex]?.customer_name;
            if (customerName) {
              setSelectedCustomer(customerName);
              setDialogVisible(true);
            }
          },
        },
      },
      xaxis: {
        categories: topCustomers.map((c) => c.customer_name),
        labels: {
          style: {
            fontSize: "12px",
            colors: isDark ? "#CBD5E1" : "#334155",
          },
          formatter: (val: string) =>
            val.length > 20 ? val.substring(0, 20) + "..." : val,
        },
        title: {
          text: "Customers",
          style: {
            fontSize: "14px",
            fontWeight: "normal",
            color: isDark ? "#CBD5E1" : "#64748B",
          },
        },
      },
      yaxis: {
        title: {
          text: viewMode === "revenue" ? "Total Spent ($)" : "Orders",
          style: {
            fontSize: "14px",
            fontWeight: "normal",
            color: isDark ? "#CBD5E1" : "#64748B",
          },
        },
        labels: {
          formatter: (val: number) =>
            viewMode === "revenue" ? `$${formatValue(val)}` : formatValue(val),
        },
      },
      dataLabels: { enabled: false },
      plotOptions: { bar: { borderRadius: 4, columnWidth: "50%" } },
      grid: { borderColor: isDark ? "#334155" : "#E5E7EB" },
      colors: ["#a855f7"],
      legend: { show: false },
      tooltip: getBaseTooltip(isDark, revenueTooltip),
    }),
    [isDark, viewMode, topCustomers]
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

  const dialogFetchData = (params?: any) => async (tableParams: any) => {
    const query = new URLSearchParams({
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      page: tableParams.page?.toString() ?? "0",
      size: tableParams.rows?.toString() ?? "10",
      ...params,
      ...tableParams.filters,
    });

    if (tableParams.sortField) {
      query.append("sortField", tableParams.sortField);
      query.append("sortOrder", tableParams.sortOrder?.toString() ?? "1");
    }

    if (enterpriseKey) {
      query.append("enterpriseKey", enterpriseKey);
    }

    if (selectedCustomer) {
      query.append("customer_name", selectedCustomer);
    }

    const response = await axiosInstance.get(
      `/analysis/details-customers-grid?${query.toString()}`
    );

    return {
      data: response.data.customers,
      count: response.data.count,
    };
  };

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
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-xl">
      <div className="flex flex-col gap-4 px-4 pt-4">
        <h2 className="app-subheading">Customer Orders</h2>
        <div className="flex flex-col gap-2 w-full">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="app-search-input w-full max-w-full"
          />
          <PrimeSelectFilter<"revenue" | "orders">
            value={viewMode}
            options={[
              { label: "By Revenue", value: "revenue" },
              { label: "By Orders", value: "orders" },
            ]}
            onChange={setViewMode}
            className="w-full sm:w-64 h-10 leading-[0.9rem]"
            placeholder="Select View Mode "
          />
        </div>
      </div>

      <div className="px-4 pt-2 pb-6 app-table-heading">
        <div className="hidden sm:block">
          <DataTable
            value={filteredCustomers}
            stripedRows
            responsiveLayout="scroll"
            scrollable
            scrollHeight="400px"
            sortMode="multiple"
            emptyMessage="No customers found for the selected filters"
            loading={loading}
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

        {/* Mobile Card View */}
        <div className="block sm:hidden space-y-4 mt-4">
          {paginatedCustomers.map((customer, index) => (
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

          {/* Mobile Pagination */}
          {filteredCustomers.length > rowsPerPage && (
            <div className="flex flex-col text-sm text-gray-700 dark:text-gray-100 mt-4">
              <div className="flex flex-col gap-2 mb-2 w-full">
                <label htmlFor="mobileRows" className="whitespace-nowrap">
                  Rows per page:
                </label>
                <select
                  id="mobileRows"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setCurrentPage(0);
                    setRowsPerPage(Number(e.target.value));
                  }}
                  className="px-2 py-1 rounded dark:bg-gray-800 bg-gray-100 dark:text-white text-gray-800 w-full border"
                >
                  {[5, 10, 20].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-black dark:text-white font-medium">
                Page {currentPage + 1} of{" "}
                {Math.ceil(filteredCustomers.length / rowsPerPage)}
              </div>

              <div className="flex flex-wrap justify-between gap-2 w-full mt-2">
                <button
                  onClick={() => setCurrentPage(0)}
                  disabled={currentPage === 0}
                  className="flex-1 px-2 py-1 text-xs rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40"
                >
                  ⏮ First
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="flex-1 px-2 py-1 text-xs rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(filteredCustomers.length / rowsPerPage) - 1
                      )
                    )
                  }
                  disabled={(currentPage + 1) * rowsPerPage >= filteredCustomers.length}
                  className="flex-1 px-2 py-1 text-xs rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40"
                >
                  Next
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(Math.ceil(filteredCustomers.length / rowsPerPage) - 1)
                  }
                  disabled={(currentPage + 1) * rowsPerPage >= filteredCustomers.length}
                  className="flex-1 px-2 py-1 text-xs rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart Section */}
      <div className="px-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="app-subheading mb-2">Top 10 Customers Visualization</h3>
          <button
            onClick={() => setDialogVisible(true)}
            className="text-purple-500 hover:text-purple-700"
            title="View detailed customer table"
          >
            <FaTable className="text-xl" />
          </button>
        </div>

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

      <FilteredDataDialog
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          setSelectedCustomer(null);
        }}
        header={
          selectedCustomer
            ? `Details for ${selectedCustomer}`
            : "Customer Order Details"
        }
        fetchData={dialogFetchData}
        columns={[
          { field: "first_name", header: "First Name", sortable: true, filter: true },
          { field: "last_name", header: "Last Name", sortable: true, filter: true },
          { field: "email", header: "Email", sortable: true, filter: true },
          {
            field: "total_spent",
            header: "Total Spent ($)",
            sortable: true,
            filter: true,
            body: (row: any) => `$${formatValue(convertToUSD(row.total_spent))}`,
          },
        ]}
        mobileCardRender={customerDialogMobileCardRender}
      />
    </Card>
  );
};

export default TopCustomersTable;