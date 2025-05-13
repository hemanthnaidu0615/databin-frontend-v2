import { useState, useMemo } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";

const rawCustomers = [
  { name: "Alice Johnson", orders: 10, total: 4300 },
  { name: "Bob Smith", orders: 8, total: 3800 },
  { name: "Charlie Lee", orders: 12, total: 2750 },
  { name: "Diana Prince", orders: 6, total: 1950 },
  { name: "Ethan Hunt", orders: 7, total: 1650 },
];

const viewOptions = [
  { label: "By Revenue", value: "revenue" },
  { label: "By Orders", value: "orders" },
];

const TopCustomersTable = () => {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<"revenue" | "orders">("revenue");

  const sortedCustomers = useMemo(() => {
    return [...rawCustomers].sort((a, b) =>
      viewMode === "revenue" ? b.total - a.total : b.orders - a.orders
    );
  }, [viewMode]);

  const chartOptions: ApexOptions = useMemo(() => ({
    chart: {
      type: "bar",
      toolbar: { show: false },
      foreColor: theme === "dark" ? "#CBD5E1" : "#334155",
    },
    xaxis: {
      categories: sortedCustomers.map((c) => c.name),
      labels: {
        style: {
          fontSize: "12px",
          colors: theme === "dark" ? "#CBD5E1" : "#334155",
        },
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
        text: viewMode === "revenue" ? "Total Spent" : "Orders",
        style: {
          fontSize: "14px",
          fontWeight: "normal",
          color: theme === "dark" ? "#CBD5E1" : "#64748B",
        },
      },
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
  }), [theme, viewMode, sortedCustomers]);

  const chartSeries = [
    {
      name: viewMode === "revenue" ? "Total Spent" : "Orders",
      data:
        viewMode === "revenue"
          ? sortedCustomers.map((c) => c.total)
          : sortedCustomers.map((c) => c.orders),
    },
  ];

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 pt-4 gap-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Top Customers
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
          responsiveLayout="stack"
          scrollable
          sortMode="multiple"
        >
          <Column field="name" header="Customer Name" sortable className="text-sm" />
          <Column
            field="orders"
            header="Orders"
            sortable
            className="text-sm"
            body={(rowData) => <span>{rowData.orders}</span>}
          />
          <Column
            field="total"
            header="Total Spent"
            sortable
            className="text-sm"
            body={(rowData) => `$${rowData.total.toFixed(2)}`}
          />
        </DataTable>
      </div>

      <div className="px-4 pb-6">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={280}
        />
      </div>
    </Card>
  );
};

export default TopCustomersTable;