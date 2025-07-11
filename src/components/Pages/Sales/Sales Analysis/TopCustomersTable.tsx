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

const TopCustomersTable = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [viewMode, setViewMode] = useState<"revenue" | "orders">("revenue");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange || [];
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);



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
        const data = response.data as {
          customers?: Customer[];
        };

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
    if (!searchTerm) return customers;
    return customers.filter((c) =>
      c.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

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
        foreColor: theme === "dark" ? "#CBD5E1" : "#334155",
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
            colors: theme === "dark" ? "#CBD5E1" : "#334155",
          },
          formatter: (value: string) =>
            value.length > 20 ? value.substring(0, 20) + "..." : value,
        },
        crosshairs: { show: false },
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
      colors: ["#a855f7"],
      legend: { show: false },
      tooltip: getBaseTooltip(isDark, revenueTooltip),
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
  const customerDialogMobileCardRender = (customer: any, index: number) => (
    <div
      key={index}
      className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-2 shadow-sm border ${isDark ? "border-gray-700" : "border-gray-200"
        } mb-3`}
    >
      <div className="flex flex-col">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">First Name:</span>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 break-words">
          {customer.first_name || "N/A"}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Last Name:</span>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 break-words">
          {customer.last_name || "N/A"}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Email:</span>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 break-words">
          {customer.email || "N/A"}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Spent:</span>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
          ${formatValue(convertToUSD(customer.total_spent))}
        </span>
      </div>
    </div>
  );

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-xl">
      <div className="flex flex-col gap-4 px-4 pt-4">
        <h2 className="app-subheading">Customer Orders</h2>
        <div className="flex flex-col gap-2 w-full">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="app-search-input w-full max-w-full"
          />
          <PrimeSelectFilter<"revenue" | "orders">
            value={viewMode}
            options={[
              { label: "By Revenue", value: "revenue" as "revenue" },
              { label: "By Orders", value: "orders" as "orders" },
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
        <div className="block sm:hidden space-y-4 mt-4">
          {filteredCustomers.map((customer, index) => (
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
      </div>

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
