import React, { useState, useEffect } from "react";
import OrderFilters from "./OrderFilters";
import OrderList1 from "./OrdersList1";
import { axiosInstance } from "../../../axios";
import * as XLSX from "xlsx";
import { useDateRangeEnterprise } from "../../utils/useGlobalFilters";
import ExportIcon from '../../../images/export.png';

const defaultFilterValues = {
  status: "All statuses",
  orderType: "All types",
  paymentMethod: "All methods",
  priceRange: "All prices",
  carrier: "All carriers",
  customer: "",
  orderId: "",
};

const OrdersPage: React.FC = () => {
  const [filters, setFilters] = useState(defaultFilterValues);
  const [tempFilters, setTempFilters] = useState(defaultFilterValues);

  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const exportOrders = async () => {
    try {
      const params = {
        startDate,
        endDate,
        status: filters.status !== "All statuses" ? filters.status : undefined,
        orderType: filters.orderType !== "All types" ? filters.orderType : undefined,
        paymentMethod: filters.paymentMethod !== "All methods" ? filters.paymentMethod : undefined,
        carrier: filters.carrier !== "All carriers" ? filters.carrier : undefined,
        searchCustomer: filters.customer || undefined,
        searchOrderId: filters.orderId || undefined,
        enterpriseKey: enterpriseKey && enterpriseKey !== "All" ? enterpriseKey : undefined,
        size: 1000
      };

      const response = await axiosInstance.get(`/orders/filtered`, { params });
      const data = response.data as { data?: any[] };
      const fetchedOrders = data.data || [];

      const renamedData = fetchedOrders.map((order: any) => ({
        "Order ID": order.order_id,
        "Order Date": order.order_date,
        "Customer Name": order.customer_name,
        "Product Name": order.product_name,
        "Total Amount": order.total,
        "Status": order.shipment_status,
        "Payment Method": order.payment_method,
      }));

      const worksheet = XLSX.utils.json_to_sheet(renamedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
      XLSX.writeFile(workbook, "orders_export.xlsx");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export orders.");
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setTempFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
  };

  const handleResetFilters = () => {
    setTempFilters(defaultFilterValues);
    setFilters(defaultFilterValues);
  };

  return (
    <div className="p-6 dark:bg-white/[0.03] dark:text-white/90">
      <div className="flex justify-between items-center mb-6">
        <h1 className="app-section-title">Orders</h1>
        <div className="flex gap-2">
          <button
          onClick={exportOrders}
          >
          <img src={ExportIcon} alt="Export" className="w-6" />

          </button>
        </div>
      </div>

      <OrderFilters
        filters={tempFilters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onApply={handleApplyFilters}
      />

      <div className="mt-6">
        <OrderList1
          fetchData={async (params) => {
            try {
              const apiParams = {
                ...params,
                startDate,
                endDate,
                status: filters.status !== "All statuses" ? filters.status : undefined,
                orderType: filters.orderType !== "All types" ? filters.orderType : undefined,
                paymentMethod: filters.paymentMethod !== "All methods" ? filters.paymentMethod : undefined,
                carrier: filters.carrier !== "All carriers" ? filters.carrier : undefined,
                searchCustomer: filters.customer || undefined,
                searchOrderId: filters.orderId || undefined,
                enterpriseKey: enterpriseKey && enterpriseKey !== "All" ? enterpriseKey : undefined
              };

              const response = await axiosInstance.get('/orders/filtered', {
                params: apiParams
              });

              const data = response.data as { data?: any[]; count?: number };
              return {
                data: data.data || [],
                count: data.count || 0
              };
            } catch (error) {
              console.error("Error fetching orders:", error);
              return {
                data: [],
                count: 0
              };
            }
          }}
        />
      </div>
    </div>
  );
};

export default OrdersPage;