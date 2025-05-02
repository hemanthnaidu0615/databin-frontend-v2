import React, { useEffect, useState } from "react";

interface OrderFiltersProps {
  filters: {
    status: string;
    orderType: string;
    paymentMethod: string;
    priceRange: string;
    carrier: string;
    customer: string;
    orderId: string;
  };
  onFilterChange: (field: string, value: string) => void;
  onReset: () => void;
  onApply: () => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  onApply,
}) => {
  const inputStyle =
    "px-3 py-2 rounded border text-sm bg-white text-black border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const [filterOptions, setFilterOptions] = useState<{
    types: string[];
    methods: string[];
    statuses: string[];
    carriers: string[];
  }>({
    types: [],
    methods: [],
    statuses: [],
    carriers: [],
  });

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/order-filters/filter-values"
        );
        const data = await res.json();
        setFilterOptions(data);
      } catch (error) {
        console.error("Failed to fetch filter options", error);
      }
    };

    fetchFilterOptions();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start text-sm text-white">
      {/* Status */}
      <select
        className={inputStyle}
        value={filters.status}
        onChange={(e) => onFilterChange("status", e.target.value)}
      >
        <option>All statuses</option>
        {filterOptions.statuses.map((status) => (
          <option key={status}>{status}</option>
        ))}
      </select>

      {/* Order Type */}
      <select
        className={inputStyle}
        value={filters.orderType}
        onChange={(e) => onFilterChange("orderType", e.target.value)}
      >
        <option>All types</option>
        {filterOptions.types.map((type) => (
          <option key={type}>{type}</option>
        ))}
      </select>

      {/* Payment Method */}
      <select
        className={inputStyle}
        value={filters.paymentMethod}
        onChange={(e) => onFilterChange("paymentMethod", e.target.value)}
      >
        <option>All methods</option>
        {filterOptions.methods.map((method) => (
          <option key={method}>{method}</option>
        ))}
      </select>

      {/* Price Range in USD */}
      <select
        className={inputStyle}
        value={filters.priceRange}
        onChange={(e) => onFilterChange("priceRange", e.target.value)}
      >
        <option>All prices</option>
        <option>Under $50</option>
        <option>$50 - $200</option>
        <option>$200 - $500</option>
        <option>Over $500</option>
      </select>

      {/* Carrier */}
      <select
        className={inputStyle}
        value={filters.carrier}
        onChange={(e) => onFilterChange("carrier", e.target.value)}
      >
        <option>All carriers</option>
        {filterOptions.carriers.map((carrier) => (
          <option key={carrier}>{carrier}</option>
        ))}
      </select>

      {/* Customer */}
      <input
        type="text"
        placeholder="Search customer"
        className={inputStyle}
        value={filters.customer}
        onChange={(e) => onFilterChange("customer", e.target.value)}
      />

      {/* Order ID */}
      <input
        type="text"
        placeholder="Search order ID"
        className={inputStyle}
        value={filters.orderId}
        onChange={(e) => onFilterChange("orderId", e.target.value)}
      />

      {/* Buttons */}
      <div className="col-span-full flex justify-end gap-2 mt-2">
        <button
          onClick={onReset}
          className="px-4 py-2 rounded bg-gray-700 text-sm text-white hover:bg-gray-600 transition"
        >
          Reset Filters
        </button>
        <button
          onClick={onApply}
          className="px-4 py-2 rounded bg-[#9614d0] text-sm text-white hover:bg-[#660094] transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default OrderFilters;
