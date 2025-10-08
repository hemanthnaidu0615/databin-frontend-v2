"use client";

import React, { useState } from "react";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { BaseDataTable, TableColumn } from "../../modularity/tables/BaseDataTable";
import { axiosInstance } from "../../../axios";
import { formatDateTime, formatDateMDY } from "../../utils/kpiUtils";
import { useDateRangeEnterprise } from "../../utils/useGlobalFilters";
import * as XLSX from "xlsx";

interface Shipment {
  shipment_id: string;
  customer_name: string;
  carrier: string;
  actual_shipment_date: string;
  shipment_status: string;
}

const RecentShipmentsTable: React.FC = () => {
  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange || [];
const exportToXLSX = (data: any[]) => {
  const renamedData = data.map(item => ({
    "Shipment ID": item.shipment_id,
    "Customer": item.customer_name,
    "Carrier": item.carrier,
    "Ship Date": formatDateMDY(item.actual_shipment_date),
    "Status": item.shipment_status,
  }));
  const worksheet = XLSX.utils.json_to_sheet(renamedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Recent Shipments");
  XLSX.writeFile(workbook, "recent_shipments_export.xlsx");
};

const exportData = async () => {
  try {
    if (!startDate || !endDate) {
      alert('Date range not available. Please select a date range.');
      return;
    }

    const queryParams = {
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      enterpriseKey: enterpriseKey?.trim() || undefined,
      size: '100000',
    };

    const response = await axiosInstance.get<{ data: Shipment[]; count: number }>("/recent-shipments", { params: queryParams });
    const dataToExport = response.data.data || [];
    exportToXLSX(dataToExport);
  } catch (err) {
    console.error("Export failed:", err);
    alert("Failed to export data.");
  }
};
  const [visible, setVisible] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);

  const convertToUSD = (rupees: number): number => rupees * 0.012;
  const formatValue = (value: number): string => {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
    if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
    return value.toFixed(0);
  };

  const fetchData = async (params: any) => {
    if (!startDate || !endDate) return { data: [], count: 0 };

    const queryParams = {
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      enterpriseKey: enterpriseKey?.trim() || undefined,
      ...params,
    };

    const response = await axiosInstance.get<{ data: Shipment[]; count: number }>("/recent-shipments", { params: queryParams });
    const { data: shipmentData, count } = response.data;

    return {
      data: shipmentData || [],
      count: count || 0,
    };
  };

  const getStatusSeverity = (status: string) => {
    switch (status) {
      case "Delivered": return "success";
      case "In Transit": return "info";
      case "Delayed": return "danger";
      default: return null;
    }
  };

  interface ShipmentDetails {
    order_id: string;
    customer: string;
    carrier: string;
    shipping_method: string;
    status: string;
    ship_date: string;
    estimated_delivery: string;
    origin: string;
    destination: string;
    cost?: number;
    [key: string]: any; // For any additional properties
  }

  const showDetails = async (shipment: Shipment) => {
    try {
      const response = await axiosInstance.get("/recent-shipments/details", {
        params: { shipmentId: shipment.shipment_id },
      });

      const detailed = response.data as ShipmentDetails;
      if (detailed?.cost) {
        detailed.cost = convertToUSD(detailed.cost);
      }

      setSelectedShipment(detailed);
    } catch (err) {
      console.error("Error loading details:", err);
      setSelectedShipment(null);
    } finally {
      setVisible(true);
    }
  };

  const renderMobileCard = (item: Shipment, index: number) => (
    <div key={index} className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-900">
      <div className="text-sm mb-1"><strong>Shipment ID:</strong> {item.shipment_id}</div>
      <div className="text-sm mb-1"><strong>Customer:</strong> {item.customer_name}</div>
      <div className="text-sm mb-1"><strong>Carrier:</strong> {item.carrier}</div>
      <div className="text-sm mb-1"><strong>Ship Date:</strong> {formatDateMDY(item.actual_shipment_date)}</div>
      <div className="text-sm mb-2 flex items-center gap-2">
        <strong>Status:</strong>
        <Tag value={item.shipment_status} severity={getStatusSeverity(item.shipment_status)} />
      </div>
      <button
        className="text-purple-600 dark:text-purple-400 text-sm font-medium underline"
        onClick={() => showDetails(item)}
      >
        View Details
      </button>
    </div>
  );

  const columns: TableColumn<Shipment>[] = [
    { field: "shipment_id", header: "Shipment ID", sortable: true, filter: true },
    { field: "customer_name", header: "Customer", sortable: true, filter: true },
    { field: "carrier", header: "Carrier", sortable: true, filter: true },
    {
      field: "actual_shipment_date",
      header: "Ship Date",
      sortable: true,
      body: (rowData: Shipment) => formatDateMDY(rowData.actual_shipment_date)
    },
    {
      field: "shipment_status",
      header: "Status",
      sortable: true,
      body: (rowData: Shipment) => (
        <Tag value={rowData.shipment_status} severity={getStatusSeverity(rowData.shipment_status)} />
      )
    },
    {
      header: "Action",
      field: "shipment_id",
      body: (rowData: Shipment) => (
        <button
          className="text-purple-500 hover:underline text-sm"
          onClick={() => showDetails(rowData)}
        >
          View
        </button>
      )
    }
  ];

return (
  <>
    <div className="flex justify-between items-center mb-4">
      <h2 className="app-subheading">Recent Shipments</h2>
      <button
        className="px-4 py-2 text-sm border rounded-md dark:border-white/20 dark:hover:bg-white/10 dark:text-white/90"
        onClick={exportData}
      >
        Export
      </button>
    </div>
    <BaseDataTable<Shipment>
      columns={columns}
      fetchData={fetchData}
      mobileCardRender={renderMobileCard}
      globalFilterFields={["shipment_id", "customer_name", "carrier", "actual_shipment_date", "shipment_status"]}
      field={"shipment_id"}
      header={""}
    />
    
    {/* Details Dialog */}
    <Dialog
      header="Shipment Details"
      visible={visible}
      onHide={() => setVisible(false)}
      style={{ width: "90vw", maxWidth: "600px" }}
      dismissableMask
      draggable={false}
    >
      {selectedShipment ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800 dark:text-gray-200">
          <div><strong>Order ID:</strong> {selectedShipment.order_id}</div>
          <div><strong>Customer:</strong> {selectedShipment.customer}</div>
          <div><strong>Carrier:</strong> {selectedShipment.carrier}</div>
          <div><strong>Shipping Method:</strong> {selectedShipment.shipping_method}</div>
          <div>
            <strong>Status:</strong>{" "}
            <Tag value={selectedShipment.status} severity={getStatusSeverity(selectedShipment.status)} />
          </div>
          <div><strong>Ship Date:</strong> {formatDateMDY(selectedShipment.ship_date)}</div>
          <div><strong>Estimated Delivery:</strong> {formatDateMDY(selectedShipment.estimated_delivery)}</div>
          <div><strong>Origin:</strong> {selectedShipment.origin}</div>
          <div><strong>Destination:</strong> {selectedShipment.destination}</div>
          <div><strong>Cost:</strong> ${selectedShipment.cost ? formatValue(selectedShipment.cost) : "0"}</div>
        </div>
      ) : (
        <p>No data found</p>
      )}
    </Dialog>
  </>
);
};

export default RecentShipmentsTable;
