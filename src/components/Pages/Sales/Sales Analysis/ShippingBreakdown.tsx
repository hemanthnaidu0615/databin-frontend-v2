"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  DataTable,
  DataTablePageEvent,
  DataTableSortEvent,
  DataTableFilterEvent,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";

import { useDateRangeEnterprise } from "../../../utils/useGlobalFilters";
import { formatDateTime, formatValue } from "../../../utils/kpiUtils";
import { axiosInstance } from "../../../../axios";
import { getBaseTooltip, costTooltip } from "../../../modularity/graphs/graphWidget";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

interface Shipment {
  carrier: string;
  shipping_method: string;
  shipment_status: string;
  shipment_cost: number;
  shipment_cost_usd?: number;
}

const convertToUSD = (rupees: number) => rupees * 0.012;

const ShippingBreakdown: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [data, setData] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [filters, setFilters] = useState<any>({
    global: { value: null, matchMode: "contains" },
    carrier: { value: null, matchMode: "contains" },
    shipping_method: { value: null, matchMode: "contains" },
    shipment_status: { value: null, matchMode: "contains" },
  });

  const [page, setPage] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [sortField, setSortField] = useState<string>("shipment_cost_usd");
  const [sortOrder, setSortOrder] = useState<1 | -1>(-1);

  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const isReady = dateRange && dateRange[0] && dateRange[1];

  // Detect mobile via window width
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 768);
    updateMobile();
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  // Fetch data from API
  const fetchData = () => {
    if (!isReady) return;

    const [startDate, endDate] = dateRange;
    const queryParams = new URLSearchParams({
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      page: page.toString(),
      size: rows.toString(),
    });

    if (enterpriseKey?.trim()) {
      queryParams.append("enterpriseKey", enterpriseKey);
    }

    if (sortField) {
      queryParams.append("sortField", sortField);
      queryParams.append("sortOrder", sortOrder === 1 ? "asc" : "desc");
    }

    // Append filters except global
    for (const key in filters) {
      if (key === "global") continue;
      const value = filters[key]?.value;
      const matchMode = filters[key]?.matchMode;
      if (value != null && value !== "") {
        queryParams.append(`${key}.value`, value);
        queryParams.append(`${key}.matchMode`, matchMode);
      }
    }

    // Append global filter
    if (filters.global?.value) {
      queryParams.append("global.value", filters.global.value);
      queryParams.append("global.matchMode", filters.global.matchMode);
    }

    setLoading(true);

    axiosInstance
      .get(`/analysis/shipment-summary?${queryParams.toString()}`)
      .then((res) => {
        const shipments = res.data.shipments || [];
        const shipmentsWithUSD = shipments.map((s: Shipment) => ({
          ...s,
          shipment_cost_usd: convertToUSD(s.shipment_cost),
        }));

        setData(shipmentsWithUSD);
        setTotalRecords(res.data.count || 0);
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        setData([]);
        setTotalRecords(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, enterpriseKey, page, rows, sortField, sortOrder, filters]);


  const onPageChange = (e: DataTablePageEvent) => {
    setPage(e.page ?? 0);
    setRows(e.rows ?? 10);
  };

  const onSort = (e: DataTableSortEvent) => {
    const newSortField = e.sortField ?? "";
    const isSame = newSortField === sortField;
    const newSortOrder = isSame ? sortOrder * -1 : 1;
    setSortField(newSortField);
    setSortOrder(newSortOrder as 1 | -1);
  };

  const onFilter = (e: DataTableFilterEvent) => {
    setFilters(e.filters);
    setPage(0);
  };

  const renderFilterInput = (placeholder: string = "Search") => (options: any) => (
    <InputText
      value={options.value || ""}
      onChange={(e) => options.filterCallback(e.target.value)}
      placeholder={placeholder}
      className="p-column-filter"
    />
  );

  // Top 10 carriers totals for chart
  const carrierTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    data.forEach((shipment) => {
      const carrier = shipment.carrier || "Unknown";
      totals[carrier] = (totals[carrier] || 0) + (shipment.shipment_cost_usd ?? 0);
    });
    return Object.entries(totals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .reduce((acc, [carrier, total]) => {
        acc[carrier] = total;
        return acc;
      }, {} as Record<string, number>);
  }, [data]);

  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: { show: false },
        foreColor: isDark ? "#CBD5E1" : "#334155",
      },
      xaxis: {
        categories: Object.keys(carrierTotals),
        labels: {
          style: { fontSize: "12px", colors: isDark ? "#CBD5E1" : "#334155" },
        },
        crosshairs: { show: false },
        title: {
          text: "Carriers",
          style: { fontSize: "14px", fontWeight: "normal", color: isDark ? "#CBD5E1" : "#64748B" },
        },
      },
      yaxis: {
        title: {
          text: "Total Cost ($)",
          style: { fontSize: "14px", fontWeight: "normal", color: isDark ? "#CBD5E1" : "#64748B" },
        },
        labels: { formatter: (val: number) => `$${formatValue(val)}` },
      },
      dataLabels: { enabled: false },
      plotOptions: { bar: { borderRadius: 4, columnWidth: "50%" } },
      grid: { borderColor: isDark ? "#334155" : "#E5E7EB" },
      colors: ["#a855f7"],
      tooltip: getBaseTooltip(isDark, costTooltip),
    }),
    [carrierTotals, isDark]
  );

  const chartSeries = [
    {
      name: "Shipping Cost (USD)",
      data: Object.values(carrierTotals),
    },
  ];

  // Mobile pagination controls
  const mobileTotalPages = Math.ceil(totalRecords / rows);
  const onMobilePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < mobileTotalPages) setPage(newPage);
  };

  return (
    <div className="card p-4">
      <h2 className="app-subheading">Shipping Breakdown</h2>

      {loading ? (
        <div className="flex justify-center mt-5">
          <ProgressSpinner />
        </div>
      ) : isMobile ? (
        // MOBILE VIEW: Cards + pagination
        <>
          {data.length === 0 && <p className="text-center text-gray-500">No shipments found</p>}

          <div className="space-y-3">
            {data.slice(page * rows, page * rows + rows).map((shipment, index) => (
              <div
                key={index}
                className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-2 shadow-sm border ${isDark ? "border-gray-700" : "border-gray-200"}`}
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
                  <span className="text-sm text-gray-500 dark:text-gray-400">Method:</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {shipment.shipping_method}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {shipment.shipment_status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Cost:</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    ${shipment.shipment_cost_usd ? formatValue(shipment.shipment_cost_usd) : "0"}
                  </span>
                </div>
              </div>
            ))}

          </div>

          {/* Mobile pagination */}
          {/* Mobile pagination */}
          <div className="flex justify-end mt-4">
            <label className="mr-2 text-sm">Rows per page:</label>
            <select
              value={rows}
              onChange={(e) => {
                setRows(Number(e.target.value));
                setPage(0);
              }}
              className="px-2 py-1 text-sm rounded bg-gray-100 dark:bg-gray-800 border dark:border-gray-700"
            >
              {[5, 10, 20, 50, 100].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center items-center gap-2 mt-6 text-xs">
            <button
              onClick={() => onMobilePageChange(0)}
              disabled={page === 0}
              className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              ⏮ First
            </button>
            <button
              onClick={() => onMobilePageChange(page - 1)}
              disabled={page === 0}
              className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              ◀ Prev
            </button>

            <span>
              Page {page + 1} of {mobileTotalPages}
            </span>

            <button
              onClick={() => onMobilePageChange(page + 1)}
              disabled={page + 1 >= mobileTotalPages}
              className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next ▶
            </button>
            <button
              onClick={() => onMobilePageChange(mobileTotalPages - 1)}
              disabled={page + 1 >= mobileTotalPages}
              className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Last ⏭
            </button>
          </div>

        </>
      ) : (
        // DESKTOP VIEW: Full DataTable
        <>
          <DataTable
            value={data}
            paginator
            rows={rows}
            first={page * rows}
            totalRecords={totalRecords}
            onPage={onPageChange}
            rowsPerPageOptions={[10, 20, 50, 100]}
            sortMode="single"
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={onSort}
            onFilter={onFilter}
            lazy
            filters={filters}
            globalFilterFields={["carrier", "shipping_method", "shipment_status"]}
            responsiveLayout="scroll"
            emptyMessage="No shipments found"
          >
            <Column
              field="carrier"
              header="Carrier"
              sortable
              filter
              filterField="carrier"
              filterElement={renderFilterInput()}
            />
            <Column
              field="shipping_method"
              header="Shipping Method"
              sortable
              filter
              filterField="shipping_method"
              filterElement={renderFilterInput()}
            />
            <Column
              field="shipment_status"
              header="Status"
              sortable
              filter
              filterField="shipment_status"
              filterElement={renderFilterInput()}
            />
            <Column
              field="shipment_cost_usd"
              header="Cost (USD)"
              sortable
              style={{ textAlign: "left" }}
              body={(rowData: Shipment) =>
                `$${rowData.shipment_cost_usd ? formatValue(rowData.shipment_cost_usd) : "0"}`
              }
            />
          </DataTable>
        </>
      )}

      <h3 className="mt-6 mb-6 app-subheading">Top 10 Carriers by Total Cost</h3>
      {Object.keys(carrierTotals).length > 0 ? (
        <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
      ) : (
        <p className="text-center text-gray-500">No shipment data available for visualization.</p>
      )}
    </div>
  );
};

export default ShippingBreakdown;
