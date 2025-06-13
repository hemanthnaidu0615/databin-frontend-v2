import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../axios";
import { CommonButton } from "../../modularity/buttons/Button";
import SelectFilter from "../../modularity/dropdowns/Dropdown";

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
      <SelectFilter
        label="All statuses"
        value={filters.status}
        options={filterOptions.statuses}
        onChange={(val) => onFilterChange("status", val)}
        onKeyDown={handleSelectKeyDown}
        className={inputStyle}
      />

      {/* Order Type */}
      <SelectFilter
        label="All types"
        value={filters.orderType}
        options={filterOptions.types}
        onChange={(val) => onFilterChange("orderType", val)}
        onKeyDown={handleSelectKeyDown}
        className={inputStyle}
      />

      {/* Payment Method */}
      <SelectFilter
        label="All methods"
        value={filters.paymentMethod}
        options={filterOptions.methods}
        onChange={(val) => onFilterChange("paymentMethod", val)}
        onKeyDown={handleSelectKeyDown}
        className={inputStyle}
      />

      {/* Price Range */}
      <SelectFilter
        label="All prices"
        value={filters.priceRange}
        options={["Under $50", "$50 - $200", "$200 - $500", "Over $500"]}
        onChange={(val) => onFilterChange("priceRange", val)}
        onKeyDown={handleSelectKeyDown}
        className={inputStyle}
      />
      {/* Carrier */}
      <SelectFilter
        label="All carriers"
        value={filters.carrier}
        options={filterOptions.carriers}
        onChange={(val) => onFilterChange("carrier", val)}
        onKeyDown={handleSelectKeyDown}
        className={inputStyle}
      />

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
        <CommonButton type="submit" text="Apply Filters" variant="secondary" />
      </div>
    </form>
  );
};

export default OrderFilters;
