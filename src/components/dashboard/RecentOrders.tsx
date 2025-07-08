import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../axios";
import CommonButton from "../modularity/buttons/Button";
import Badge from "../ui/badge/Badge";
import { TableColumn, BaseDataTable } from "../modularity/tables/BaseDataTable";
import FilteredDataDialog from "../modularity/tables/FilteredDataDialog";
import { FaTable } from "react-icons/fa";

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

// Columns definition
const columns: TableColumn<any>[] = [
  {
  field: "order_id",
  header: "Order ID",
  sortable: true,
  filter: true,
  filterPlaceholder: "Search order ID",
  className: "py-0 px-2 text-xs leading-tight hover:bg-gray-50 dark:hover:bg-white/[0.05]"
},
  {
    field: "product_name",
    header: "Product",
    sortable: true,
    filter: true,
    filterPlaceholder: "Search product",
    className:
      "py-0 px-2 text-xs leading-tight text-gray-800 dark:text-white/90 break-words hover:bg-gray-50 dark:hover:bg-white/[0.05]",
  },
  {
    field: "category_name",
    header: "Category",
    sortable: true,
    filter: true,
    filterPlaceholder: "Search category",
    className:
      "py-0 px-2 text-xs leading-tight text-gray-500 dark:text-gray-400 sm:table-cell hidden hover:bg-gray-50 dark:hover:bg-white/[0.05]",
  },
  {
    field: "unit_price",
    header: "Price",
    sortable: true,
    body: (row) => formatUSD(row.unit_price),
    className:
      "py-0 px-2 text-xs leading-tight text-gray-500 dark:text-gray-400 text-center whitespace-nowrap hover:bg-gray-50 dark:hover:bg-white/[0.05]",
  },
  {
    field: "shipment_status",
    header: "Shipment Status",
    sortable: true,
    filter: true,
    filterPlaceholder: "Search shipment status",
    body: (row) => {
      let color: "error" | "success" | "warning" = "error";
      if (row.shipment_status === "Delivered") color = "success";
      else if (row.shipment_status === "Pending") color = "warning";
      return <Badge color={color}>{row.shipment_status}</Badge>;
    },
    className:
      "py-0 px-2 text-center text-xs leading-tight hover:bg-gray-50 dark:hover:bg-white/[0.05]",
  },
  {
    field: "order_type",
    header: "Order Type",
    sortable: true,
    filter: true,
    filterPlaceholder: "Search order type",
    className:
      "py-0 px-2 text-xs leading-tight text-gray-500 dark:text-gray-400 text-center lg:table-cell hidden hover:bg-gray-50 dark:hover:bg-white/[0.05]",
  },
];

export default function RecentOrders() {
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const navigate = useNavigate();

  const [showGridDialog, setShowGridDialog] = useState(false);

  // Fetch function for BaseDataTable and dialog
  const fetchRecentOrders = async (params: any) => {
    if (!dateRange?.[0] || !dateRange?.[1]) return { data: [], count: 0 };

    const [start, end] = [formatDate(dateRange[0]), formatDate(dateRange[1])];

    const searchParams = new URLSearchParams({
      startDate: start,
      endDate: end,
      page: params.page?.toString() || "0",
      size: params.size?.toString() || "10",
      sortField: params.sortField || "order_id",
      sortOrder: params.sortOrder || "desc",
    });

    if (enterpriseKey && enterpriseKey !== "All") {
      searchParams.append("enterpriseKey", enterpriseKey);
    }
    

    // Append filters (except pagination and sorting keys)
    for (const key in params) {
      if (
        key !== "page" &&
        key !== "size" &&
        key !== "sortField" &&
        key !== "sortOrder" &&
        params[key]
      ) {
        searchParams.append(`${key}.value`, params[key]);
        searchParams.append(`${key}.matchMode`, "contains");
      }
    }

    try {
      const response = await axiosInstance.get(
        `/orders/recent-orders?${searchParams.toString()}`
      );
      return {
        data: response.data.data || [],
        count: response.data.count || 0,
      };
    } catch (error) {
      console.error("Failed to load recent orders", error);
      return { data: [], count: 0 };
    }
    
  };

  const handleViewMore = () => {
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    navigate("/orders");
  };

  // mobile card render function for dialog view
  const mobileCardRender = (row: any) => (
  <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-md shadow-sm">
    <div className="text-sm font-semibold text-gray-800 dark:text-white mb-1">
      {row.product_name}
    </div>
    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
      <div>
        <span className="font-medium text-gray-600 dark:text-gray-300">Category:</span> {row.category_name}
      </div>
      <div>
        <span className="font-medium text-gray-600 dark:text-gray-300">Price:</span> {formatUSD(row.unit_price)}
      </div>
      <div>
        <span className="font-medium text-gray-600 dark:text-gray-300">Order Type:</span> {row.order_type}
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-600 dark:text-gray-300">Status:</span>
        <Badge
          color={
            row.shipment_status === "Delivered"
              ? "success"
              : row.shipment_status === "Pending"
              ? "warning"
              : "error"
          }
        >
          {row.shipment_status}
        </Badge>
      </div>
    </div>
  </div>
);


  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden rounded-xl border border-gray-200 bg-white px-3 pb-3 pt-3 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="app-subheading flex justify-between items-center">
        <h2>Recent Orders</h2>
        <div className="flex gap-2 items-center">
          <CommonButton
            variant="responsive"
            onClick={handleViewMore}
            text="View more"
            showMobile={true}
            showDesktop={true}
          />
          <button
            onClick={() => setShowGridDialog(true)}
            title="View full table"
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-600"
            style={{ fontSize: "18px", padding: "4px 6px" }}
            aria-label="Open full orders table"
          >
            <FaTable />
          </button>
        </div>
      </div>


      {/* Main compact table */}
      <BaseDataTable
        columns={columns}
        fetchData={fetchRecentOrders}
        initialSortField="order_id"
        initialSortOrder={-1} // descending
        initialRows={5}
        globalFilterFields={columns.map((c) => String(c.field))}
        emptyMessage="No recent orders found."
        title={undefined}
        field={""}
        header={""}
        mobileCardRender={mobileCardRender}
      />

      {/* Dialog with full data table */}
      <FilteredDataDialog
        visible={showGridDialog}
        onHide={() => setShowGridDialog(false)}
        header="Recent Orders"
        columns={columns}
        fetchData={() => fetchRecentOrders}
        mobileCardRender={mobileCardRender}
        width="90vw"
      />
    </div>
  );
}
