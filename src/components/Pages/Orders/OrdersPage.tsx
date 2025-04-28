import React, { useState, useMemo } from "react";
import OrderFilters from "./OrderFilters";
import OrderList from "./OrderList";
import { orders as allOrders } from "./ordersData";

// Default values for all filter fields
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

  // Handle changes in temporary filter state before applying
  const handleFilterChange = (field: string, value: string) => {
    setTempFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Apply the current temporary filters
  const handleApplyFilters = () => {
    setFilters(tempFilters);
  };

  // Reset both applied and temporary filters
  const handleResetFilters = () => {
    setTempFilters(defaultFilterValues);
    setFilters(defaultFilterValues);
  };

  // Filter logic based on applied filters
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      const match = (field: string, filterKey: string) => {
        const filterValue =
          filters[filterKey as keyof typeof filters].toLowerCase();
        if (filterValue === "" || filterValue.startsWith("all")) return true;

        const fieldValue = order[field as keyof typeof order];

        // Direct string field match
        if (typeof fieldValue === "string") {
          return fieldValue.toLowerCase().includes(filterValue);
        }

        // Special handling for nested product statuses
        if (field === "status") {
          return order.products?.some((p) =>
            p.status.toLowerCase().includes(filterValue)
          );
        }

        // Special handling for product name
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
  }, [filters]);

  return (
    <div className="p-6 dark:bg-white/[0.03] dark:text-white/90">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Orders
        </h1>

        {/* Actions: Export / Print */}
        <div className="flex flex-nowrap gap-1.5 overflow-x-auto no-scrollbar sm:flex-wrap sm:gap-2 sm:overflow-visible">
          <button className="px-2 py-1 text-[11px] border rounded-md transition whitespace-nowrap sm:px-4 sm:py-2 sm:text-sm text-black  order-black/20 hover:bg-black/10 dark:text-white dark:border-white/20 dark:hover:bg-white/10">
            Export
          </button>
          <button className="px-2 py-1 text-[11px] border rounded-md transition whitespace-nowrap sm:px-4 sm:py-2 sm:text-sm text-black border-black/20 hover:bg-black/10 dark:text-white dark:border-white/20 dark:hover:bg-white/10">
            Print
          </button>
        </div>
      </div>

      {/* Filters section */}
      <OrderFilters
        filters={tempFilters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onApply={handleApplyFilters}
      />

      {/* Order List */}
      <div className="mt-6">
        <OrderList orders={filteredOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
