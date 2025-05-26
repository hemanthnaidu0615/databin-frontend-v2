import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { axiosInstance } from "../../../axios";

type Props = {
  selectedCarrier: string | null;
  selectedMethod: string | null;
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

const convertToUSD = (rupees: number): number => {
  const exchangeRate = 0.012;
  return rupees * exchangeRate;
};

const formatValue = (value: number): string => {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
  return value.toFixed(0);
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
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);

  const isMobile = useIsMobile();

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange || [];

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) return;

      const formattedStart = new Date(startDate).toISOString();
      const formattedEnd = new Date(endDate).toISOString();

      try {
        const response = await axiosInstance.get(`recent-shipments`, {
          params: {
            startDate: formattedStart,
            endDate: formattedEnd,
            ...(enterpriseKey && { enterpriseKey }),
            ...(selectedCarrier && { carrier: selectedCarrier }),
            ...(selectedMethod && { shippingMethod: selectedMethod }),
          },
        });
        const data = response.data;

        if (Array.isArray(data)) {
          setShipments(data);
          setFilteredShipments(data);
        } else {
          setShipments([]);
          setFilteredShipments([]);
        }
      } catch (error) {
        console.error("Error fetching shipments:", error);
      }
    };

    fetchData();
  }, [startDate, endDate, enterpriseKey, selectedCarrier, selectedMethod]);

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
          <strong>Estimated Delivery:</strong>{" "}
          {formatDate(shipment.estimated_delivery)}
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

  const getPageOptions = () => {
    const total = filteredShipments.length;
    if (total <= 5) return [5];
    if (total <= 10) return [5, 10];
    if (total <= 20) return [5, 10, 15, 20];
    if (total <= 50) return [10, 20, 30, 50];
    return [10, 20, 50, 100];
  };

  // =========================
  // CUSTOM RENDER FUNCTIONS
  // =========================

  const TableHeader = (
    <div className="flex justify-between items-center gap-2 flex-wrap mb-4">
      <h2 className="app-subheading">Recent Shipments</h2>
      <span className="p-input-icon-left w-full md:w-auto">
        <InputText
          type="search"
          placeholder="Search Shipment ID"
          className="app-search-input w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </span>
    </div>
  );

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden rounded-xl border border-gray-200 bg-white px-6 pb-6 pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
      {TableHeader}

      <DataTable
        value={
          isMobile
            ? filteredShipments.slice(first, first + rows)
            : filteredShipments
        }
        paginator={!isMobile}
        first={first}
        rows={rows}
        onPage={(e) => {
          setFirst(e.first);
          setRows(e.rows);
        }}
        stripedRows
        className="p-datatable-sm w-full"
        responsiveLayout="scroll"
        paginatorTemplate="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
        rowsPerPageOptions={getPageOptions()}
        sortMode="multiple"
        scrollable
        scrollHeight="flex"
      >
        <Column
          field="shipment_id"
          header={<span className="app-table-heading">Shipment ID</span>}
          body={(rowData) => <span className="app-table-content">{rowData.shipment_id}</span>}
          sortable
        />
        <Column
          field="customer_name"
          header={<span className="app-table-heading">Customer</span>}
          body={(rowData) => <span className="app-table-content">{rowData.customer_name}</span>}
          sortable
        />
        <Column
          field="carrier"
          header={<span className="app-table-heading">Carrier</span>}
          body={(rowData) => <span className="app-table-content">{rowData.carrier}</span>}
          sortable
        />
        <Column
          field="actual_shipment_date"
          header={<span className="app-table-heading">Ship Date</span>}
          body={(rowData) => <span className="app-table-content">{formatDate(rowData.actual_shipment_date)}</span>}
          sortable
        />
        <Column
          field="shipment_status"
          header={<span className="app-table-heading">Status</span>}
          body={(rowData) => (
            <span className="app-table-content">
              <Tag
                value={rowData.shipment_status}
                severity={getStatusSeverity(rowData.shipment_status)}
              />
            </span>
          )}
          sortable
        />
        <Column
          header={<span className="app-table-heading">Action</span>}
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

      {/* Mobile-Only Custom Pagination */}
      {isMobile && (
        <div className="flex flex-col sm:hidden text-sm text-gray-700 dark:text-gray-100 mt-4">
          <div className="flex items-center justify-between gap-2 mb-2 w-full">
            <div className="flex items-center gap-2">
              <label htmlFor="mobileRows" className="whitespace-nowrap">
                Rows per page:
              </label>
              <select
                id="mobileRows"
                value={rows}
                onChange={(e) => {
                  setRows(Number(e.target.value));
                  setFirst(0);
                }}
                className="px-2 py-1 rounded dark:bg-gray-800 bg-gray-100 dark:text-white text-gray-800"
              >
                {getPageOptions().map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              Page {Math.floor(first / rows) + 1} of{" "}
              {Math.ceil(filteredShipments.length / rows)}
            </div>
          </div>

          <div className="flex justify-between gap-2 text-sm w-full px-2">
            <button
              onClick={() => setFirst(0)}
              disabled={first === 0}
              className="px-3 py-1.5 rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ⏮ First
            </button>
            <button
              onClick={() => setFirst(Math.max(0, first - rows))}
              disabled={first === 0}
              className="px-3 py-1.5 rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Prev
            </button>
            <button
              onClick={() =>
                setFirst(
                  first + rows < filteredShipments.length ? first + rows : first
                )
              }
              disabled={first + rows >= filteredShipments.length}
              className="px-3 py-1.5 rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
            <button
              onClick={() =>
                setFirst(
                  (Math.ceil(filteredShipments.length / rows) - 1) * rows
                )
              }
              disabled={first + rows >= filteredShipments.length}
              className="px-3 py-1.5 rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ⏭ Last
            </button>
          </div>
        </div>
      )}

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
