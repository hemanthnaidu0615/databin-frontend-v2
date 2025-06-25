"use client";

import React, { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";

import { useDateRangeEnterprise } from "../../../utils/useGlobalFilters";
import { formatDateTime, formatValue } from "../../../utils/kpiUtils";
import { axiosInstance } from "../../../../axios";
import { getBaseTooltip, costTooltip } from "../../../modularity/graphs/graphWidget";
import { BaseDataTable, TableColumn } from "../../../modularity/tables/BaseDataTable";

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
      if (key.endsWith("Filter") && params[key] != null && params[key] !== "") {
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
    className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-2 shadow-sm border ${isDark ? "border-gray-700" : "border-gray-200"} mb-3`}
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

  return (
    <div className="card p-4">
      <h2 className="app-subheading">Shipping Breakdown</h2>

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
        <h3 className="app-subheading mb-6">Top 10 Carriers by Total Cost</h3>
        {Object.keys(carrierTotals).length > 0 ? (
          <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
        ) : (
          <p className="text-center text-gray-500">No shipment data available for visualization.</p>
        )}
      </div>
    </div>
  );
};

export default ShippingBreakdown;