import React, { useState, useEffect } from "react";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { axiosInstance } from "../../../axios";
import { formatDateTime, formatValue } from "../../utils/kpiUtils";
import { useDateRangeEnterprise } from "../../utils/useGlobalFilters";
import { TableView, usePagination, TableColumn } from "../../modularity/tables/Table";
import { motion } from "framer-motion";

type Props = {
  selectedCarrier: string | null;
  selectedMethod: string | null;
};

const convertToUSD = (rupees: number): number => {
  const exchangeRate = 0.012;
  return rupees * exchangeRate;
};

const RecentShipmentsTable: React.FC<Props> = ({
  selectedCarrier,
  selectedMethod,
}) => {
  const { page, rows, onPageChange } = usePagination();
  const [shipments, setShipments] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedShipment, setSelectedShipment] = useState<any | null>(null);
  const [visible, setVisible] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange || [];

  const getStatusSeverity = (status: string) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "In Transit":
        return "info";
      case "Delayed":
        return "danger";
      default:
        return null;
    }
  };

  const statusColors = {
    "Delivered": "bg-green-600",
    "In Transit": "bg-blue-500",
    "Delayed": "bg-red-500",
    "Unknown": "bg-gray-400",
  };

  const columns: TableColumn[] = [
    { 
      field: "shipment_id", 
      header: "Shipment ID", 
      mobilePriority: true 
    },
    { 
      field: "customer_name", 
      header: "Customer", 
      mobilePriority: true 
    },
    { 
      field: "carrier", 
      header: "Carrier" 
    },
    { 
      field: "actual_shipment_date", 
      header: "Ship Date",
      customBody: (rowData: any) => formatDateTime(rowData.actual_shipment_date)
    },
    { 
      field: "shipment_status", 
      header: "Status",
      customBody: (rowData) => (
        <Tag
          value={rowData.shipment_status}
          severity={getStatusSeverity(rowData.shipment_status)}
        />
      )
    },
    {
      field: "action",
      header: "Action",
      customBody: (rowData) => (
        <button
          onClick={() => showDetails(rowData)}
          className="text-purple-500 hover:underline text-sm font-medium"
        >
          View
        </button>
      )
    },
  ];

  const config = {
    columns,
    statusColors,
    mobileCardFields: ["shipment_id", "customer_name", "carrier", "shipment_status"],
  };

  const fetchShipments = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);

    try {
      const formattedStart = formatDateTime(startDate);
      const formattedEnd = formatDateTime(endDate);

      const params: any = {
        startDate: formattedStart,
        endDate: formattedEnd,
        page: Math.floor(page / rows),
        size: rows,
      };
      if (enterpriseKey) params.enterpriseKey = enterpriseKey;
      if (selectedCarrier) params.carrier = selectedCarrier;
      if (selectedMethod) params.shippingMethod = selectedMethod;

      const response = await axiosInstance.get(`recent-shipments`, { params });
      const data = response.data as { data?: any[]; count?: number };

      if (data && Array.isArray(data.data)) {
        setShipments(data.data);
        setTotalRecords(data.count || 0);
      } else {
        setShipments([]);
        setTotalRecords(0);
      }
    } catch (err) {
      console.error("Error fetching shipments:", err);
      setError("Failed to load shipments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [startDate, endDate, enterpriseKey, selectedCarrier, selectedMethod, page, rows]);

  const showDetails = async (shipment: any) => {
    try {
      const response = await axiosInstance.get("recent-shipments/details", {
        params: { shipmentId: shipment.shipment_id },
      });
      const detailedData = response.data as any;

      if (detailedData.cost) {
        detailedData.cost = convertToUSD(detailedData.cost);
      }
      setSelectedShipment(detailedData);
      setVisible(true);
    } catch (error) {
      console.error("Error fetching shipment details:", error);
      setSelectedShipment(null);
      setVisible(true);
    }
  };

  const shipmentDetails = (shipment: any) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800 dark:text-gray-200">
        <div>
          <strong>Order ID:</strong> {shipment.order_id}
        </div>
        <div>
          <strong>Customer:</strong> {shipment.customer}
        </div>
        <div>
          <strong>Carrier:</strong> {shipment.carrier}
        </div>
        <div>
          <strong>Shipping Method:</strong> {shipment.shipping_method}
        </div>
        <div>
          <strong>Status:</strong>{" "}
          <Tag
            value={shipment.status}
            severity={getStatusSeverity(shipment.status)}
          />
        </div>
        <div>
          <strong>Ship Date:</strong> {formatDateTime(shipment.ship_date)}
        </div>
        <div>
          <strong>Estimated Delivery:</strong>{" "}
          {formatDateTime(shipment.estimated_delivery)}
        </div>
        <div>
          <strong>Origin:</strong> {shipment.origin}
        </div>
        <div>
          <strong>Destination:</strong> {shipment.destination}
        </div>
        <div>
          <strong>Cost:</strong> $
          {shipment.cost ? formatValue(shipment.cost) : "0"}
        </div>
      </div>
    );
  };

  const filteredShipments = shipments.filter(
    (shipment) =>
      globalFilter === "" ||
      shipment.shipment_id.toString().includes(globalFilter.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden rounded-xl border border-gray-200 bg-white px-6 pb-6 pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <TableView
        data={filteredShipments}
        config={config}
        pagination={{
          page,
          rows,
          totalRecords,
          onPageChange,
        }}
        loading={loading}
        error={error}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        searchPlaceholder="Search Shipment ID"
        title="Recent Shipments"
      />

      <Dialog
        header="Shipment Details"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "90vw", maxWidth: "600px" }}
        breakpoints={{ "960px": "95vw" }}
        className="p-dialog-sm dark:bg-white/[0.03]"
        draggable={false}
        dismissableMask={true}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {selectedShipment ? shipmentDetails(selectedShipment) : <p>No data</p>}
        </motion.div>
      </Dialog>
    </div>
  );
};

export default RecentShipmentsTable;