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
  shipment_cost_usd?: number;
}

const formatDate = (date: Date) => dayjs(date).format("YYYY-MM-DD");

const formatValue = (value: number): string => {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
  return value.toFixed(0);
};

function convertToUSD(rupees: number): number {
  const exchangeRate = 0.012;
  return rupees * exchangeRate;
}

const ShippingBreakdown = () => {
  const { theme } = useTheme();
  const [shipments, setShipments] = useState<Shipment[]>([]);
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
    const fetchShipments = async () => {
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
          `/analysis/shipment-summary?${params.toString()}`
        );
        const data = response.data as { shipments: Shipment[]; count: number };

        setShipments(
          (data.shipments || []).map((s) => ({
            ...s,
            shipment_cost_usd: convertToUSD(s.shipment_cost),
          }))
        );
        setTotalRecords(data.count || 0);
      } catch (err) {
        console.error("Error fetching shipments:", err);
        setError("Failed to load shipment data");
        setShipments([]);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, [startDate, endDate, enterpriseKey, page, rows]);

  const carrierTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    shipments.forEach((shipment) => {
      totals[shipment.carrier] =
        (totals[shipment.carrier] || 0) + (shipment.shipment_cost_usd ?? 0);
    });
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .reduce((acc, [carrier, total]) => {
        acc[carrier] = total;
        return acc;
      }, {} as Record<string, number>);
  }, [shipments]);

  const chartOptions: ApexOptions = useMemo(
    () => ({
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
        crosshairs: { show: false },
        title: {
          text: "Carriers",
          style: {
            fontSize: "14px",
            fontWeight: "normal",
            color: theme === "dark" ? "#CBD5E1" : "#64748B",
          },
        },
      },
      yaxis: {
        title: {
          text: "Total Cost ($)",
          style: {
            fontSize: "14px",
            fontWeight: "normal",
            color: theme === "dark" ? "#CBD5E1" : "#64748B",
          },
        },
        labels: {
          formatter: (val: number) => `$${formatValue(val)}`,
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
      tooltip: {
        y: {
          formatter: (val: number) => `$${val.toFixed(2)}`,
        },
      },
    }),
    [carrierTotals, theme]
  );

  const chartSeries = [
    {
      name: "Shipping Cost (USD)",
      data: Object.values(carrierTotals),
    },
  ];

  const onPage = (event: any) => {
    setPage(event.page);
    setRows(event.rows);
  };

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
        <div className="p-4 text-red-500 dark:text-red-400">{error}</div>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-xl ">
      <div className="px-4 pt-4 product-sales-header">
        <h2 className="app-subheading ">Shipping Breakdown</h2>
      </div>

      <div className="px-4 pb-6 app-table-heading">
        {/* Desktop Table - Hidden on mobile */}
        <div className="hidden sm:block">
          <DataTable
            value={shipments}
            stripedRows
            responsiveLayout="scroll"
            scrollable
            scrollHeight="400px"
            sortMode="multiple"
            emptyMessage="No shipments found for the selected filters"
            paginator
            paginatorClassName="hidden sm:flex"
            lazy
            loading={loading}
            totalRecords={totalRecords}
            first={page * rows}
            rows={rows}
            onPage={onPage}
            rowsPerPageOptions={[5, 10, 20, 50, 100]}
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} shipments"
            paginatorTemplate="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          >
            <Column
              field="carrier"
              header="Carrier"
              sortable
              style={{ minWidth: "120px" }}
            />
            <Column
              field="shipping_method"
              header="Method"
              sortable
              style={{ minWidth: "120px" }}
            />
            <Column
              field="shipment_status"
              header="Status"
              sortable
              style={{ minWidth: "120px" }}
            />
            <Column
              field="shipment_cost_usd"
              header="Cost ($)"
              sortable
              body={(rowData) =>
                `$${formatValue(rowData.shipment_cost_usd ?? 0)}`
              }
              style={{ minWidth: "120px" }}
            />
          </DataTable>
        </div>

        {/* Mobile-friendly stacked cards */}
        <div className="block sm:hidden space-y-4 mt-4">
          {shipments
            .slice(page * rows, page * rows + rows)
            .map((shipment, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-2 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Carrier:
                  </span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 break-words">
                    {shipment.carrier}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Method:
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {shipment.shipping_method}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Status:
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {shipment.shipment_status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Cost:
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    ${formatValue(shipment.shipment_cost_usd ?? 0)}
                  </span>
                </div>
              </div>
            ))}
        </div>

        {/* Mobile Pagination (only visible on small screens) */}
        <div className="mt-4 text-sm text-gray-800 dark:text-gray-100 sm:hidden">
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="mobileRows" className="whitespace-nowrap">
                Rows per page:
              </label>
              <select
                id="mobileRows"
                value={rows}
                onChange={(e) => {
                  setRows(Number(e.target.value));
                  setPage(0);
                }}
                className="px-2 py-1 rounded dark:bg-gray-800 bg-gray-100 dark:text-white text-gray-800 w-full border"
              >
                {[5, 10, 20, 50, 100].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              Page {page + 1} of {Math.ceil(totalRecords / rows)}
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-2">
            <button
              onClick={() => setPage(0)}
              disabled={page === 0}
              className="flex-1 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              ⏮ First
            </button>
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="flex-1 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
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
              className="flex-1 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
            <button
              onClick={() => setPage(Math.ceil(totalRecords / rows) - 1)}
              disabled={(page + 1) * rows >= totalRecords}
              className="flex-1 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              ⏭ Last
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pb-6">
        <h3 className="app-subheading mb-4">Top 10 Carriers by Total Cost</h3>
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
