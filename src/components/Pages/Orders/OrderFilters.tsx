import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../axios";

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
        const res = await axiosInstance.get<{
          types: string[];
          methods: string[];
          statuses: string[];
          carriers: string[];
        }>("/order-filters/filter-values");
        setFilterOptions(res.data);
      } catch (error) {
        console.error("Failed to fetch filter options", error);
      }
    };

    fetchFilterOptions();
  }, []);

  // Handle form submit (called on Enter or button click)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    onApply();
  };

  // Handle Enter key on selects to prevent dropdown reopen and trigger apply
  const handleSelectKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent dropdown toggle
      onApply(); // Trigger apply filters
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start text-sm text-white"
    >
      {/* Status */}
      <select
        className={inputStyle}
        value={filters.status}
        onChange={(e) => onFilterChange("status", e.target.value)}
        onKeyDown={handleSelectKeyDown}
      >
        <option value="">All statuses</option>
        {filterOptions.statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      {/* Order Type */}
      <select
        className={inputStyle}
        value={filters.orderType}
        onChange={(e) => onFilterChange("orderType", e.target.value)}
        onKeyDown={handleSelectKeyDown}
      >
        <option value="">All types</option>
        {filterOptions.types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {/* Payment Method */}
      <select
        className={inputStyle}
        value={filters.paymentMethod}
        onChange={(e) => onFilterChange("paymentMethod", e.target.value)}
        onKeyDown={handleSelectKeyDown}
      >
        <option value="">All methods</option>
        {filterOptions.methods.map((method) => (
          <option key={method} value={method}>
            {method}
          </option>
        ))}
      </select>

      {/* Price Range */}
      <select
        className={inputStyle}
        value={filters.priceRange}
        onChange={(e) => onFilterChange("priceRange", e.target.value)}
        onKeyDown={handleSelectKeyDown}
      >
        <option value="">All prices</option>
        <option value="Under $50">Under $50</option>
        <option value="$50 - $200">$50 - $200</option>
        <option value="$200 - $500">$200 - $500</option>
        <option value="Over $500">Over $500</option>
      </select>

      {/* Carrier */}
      <select
        className={inputStyle}
        value={filters.carrier}
        onChange={(e) => onFilterChange("carrier", e.target.value)}
        onKeyDown={handleSelectKeyDown}
      >
        <option value="">All carriers</option>
        {filterOptions.carriers.map((carrier) => (
          <option key={carrier} value={carrier}>
            {carrier}
          </option>
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
          type="button" // prevent form submit
          onClick={onReset}
          className="px-4 py-2 rounded bg-gray-700 text-sm text-white hover:bg-gray-600 transition"
        >
          Reset Filters
        </button>
        <button
          type="submit" // triggers onSubmit
          className="px-4 py-2 rounded  bg-[#a855f7] text-sm text-white hover:bg-[#9614d0] transition"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
};

export default OrderFilters;
