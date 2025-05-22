import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import OrderFilters from "./OrderFilters";
import OrderList from "./OrderList";
import { fetchOrders } from "./ordersData";
import { Order } from "./ordersData";

const defaultFilterValues = {
  status: "All statuses",
  orderType: "All types",
  paymentMethod: "All methods",
  priceRange: "All prices",
  carrier: "All carriers",
  customer: "",
  orderId: "",
};

function convertToUSD(rupees: number): number {
  return rupees * 0.012;
}

const priceRangeMatch = (
  orderTotal: number,
  selectedRange: string
): boolean => {
  const orderTotalUSD = convertToUSD(orderTotal);

  switch (selectedRange) {
    case "Under $50":
      return orderTotalUSD < 50;
    case "$50 - $200":
      return orderTotalUSD >= 50 && orderTotalUSD <= 200;
    case "$200 - $500":
      return orderTotalUSD > 200 && orderTotalUSD <= 500;
    case "Over $500":
      return orderTotalUSD > 500;
    case "All prices":
    default:
      return true;
  }
};

const OrdersPage: React.FC = () => {
  const [filters, setFilters] = useState(defaultFilterValues);
  const [tempFilters, setTempFilters] = useState(defaultFilterValues);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);


  useEffect(() => {
    loadOrders();
  }, [filters, startDate, endDate, enterpriseKey]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const fetchedOrders = await fetchOrders(
        startDate,
        endDate,
        filters.status !== "All statuses" ? filters.status : undefined,
        filters.orderType !== "All types" ? filters.orderType : undefined,
        filters.paymentMethod !== "All methods"
          ? filters.paymentMethod
          : undefined,
        filters.carrier !== "All carriers" ? filters.carrier : undefined,
        filters.customer !== "" ? filters.customer : undefined,
        filters.orderId !== "" ? filters.orderId : undefined,
        enterpriseKey && enterpriseKey !== "All" ? enterpriseKey : undefined
      );
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
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

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const match = (field: string, filterKey: string) => {
        const filterValue =
          filters[filterKey as keyof typeof filters].toLowerCase();
        if (filterValue === "" || filterValue.startsWith("all")) return true;

        const fieldValue = order[field as keyof typeof order];

        if (typeof fieldValue === "string") {
          return fieldValue.toLowerCase().includes(filterValue);
        }

        if (field === "status") {
          return order.products?.some((p) =>
            p.status.toLowerCase().includes(filterValue)
          );
        }

        if (field === "product") {
          return order.products?.some((p) =>
            p.name.toLowerCase().includes(filterValue)
          );
        }

        return false;
      };

      return (
        match("status", "status") &&
        match("paymentMethod", "paymentMethod") &&
        match("customer", "customer") &&
        match("id", "orderId") &&
        priceRangeMatch(order.total, filters.priceRange)
      );
    });
  }, [orders, filters]);

  if (loading) {
    return <div className="p-6 text-center">Loading Orders...</div>;
  }

  return (
    <div className="p-6 dark:bg-white/[0.03] dark:text-white/90">
      <div className="flex justify-between items-center mb-6">
        <h1 className="app-section-title">
          Orders
        </h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm border rounded-md dark:border-white/20 dark:hover:bg-white/10">
            Export
          </button>
          <button className="px-4 py-2 text-sm border rounded-md dark:border-white/20 dark:hover:bg-white/10">
            Print
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
        <OrderList orders={filteredOrders} />
      </div>
    </div>
  );
};

export default OrdersPage