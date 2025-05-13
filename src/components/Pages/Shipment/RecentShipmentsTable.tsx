import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

type Props = {
  selectedCarrier: string | null;
  selectedMethod: string | null;
};

const RecentShipmentsTable: React.FC<Props> = ({
  selectedCarrier,
  selectedMethod,
}) => {
  const [shipments, setShipments] = useState<any[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedShipment, setSelectedShipment] = useState<any | null>(null);
  const [visible, setVisible] = useState(false);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange || [];

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) return;

      const formattedStart = new Date(startDate).toISOString();
      const formattedEnd = new Date(endDate).toISOString();

      const params = new URLSearchParams({
        startDate: formattedStart,
        endDate: formattedEnd,
      });

      if (enterpriseKey) {
        params.append("enterpriseKey", enterpriseKey);
      }

      if (selectedCarrier) {
        params.append("carrier", selectedCarrier);
      }

      if (selectedMethod) {
        params.append("shippingMethod", selectedMethod);
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/recent-shipments?${params.toString()}`
        );
        const data = await response.json();
        console.log("Fetched Shipments:", data);
        setShipments(data);
        setFilteredShipments(data);
      } catch (error) {
        console.error("Error fetching shipments:", error);
      }
    };

    fetchData();
  }, [startDate, endDate, enterpriseKey, selectedCarrier, selectedMethod]);

  // Update filtered shipments based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredShipments(shipments);
    } else {
      const lowerSearchQuery = searchQuery.toLowerCase();
      const filtered = shipments.filter((shipment) =>
        shipment.shipment_id.toString().includes(lowerSearchQuery)
      );
      setFilteredShipments(filtered);
    }
  }, [searchQuery, shipments]);

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

  const showDetails = async (shipment: any) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/recent-shipments/details?shipmentId=${shipment.shipment_id}`
      );
      const detailedData = await response.json();
      setSelectedShipment(detailedData);
      setVisible(true);
    } catch (error) {
      console.error("Error fetching shipment details:", error);
      setSelectedShipment(null);
      setVisible(true); // still open dialog to show an error or fallback
    }
  };
  

  const formatDate = (isoDate: string) => {
    return isoDate?.split("T")[0] || "";
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
          <strong>Ship Date:</strong> {formatDate(shipment.ship_date)}
        </div>
        <div>
          <strong>Estimated Delivery:</strong> {formatDate(shipment.estimated_delivery)}
        </div>
        <div>
          <strong>Origin:</strong> {shipment.origin}
        </div>
        <div>
          <strong>Destination:</strong> {shipment.destination}
        </div>
        <div>
          <strong>Cost:</strong> ${shipment.cost?.toFixed(2)}
        </div>
      </div>
    );
  };
  

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden rounded-xl border border-gray-200 bg-white px-6 pb-6 pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex justify-between items-center gap-2 flex-wrap mb-4">
        <h2 className="text-sm md:text-lg font-semibold">Orders in Process</h2>
        <span className="p-input-icon-left w-full md:w-auto">
          <InputText
            type="search"
            placeholder="Search Shipment ID"
            className="p-inputtext-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </span>
      </div>

      <DataTable
        value={filteredShipments}
        paginator
        rows={5}
        stripedRows
        className="p-datatable-sm w-full"
        responsiveLayout="scroll"
        paginatorTemplate="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
        rowsPerPageOptions={[5, 10, 20, 50]}
        sortMode="multiple"
      >
        <Column field="shipment_id" header="Shipment ID" sortable />
        <Column field="customer_name" header="Customer" sortable />
        <Column field="carrier" header="Carrier" sortable />
        <Column
          field="actual_shipment_date"
          header="Ship Date"
          body={(rowData) => formatDate(rowData.actual_shipment_date)}
          sortable
        />
        <Column
          field="shipment_status"
          header="Status"
          body={(rowData) => (
            <Tag
              value={rowData.shipment_status}
              severity={getStatusSeverity(rowData.shipment_status)}
            />
          )}
          sortable
        />
        <Column
          header="Action"
          body={(rowData) => (
            <button
              onClick={() => showDetails(rowData)}
              className="text-purple-500 hover:underline text-sm font-medium"
            >
              View
            </button>
          )}
        />
      </DataTable>

      <Dialog
        header="Shipment Details"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "90vw", maxWidth: "600px" }}
        breakpoints={{ "960px": "95vw" }}
        className="p-dialog-sm dark:bg-white/[0.03]"
      >
        {selectedShipment ? shipmentDetails(selectedShipment) : <p>No data</p>}
        <div className="mt-4 text-right">
          <Button
            label="Close"
            icon="pi pi-times"
            onClick={() => setVisible(false)}
            className="p-button-text text-purple-500"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default RecentShipmentsTable;