import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import OrderFilters from "./OrderFilters";
import OrderList from "./OrderList";
import { fetchOrders } from './ordersData';
import { Order } from './ordersData';  // Import the Order type for TypeScript safety

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Access the date range from Redux store
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    loadOrders();
  }, [filters, startDate, endDate]);  // Reload when filters or date range change

  const loadOrders = async () => {
    try {
      setLoading(true);
      const fetchedOrders = await fetchOrders(
        startDate,
        endDate,
        filters.status !== "All statuses" ? filters.status : undefined,
        filters.orderType !== "All types" ? filters.orderType : undefined,
        filters.paymentMethod !== "All methods" ? filters.paymentMethod : undefined,
        filters.carrier !== "All carriers" ? filters.carrier : undefined,
        filters.customer !== "" ? filters.customer : undefined,
        filters.orderId !== "" ? filters.orderId : undefined
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
        const filterValue = filters[filterKey as keyof typeof filters].toLowerCase();
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
        match("id", "orderId")
      );
    });
  }, [orders, filters]);

  if (loading) {
    return <div className="p-6 text-center">Loading Orders...</div>;
  }

  return (
    <div className="p-6 dark:bg-white/[0.03] dark:text-white/90">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Orders</h1>
        <div className="flex flex-nowrap gap-1.5 overflow-x-auto no-scrollbar sm:flex-wrap sm:gap-2 sm:overflow-visible">
          <button className="px-2 py-1 text-[11px] border rounded-md transition whitespace-nowrap sm:px-4 sm:py-2 sm:text-sm text-black border-black/20 hover:bg-black/10 dark:text-white dark:border-white/20 dark:hover:bg-white/10">
            Export
          </button>
          <button className="px-2 py-1 text-[11px] border rounded-md transition whitespace-nowrap sm:px-4 sm:py-2 sm:text-sm text-black border-black/20 hover:bg-black/10 dark:text-white dark:border-white/20 dark:hover:bg-white/10">
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

export default OrdersPage;
