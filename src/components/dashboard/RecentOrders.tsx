import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../axios";
import CommonButton from "../modularity/buttons/Button";
import Badge from "../ui/badge/Badge";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
};

const convertToUSD = (rupees: number) => rupees * 0.012;
const formatUSD = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convertToUSD(amount));

export default function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({
    global: { value: null, matchMode: "contains" },
    product_name: { value: null, matchMode: "contains" },
    category_name: { value: null, matchMode: "contains" },
    shipment_status: { value: null, matchMode: "contains" },
    order_type: { value: null, matchMode: "contains" },
  });
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortField, setSortField] = useState("order_id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const navigate = useNavigate();

  useEffect(() => {
    const scrollY = sessionStorage.getItem("scrollPosition");
    if (scrollY) {
      window.scrollTo({ top: parseInt(scrollY), behavior: "auto" });
      sessionStorage.removeItem("scrollPosition");
    }
  }, []);

  useEffect(() => {
    if (!dateRange?.[0] || !dateRange?.[1]) return;

    const fetchData = async () => {
      const [start, end] = [formatDate(dateRange[0]), formatDate(dateRange[1])];
      const params = new URLSearchParams({
        startDate: start,
        endDate: end,
        page: "0",
        size: "5",
        sortField,
        sortOrder,
      });

      if (enterpriseKey && enterpriseKey !== "All") {
        params.append("enterpriseKey", enterpriseKey);
      }

      for (const key in filters) {
        if (key !== "global" && filters[key]?.value) {
          params.append(`${key}.value`, filters[key].value);
          params.append(`${key}.matchMode`, filters[key].matchMode);
        }
      }

      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/orders/recent-orders?${params.toString()}`
        );
        setOrders(response.data.data || []);
      } catch (e) {
        console.error("Failed to load recent orders", e);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };


    fetchData();
  }, [
    JSON.stringify(filters),
    page,
    rows,
    sortField,
    sortOrder,
    dateRange?.[0],
    dateRange?.[1],
    enterpriseKey,
  ]);

  const renderFilterInput = (field: string) => {
    return (options: any) => (
      <InputText
        value={options.value || ""}
        onChange={(e) => options.filterCallback(e.target.value)}
        placeholder="Search"
        className="p-column-filter"
      />
    );
  };

  const handleViewMore = () => {
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    navigate("/orders");
  };

  const shipmentStatusBody = (rowData: any) => (
    <Badge
      color={
        rowData.shipment_status === "Delivered"
          ? "success"
          : rowData.shipment_status === "Pending"
            ? "warning"
            : "error"
      }
    >
      {rowData.shipment_status}
    </Badge>
  );

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden rounded-xl border border-gray-200 bg-white px-3 pb-3 pt-3 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex justify-between items-start sm:items-center flex-wrap sm:flex-nowrap gap-2 mb-1">
        <div className="flex items-start justify-between w-full sm:w-auto">
          <h2 className="app-subheading flex-1 mr-2">Recent Orders</h2>
          <CommonButton
            variant="responsive"
            onClick={handleViewMore}
            showDesktop={false}
          />
        </div>
        <CommonButton
          variant="responsive"
          onClick={handleViewMore}
          showMobile={false}
          text="View more"
        />
      </div>

      {loading ? (
        <div className="w-full flex justify-center items-center py-8">
          <ProgressSpinner />
        </div>
      ) : (
        <div className="overflow-hidden">
          <DataTable
            value={orders}
            // paginator
            rows={rows}
            first={page * rows}
            totalRecords={totalRecords}
            onPage={(e) => {
              setPage(e.page ?? 0);
              setRows(e.rows ?? 10);
            }}
            onSort={(e) => {
              setSortField(e.sortField || "order_id");
              setSortOrder(e.sortOrder === 1 ? "asc" : "desc");
            }}
            onFilter={(e) => setFilters(e.filters)}
            filters={filters}
            globalFilterFields={["product_name", "category_name", "shipment_status", "order_type"]}
            sortField={sortField}
            sortOrder={sortOrder === "asc" ? 1 : -1}
            lazy
            responsiveLayout="scroll"
            emptyMessage="No recent orders found."
            className="w-full table-fixed text-xs text-gray-800 dark:text-white/90"
          >
            <Column
              field="product_name"
              header="Product"
              sortable
              filter
              filterElement={renderFilterInput("product_name")}
              headerClassName="py-0.5 px-2 text-left font-medium text-gray-500 dark:text-gray-400 text-xs"
              bodyClassName="py-0 px-2 text-xs leading-tight text-gray-800 dark:text-white/90 break-words hover:bg-gray-50 dark:hover:bg-white/[0.05]"
              style={{ width: "30%", minWidth: "120px" }}
            />

            <Column
              field="category_name"
              header="Category"
              sortable
              filter
              filterElement={renderFilterInput("category_name")}
              headerClassName="py-0.5 px-2 text-left font-medium text-gray-500 dark:text-gray-400 text-xs sm:table-cell hidden"
              bodyClassName="py-0 px-2 text-xs leading-tight text-gray-500 dark:text-gray-400 sm:table-cell hidden hover:bg-gray-50 dark:hover:bg-white/[0.05]"
              style={{ width: "20%", minWidth: "100px" }}
            />

            <Column
              field="unit_price"
              header="Price"
              sortable
              body={(row) => formatUSD(row.unit_price)}
              headerClassName="py-0.5 px-2 text-center font-medium text-gray-500 dark:text-gray-400 text-xs"
              bodyClassName="py-0 px-2 text-xs leading-tight text-gray-500 dark:text-gray-400 text-center whitespace-nowrap hover:bg-gray-50 dark:hover:bg-white/[0.05]"
              style={{ width: "15%", minWidth: "90px" }}
            />

            <Column
              field="shipment_status"
              header="Shipment Status"
              body={shipmentStatusBody}
              sortable
              filter
              filterElement={renderFilterInput("shipment_status")}
              headerClassName="py-0.5 px-2 text-center font-medium text-gray-500 dark:text-gray-400 text-xs"
              bodyClassName="py-0 px-2 text-center text-xs leading-tight hover:bg-gray-50 dark:hover:bg-white/[0.05]"
              style={{ width: "20%", minWidth: "100px" }}
            />

            <Column
              field="order_type"
              header="Order Type"
              sortable
              filter
              filterElement={renderFilterInput("order_type")}
              headerClassName="py-0.5 px-2 text-center font-medium text-gray-500 dark:text-gray-400 text-xs lg:table-cell hidden"
              bodyClassName="py-0 px-2 text-xs leading-tight text-gray-500 dark:text-gray-400 text-center lg:table-cell hidden hover:bg-gray-50 dark:hover:bg-white/[0.05]"
              style={{ minWidth: "110px" }}
            />
          </DataTable>
        </div>




      )}
    </div>
  );
}