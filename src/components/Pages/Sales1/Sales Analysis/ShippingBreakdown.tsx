import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import { Skeleton } from "primereact/skeleton";
import dayjs from "dayjs";
import { axiosInstance } from "../../../../axios";

interface Shipment {
  carrier: string;
  shipping_method: string;
  shipment_status: string;
  shipment_cost: number;
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

const ShippingBreakdown = () => {
  const { theme } = useTheme();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get filters from Redux
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange || [];

  // Fetch shipments data when filters change
  useEffect(() => {
    const fetchShipments = async () => {
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
        const response = await axiosInstance.get(`/analysis/shipment-summary?${params.toString()}`);
        const data = response.data as { shipments?: Shipment[] };
        setShipments(data.shipments || []);
      } catch (err) {
        console.error("Error fetching shipments:", err);
        setError("Failed to load shipment data");
      } finally {
        setLoading(false);
      }
    };
    fetchShipments();
  }, [startDate, endDate, enterpriseKey]);

  // Calculate carrier totals for the chart (top 10 carriers)
  const carrierTotals = useMemo(() => {
    const totals: Record<string, number> = {};

    shipments.forEach((shipment) => {
      totals[shipment.carrier] = (totals[shipment.carrier] || 0) + shipment.shipment_cost;
    });

    // Convert to array, sort by total cost, take top 10, and convert back to object
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .reduce((acc, [carrier, total]) => {
        acc[carrier] = total;
        return acc;
      }, {} as Record<string, number>);
  }, [shipments]);

  const chartOptions: ApexOptions = useMemo(() => ({
    chart: {
      type: "bar",
      toolbar: { show: false },
      foreColor: theme === "dark" ? "#CBD5E1" : "#334155",
    },
    xaxis: {
      categories: Object.keys(carrierTotals),
      labels: {
        style: {
          fontSize: "12px",
          colors: theme === "dark" ? "#CBD5E1" : "#334155",
        },
      },
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
        text: "Total Cost (USD)",
        style: {
          fontSize: "14px",
          fontWeight: "normal",
          color: theme === "dark" ? "#CBD5E1" : "#64748B",
        },
      },
      labels: {
        formatter: function (val: number) {
          return `$${formatValue(convertToUSD(val))}`;
        }
      }
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
    tooltip: {
      y: {
        formatter: function (val: number) {
          return `$${convertToUSD(val).toFixed(2)}`;
        }
      }
    }
  }), [carrierTotals, theme]);

  const chartSeries = [
    {
      name: "Shipping Cost (USD)",
      data: Object.values(carrierTotals).map(cost => convertToUSD(cost)),
    },
  ];

  if (!startDate || !endDate) {
    return (
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-xl">
        <div className="text-center text-gray-500 dark:text-gray-400 p-4">
          Please select a date range to view shipping breakdown
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
      <div className="px-4 pt-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Shipping Breakdown
        </h2>
      </div>

      <div className="px-4 pb-6">
        <DataTable
          value={shipments}
          stripedRows
          responsiveLayout="scroll"
          scrollable
          scrollHeight="400px"
          sortMode="multiple"
          emptyMessage="No shipments found for the selected filters"
        >
          <Column
            field="carrier"
            header="Carrier"
            sortable
            className="text-sm"
            style={{ minWidth: '120px' }}
          />
          <Column
            field="shipping_method"
            header="Method"
            sortable
            className="text-sm"
            style={{ minWidth: '120px' }}
          />
          <Column
            field="shipment_status"
            header="Status"
            sortable
            className="text-sm"
            style={{ minWidth: '120px' }}
          />
          <Column
            field="shipment_cost"
            header="Cost (USD)"
            sortable
            className="text-sm"
            body={(rowData) => `$${formatValue(convertToUSD(rowData.shipment_cost))}`}
            style={{ minWidth: '120px' }}
          />
        </DataTable>
      </div>

      <div className="px-4 pb-6">
        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Top 10 Carriers by Total Cost
        </h3>
        {Object.keys(carrierTotals).length > 0 ? (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={350}
          />
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 h-[280px] flex items-center justify-center">
            No shipment data available for visualization
          </div>
        )}
      </div>
    </Card>
  );
};

export default ShippingBreakdown;