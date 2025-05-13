import { useState, useMemo } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";

const rawProducts = [
  { name: "Refined Cotton Ball", units: 40, total: 7906.0 },
  { name: "Sleek Metal Car", units: 34, total: 4912.66 },
  { name: "Bespoke Rubber Cheese", units: 32, total: 601.28 },
  { name: "Generic Frozen Salad", units: 28, total: 399.99 },
  { name: "Steel Shoes", units: 20, total: 320.0 },
];

const viewOptions = [
  { label: "By Revenue", value: "revenue" },
  { label: "By Units", value: "units" },
];

const TopProductsTable = () => {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<"revenue" | "units">("revenue");

  const sortedProducts = useMemo(() => {
    return [...rawProducts].sort((a, b) =>
      viewMode === "revenue" ? b.total - a.total : b.units - a.units
    );
  }, [viewMode]);

  const chartOptions: ApexOptions = useMemo(() => ({
    chart: {
      type: "bar",
      toolbar: { show: false },
      foreColor: theme === "dark" ? "#CBD5E1" : "#334155",
    },
    xaxis: {
      categories: sortedProducts.map((p) => p.name),
      labels: {
        style: {
          fontSize: "12px",
          colors: theme === "dark" ? "#CBD5E1" : "#334155",
        },
      },
      title: {
        text: "Product",
        style: {
          fontSize: "14px",
          fontWeight: "normal",
          color: theme === "dark" ? "#CBD5E1" : "#64748B",
        },
      },
    },
    yaxis: {
      title: {
        text: viewMode === "revenue" ? "Total Sales" : "Units Sold",
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
  }), [theme, viewMode, sortedProducts]);

  const chartSeries = [
    {
      name: viewMode === "revenue" ? "Revenue" : "Units Sold",
      data:
        viewMode === "revenue"
          ? sortedProducts.map((p) => p.total)
          : sortedProducts.map((p) => p.units),
    },
  ];

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 pt-4 gap-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Top Products
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
          value={sortedProducts}
          stripedRows
          responsiveLayout="stack"
          scrollable
          sortMode="multiple"
        >
          <Column field="name" header="Product Name" sortable className="text-sm" />
          <Column
            field="units"
            header="Units Sold"
            sortable
            className="text-sm"
            body={(rowData) => <span>{rowData.units}</span>}
          />
          <Column
            field="total"
            header="Total Sales"
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

export default TopProductsTable;