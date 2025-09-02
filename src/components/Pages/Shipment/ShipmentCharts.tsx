import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { axiosInstance } from "../../../axios";
import { formatDateTime, formatValue, formatDateMDY } from "../../utils/kpiUtils";
import { useDateRangeEnterprise } from "../../utils/useGlobalFilters";
import { getBaseTooltip, shipmentsTooltip } from "../../modularity/graphs/graphWidget";
import { FaTable } from "react-icons/fa";
import FilteredDataDialog from "../../modularity/tables/FilteredDataDialog";
import { TableColumn } from "../../modularity/tables/BaseDataTable";

interface ShipmentChartsProps {
  selectedCarrier: string | null;
  selectedMethod: string | null;
}

const ShipmentCharts: React.FC<ShipmentChartsProps> = ({ selectedCarrier, selectedMethod }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const labelColor = isDark ? "#d4d4d8" : "#52525b";

  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange || [];

  const [carrierSeries, setCarrierSeries] = useState<any[]>([]);
  const [carrierCategories, setCarrierCategories] = useState<string[]>([]);
  const [statusSeries, setStatusSeries] = useState<number[]>([]);

  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showCarrierDialog, setShowCarrierDialog] = useState(false);

  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [carrierFilter, setCarrierFilter] = useState<string | null>(null);

  const commonColumns: TableColumn<any>[] = [
    { field: "shipment_id", header: "Shipment ID", sortable: true, filter: true },
    { field: "order_id", header: "Order ID", sortable: true, filter: true },
    { field: "carrier", header: "Carrier", sortable: true, filter: true },
    { field: "tracking_number", header: "Tracking #", sortable: true, filter: true },
    { field: "shipment_status", header: "Status", sortable: true, filter: true },
    { field: "shipment_cost", header: "Cost", sortable: true, filter: true },
    { field: "shipping_method", header: "Method", sortable: true, filter: true },
    { field: "estimated_shipment_date", header: "Estimated Date", sortable: true, filter: true, body: (row: any) => formatDateMDY(row.estimated_shipment_date),},
    { field: "actual_shipment_date", header: "Actual Date", sortable: true, filter: true,body: (row: any) => formatDateMDY(row.actual_shipment_date), },
  ];

  const baseTooltip = getBaseTooltip(isDark, shipmentsTooltip);
  const tooltipWithoutDollar = {
    ...baseTooltip,
    y: { ...baseTooltip.y, formatter: (v: number) => v.toLocaleString() },
  };

  const openStatusDialog = (filter: string | null = null) => {
    setStatusFilter(filter);
    setShowStatusDialog(true);
  };

  const openCarrierDialog = (filter: string | null = null) => {
    setCarrierFilter(filter);
    setShowCarrierDialog(true);
  };

  const statusLabels = ["Delivered", "In Transit", "Delayed", "Cancelled"];

  const statusOptions: ApexOptions = useMemo(() => ({
    chart: {
      type: "donut",
      background: "transparent",
      fontFamily: "Inter, sans-serif",
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const status = statusLabels[config.dataPointIndex];
          openStatusDialog(status);
        },
      },
    },
    labels: statusLabels,
    legend: {
      position: "bottom",
      fontSize: "14px",
      fontWeight: 500,
      labels: { colors: [labelColor] },
    },
    colors: ["#22c55e", "#a855f7", "#facc15", "#ef4444"],
    stroke: { show: false },
    dataLabels: {
      enabled: true,
      style: { fontSize: "13px", fontWeight: 600, colors: ["#fff"] },
    },
    tooltip: {
      theme: "dark",
      style: { fontSize: "13px" },
    },
  }), [labelColor, isDark]); // Add dependencies here


  const carrierOptions: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      stacked: false,
      toolbar: { show: false },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const carrier = carrierCategories[config.dataPointIndex];
          openCarrierDialog(carrier);
        },
      },
    },
    xaxis: {
      categories: carrierCategories,
      labels: {
        style: { colors: labelColor, fontSize: "13px", fontWeight: 500 },
      },
      title: {
        text: "Carrier",
        style: { color: labelColor, fontSize: "13px", fontWeight: 500 },
      },
      crosshairs: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: labelColor, fontSize: "13px", fontWeight: 500 },
        formatter: formatValue,
      },
      title: {
        text: "Number of Shipments",
        style: { color: labelColor, fontSize: "13px", fontWeight: 500 },
      },
    },
    grid: { borderColor: isDark ? "#4b5563" : "#e5e7eb", strokeDashArray: 4 },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "45%" } },
    colors: ["#a855f7"],
    dataLabels: { enabled: false },
    tooltip: tooltipWithoutDollar,
  };

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchStatus = axiosInstance.get("shipment-status/distribution", {
      params: {
        startDate: formatDateTime(startDate),
        endDate: formatDateTime(endDate),
        ...(enterpriseKey && { enterpriseKey }),
        ...(selectedCarrier && { carrier: selectedCarrier }),
        ...(selectedMethod && { shippingMethod: selectedMethod }),
      },
    });

    const fetchCarrier = axiosInstance.get("carrier-performance", {
      params: {
        startDate: formatDateTime(startDate),
        endDate: formatDateTime(endDate),
        ...(enterpriseKey && { enterpriseKey }),
        ...(selectedCarrier && { carrier: selectedCarrier }),
        ...(selectedMethod && { shippingMethod: selectedMethod }),
      },
    });

    Promise.all([fetchStatus, fetchCarrier])
      .then(([statusRes, carrierRes]) => {
        const s = statusRes.data;
        const statusVals = ["delivered", "in_transit", "delayed", "cancelled"].map(k =>
          parseFloat(s[k] || "0")
        );
        setStatusSeries(statusVals);

        const carrierData = carrierRes.data as Array<{ carrier: string; shipment_count: number }>;
        setCarrierCategories(carrierData.map(item => item.carrier));
        setCarrierSeries([{ name: "Shipments", data: carrierData.map(item => item.shipment_count) }]);
      })
      .catch(err => console.error("Error fetching charts:", err));
  }, [startDate, endDate, enterpriseKey, selectedCarrier, selectedMethod]);
  const shipmentDialogMobileCardRender = (shipment: any, index: number) => (
    <div
      key={index}
      className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-2 shadow-sm border ${isDark ? "border-gray-700" : "border-gray-200"
        } mb-3`}
    >
      <div className="flex justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Shipment ID:</span>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 break-words">
          {shipment.shipment_id || "N/A"}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Carrier:</span>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {shipment.carrier || "N/A"}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Status:</span>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {shipment.shipment_status || "N/A"}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Cost:</span>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
          ${formatValue(shipment.shipment_cost || 0)}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Tracking #:</span>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 break-words">
          {shipment.tracking_number || "N/A"}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
        {/* Shipment Status Chart */}
        <div className="relative bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border dark:border-gray-800">
          <h3 className="app-subheading flex items-center justify-between">
            Shipment Status
            <FaTable className="cursor-pointer text-purple-500" size={20} onClick={() => openStatusDialog()} />
          </h3>
          {statusSeries.length === 0 || statusSeries.every(v => v === 0) ? (
            <div className="text-center text-sm text-gray-400 py-12">No shipment status data available</div>
          ) : (
            <Chart options={statusOptions} series={statusSeries} type="donut" height={300} />
          )}
        </div>

        {/* Carrier Performance Chart */}
        <div className="relative bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border dark:border-gray-800">
          <h3 className="app-subheading flex items-center justify-between">
            Carrier Performance
            <FaTable className="cursor-pointer text-purple-500" size={20} onClick={() => openCarrierDialog()} />
          </h3>
          <Chart options={carrierOptions} series={carrierSeries} type="bar" height={300} />
        </div>
      </div>

      {/* Shipment Status Dialog */}
      <FilteredDataDialog
        visible={showStatusDialog}
        onHide={() => setShowStatusDialog(false)}
        header="Shipment Status Details"
        columns={commonColumns}
        fetchData={() => async (tableParams: any) => {
          const response = await axiosInstance.get("shipment-status/details-grid", {
            params: {
              ...tableParams,
              startDate: formatDateTime(startDate),
              endDate: formatDateTime(endDate),
              ...(enterpriseKey && { enterpriseKey }),
              ...(selectedCarrier && { carrier: selectedCarrier }),
              ...(selectedMethod && { shippingMethod: selectedMethod }),
              ...(statusFilter && { status: statusFilter }),

            },
          });
          return { data: response.data.data, count: response.data.count };
        }}
        mobileCardRender={shipmentDialogMobileCardRender}
      />


      {/* Carrier Dialog */}
      <FilteredDataDialog
        visible={showCarrierDialog}
        onHide={() => setShowCarrierDialog(false)}
        header="Carrier Shipment Details"
        columns={commonColumns}
        fetchData={(params?: any) => async (tableParams: any) => {
          const response = await axiosInstance.get("carrier-performance/carrier-details", {
            params: {
              ...params,
              ...tableParams,
              startDate: formatDateTime(startDate),
              endDate: formatDateTime(endDate),
              ...(enterpriseKey && { enterpriseKey }),
              ...(selectedCarrier && { carrier: selectedCarrier }),
              ...(selectedMethod && { shippingMethod: selectedMethod }),
              ...(carrierFilter && { carrier: carrierFilter }),
            },
          });
          return { data: response.data.data, count: response.data.count };
        }}
        mobileCardRender={shipmentDialogMobileCardRender}
      />
    </div>
  );
};

export default ShipmentCharts;
