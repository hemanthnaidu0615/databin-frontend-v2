"use client";

import React, { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";

import { useDateRangeEnterprise } from "../../../utils/useGlobalFilters";
import { formatDateTime, formatValue, formatDateMDY, formatUSD  } from "../../../utils/kpiUtils";
import { axiosInstance } from "../../../../axios";
import { getBaseTooltip, costTooltip } from "../../../modularity/graphs/graphWidget";
import { BaseDataTable, TableColumn } from "../../../modularity/tables/BaseDataTable";
import FilteredDataDialog from "../../../modularity/tables/FilteredDataDialog";
import { FaTable } from "react-icons/fa";

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
  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [allData, setAllData] = useState<Shipment[]>([]);
  const [showCarrierDialog, setShowCarrierDialog] = useState(false);
  const [carrierFilter, setCarrierFilter] = useState<string | null>(null);
  const [showUnfilteredDialog, setShowUnfilteredDialog] = useState(false);

  const fetchData = async (params: any) => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      return { data: [], count: 0 };
    }

    const [startDate, endDate] = dateRange;
    const queryParams = new URLSearchParams({
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      page: params.page.toString(),
      size: params.size.toString(),
    });

    if (enterpriseKey?.trim()) {
      queryParams.append("enterpriseKey", enterpriseKey);
    }

    if (params.sortField) {
      queryParams.append("sortField", params.sortField);
      queryParams.append("sortOrder", params.sortOrder === "asc" ? "asc" : "desc");
    }

    for (const key in params) {
      if (
        (key.includes(".value") || key.includes(".matchMode")) &&
        params[key] != null &&
        params[key] !== ""
      ) {
        queryParams.append(key, params[key]);
      }
    }


    try {
      const res = await axiosInstance.get(`/analysis/shipment-summary?${queryParams.toString()}`);
      const data = res.data as { shipments?: Shipment[]; count?: number };
      const shipments = data.shipments || [];
      const shipmentsWithUSD = shipments.map((s: Shipment) => ({
        ...s,
        shipment_cost_usd: convertToUSD(s.shipment_cost),
      }));

      setAllData(shipmentsWithUSD);

      return {
        data: shipmentsWithUSD,
        count: data.count || 0,
      };
    } catch (err) {
      console.error("❌ Fetch error:", err);
      return { data: [], count: 0 };
    }
  };

  const columns: TableColumn<Shipment>[] = [
    {
      field: "carrier",
      header: "Carrier",
      sortable: true,
      filter: true,
      filterPlaceholder: "Search carriers",
    },
    {
      field: "shipping_method",
      header: "Shipping Method",
      sortable: true,
      filter: true,
      filterPlaceholder: "Search methods",
    },
    {
      field: "shipment_status",
      header: "Status",
      sortable: true,
      filter: true,
      filterPlaceholder: "Search statuses",
    },
    {
      field: "shipment_cost_usd",
      header: "Cost (USD)",
      sortable: true,
      body: (rowData: Shipment) =>
        `$${rowData.shipment_cost_usd ? formatValue(rowData.shipment_cost_usd) : "0"}`,
    },
  ];

  const mobileCardRender = (shipment: Shipment, index: number) => (
    <div
      key={`${shipment.carrier}-${shipment.shipping_method}-${index}`}
      className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-2 shadow-sm border ${isDark ? "border-gray-700" : "border-gray-200"
        } mb-3`}
    >
      <div className="flex flex-col">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Carrier:</span>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 break-words">
          {shipment.carrier || "Unknown"}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">Method:</span>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {shipment.shipping_method || "N/A"}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {shipment.shipment_status || "Unknown"}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">Cost:</span>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
          ${shipment.shipment_cost_usd ? formatValue(shipment.shipment_cost_usd) : "0"}
        </span>
      </div>
    </div>
  );

  const carrierTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    allData.forEach((shipment) => {
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
  }, [allData]);

const dialogColumns: TableColumn<any>[] = [
  { field: "shipment_id", header: "Shipment ID", sortable: true, filter: true },
  { field: "order_id", header: "Order ID", sortable: true, filter: true },
  { field: "carrier", header: "Carrier", sortable: true, filter: true },
  { field: "tracking_number", header: "Tracking #", sortable: true, filter: true },
  { field: "shipment_status", header: "Status", sortable: true, filter: true },
  { field: "shipment_cost", header: "Cost", sortable: true, filter: false, body: (rowData: any) => formatUSD(rowData.shipment_cost) },
  { field: "shipping_method", header: "Method", sortable: true, filter: true },

  // Estimated Date (formatted)
  {
    field: "estimated_shipment_date",
    header: "Estimated Date",
    sortable: true,
    filter: true,
    body: (rowData: any) =>
      rowData?.estimated_shipment_date ? formatDateMDY(rowData.estimated_shipment_date) : "N/A",
  },

  // Actual Date (formatted)
  {
    field: "actual_shipment_date",
    header: "Actual Date",
    sortable: true,
    filter: true,
    body: (rowData: any) =>
      rowData?.actual_shipment_date ? formatDateMDY(rowData.actual_shipment_date) : "N/A",
  },
];

  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: { show: false },
        foreColor: isDark ? "#CBD5E1" : "#334155",
        events: {
          dataPointSelection: (_: any, _unused: any, config) => {
            const clickedCarrier = Object.keys(carrierTotals)[config.dataPointIndex];
            if (clickedCarrier) {
              setCarrierFilter(clickedCarrier);
              setShowCarrierDialog(true);
            }
          },
        },
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

const dialogMobileCardRender = (shipment: any, index: number) => (
  <div
    key={`${shipment.shipment_id || index}-${shipment.carrier || "unknown"}`}
    className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-2 shadow-sm border ${isDark ? "border-gray-700" : "border-gray-200"
      } mb-3`}
  >
    <div className="flex flex-col">
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Shipment ID:</span>
      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 break-words">
        {shipment.shipment_id || "N/A"}
      </span>
    </div>

    <div className="flex flex-col">
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Carrier:</span>
      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 break-words">
        {shipment.carrier || "Unknown"}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-sm text-gray-500 dark:text-gray-400">Method:</span>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {shipment.shipping_method || "N/A"}
      </span>
    </div>

    {/* --- INSERTED: Estimated Date --- */}
    <div className="flex justify-between">
      <span className="text-sm text-gray-500 dark:text-gray-400">Estimated Date:</span>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {shipment?.estimated_shipment_date ? formatDateMDY(shipment.estimated_shipment_date) : "N/A"}
      </span>
    </div>

    {/* --- INSERTED: Actual Date --- */}
    <div className="flex justify-between">
      <span className="text-sm text-gray-500 dark:text-gray-400">Actual Date:</span>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {shipment?.actual_shipment_date ? formatDateMDY(shipment.actual_shipment_date) : "N/A"}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {shipment.shipment_status || "Unknown"}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-sm text-gray-500 dark:text-gray-400">Cost:</span>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {formatUSD(shipment.shipment_cost)}
      </span>
    </div>
  </div>
);

  return (
    <div className="card p-4">
      <h2 className="app-subheading">
        Shipping Breakdown
      </h2>

      <BaseDataTable<Shipment>
        columns={columns}
        fetchData={fetchData}
        initialSortField="shipment_cost_usd"
        initialSortOrder={-1}
        mobileCardRender={mobileCardRender}
        title=""
        globalFilterFields={["carrier", "shipping_method", "shipment_status"]}
        emptyMessage="No shipments found"
        field="carrier"
        header=""
      />

      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="app-subheading">Top 10 Carriers by Total Cost</h3>
          <button
            onClick={() => setShowUnfilteredDialog(true)}
            title="Show full shipment data"
            className="text-purple-500 hover:text-purple-700"
            aria-label="Open full shipment data table"
          >
            <FaTable size={18} />
          </button>
        </div>

        {Object.keys(carrierTotals).length > 0 ? (
          <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
        ) : (
          <p className="text-center text-gray-500">No shipment data available for visualization.</p>
        )}
      </div>

      <FilteredDataDialog
        visible={showCarrierDialog}
        onHide={() => setShowCarrierDialog(false)}
        header={`Shipments for Carrier: ${carrierFilter}`}
        columns={dialogColumns}
        fetchData={(params?: any) => async (tableParams: any) => {
          const [startDate, endDate] = dateRange || [];
          const response = await axiosInstance.get("carrier-performance/carrier-details", {
            params: {
              ...params,
              ...tableParams,
              startDate: formatDateTime(startDate),
              endDate: formatDateTime(endDate),
              ...(enterpriseKey && { enterpriseKey }),
              ...(carrierFilter && { carrier: carrierFilter }),
            },
          });
          return { data: response.data.data, count: response.data.count };
        }}
        mobileCardRender={dialogMobileCardRender}
      />
      <FilteredDataDialog
        visible={showUnfilteredDialog}
        onHide={() => setShowUnfilteredDialog(false)}
        header="All Shipment Data"
        columns={dialogColumns}
        fetchData={(params?: any) => async (tableParams: any) => {
          const [startDate, endDate] = dateRange || [];
          const response = await axiosInstance.get("carrier-performance/carrier-details", {
            params: {
              ...params,
              ...tableParams,
              startDate: formatDateTime(startDate),
              endDate: formatDateTime(endDate),
              ...(enterpriseKey && { enterpriseKey }),
              // No carrier filter here
            },
          });
          return { data: response.data.data, count: response.data.count };
        }}
        mobileCardRender={dialogMobileCardRender}
      />
    </div>
  );
};

export default ShippingBreakdown;
