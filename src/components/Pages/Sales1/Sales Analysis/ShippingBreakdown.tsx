import  { useMemo } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";

const dummyShipments = [
  { carrier: "FedEx", method: "Standard", status: "Delivered", cost: 12 },
  { carrier: "UPS", method: "Express", status: "In Transit", cost: 20 },
  { carrier: "DHL", method: "Same-Day", status: "Delivered", cost: 30 },
  { carrier: "FedEx", method: "Standard", status: "Delayed", cost: 15 },
  { carrier: "UPS", method: "Express", status: "Delivered", cost: 22 },
];

const ShippingBreakdown = () => {
  const { theme } = useTheme();

  const carrierTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    dummyShipments.forEach((s) => {
      totals[s.carrier] = (totals[s.carrier] || 0) + s.cost;
    });
    return totals;
  }, []);

  const chartOptions: ApexOptions = useMemo(() => ({
    chart: {
      type: "bar",
      toolbar: { show: false },
      foreColor: theme === "dark" ? "#CBD5E1" : "#334155",
    },
    xaxis: {
      categories: Object.keys(carrierTotals),
      title: {
        text: "Carrier",
        style: {
          fontSize: "14px",
          fontWeight: "normal",
          color: theme === "dark" ? "#CBD5E1" : "#64748B",
        },
      },
    },
    yaxis: {
      title: {
        text: "Total Cost",
        style: {
          fontSize: "14px",
          fontWeight: "normal",
          color: theme === "dark" ? "#CBD5E1" : "#64748B",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
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
  }), [carrierTotals, theme]);

  const chartSeries = [
    {
      name: "Shipping Cost",
      data: Object.values(carrierTotals),
    },
  ];

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-xl">
      <div className="px-4 pt-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Shipping Breakdown
        </h2>
      </div>

      <div className="px-4 pb-6">
        <DataTable
          value={dummyShipments}
          stripedRows
          responsiveLayout="stack"
          scrollable
          sortMode="multiple"
        >
          <Column field="carrier" header="Carrier" sortable className="text-sm" />
          <Column field="method" header="Method" sortable className="text-sm" />
          <Column field="status" header="Status" sortable className="text-sm" />
          <Column
            field="cost"
            header="Cost"
            sortable
            className="text-sm"
            body={(rowData) => `$${rowData.cost.toFixed(2)}`}
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

export default ShippingBreakdown;