import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../axios";
import { PrimeSelectFilter } from "../../modularity/dropdowns/Dropdown";
import CommonButton from "../../modularity/buttons/Button";

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
    "px-3 py-2 rounded border text-sm bg-white text-black border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 h-11";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start text-sm text-white"
    >
      {/* Status */}
      <PrimeSelectFilter<string>
        placeholder="All statuses"
        value={filters.status}
        options={filterOptions.statuses.map((s) => ({ label: s, value: s }))}
        onChange={(val) => onFilterChange("status", val)}
        className="text-sm px-2 py-0 rounded-md bg-white text-black border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-white/30 h-11"
      />

      <PrimeSelectFilter<string>
        placeholder="All types"
        value={filters.orderType}
        options={filterOptions.types.map((t) => ({ label: t, value: t }))}
        onChange={(val) => onFilterChange("orderType", val)}
        className="text-sm px-2 py-0 rounded-md bg-white text-black border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-white/30 h-11"
      />

      <PrimeSelectFilter<string>
        placeholder="All methods"
        value={filters.paymentMethod}
        options={filterOptions.methods.map((m) => ({ label: m, value: m }))}
        onChange={(val) => onFilterChange("paymentMethod", val)}
        className="text-sm px-2 py-0 rounded-md bg-white text-black border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-white/30 h-11"
      />

      <PrimeSelectFilter<string>
        placeholder="All prices"
        value={filters.priceRange}
        options={[
          "Under $50",
          "$50 - $200",
          "$200 - $500",
          "Over $500",
        ].map((p) => ({ label: p, value: p }))}
        onChange={(val) => onFilterChange("priceRange", val)}
       className="text-sm px-2 py-0 rounded-md bg-white text-black border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-white/30 h-11"
        
      />

      <PrimeSelectFilter<string>
        placeholder="All carriers"
        value={filters.carrier}
        options={filterOptions.carriers.map((c) => ({ label: c, value: c }))}
        onChange={(val) => onFilterChange("carrier", val)}
        className="text-sm px-2 py-0 rounded-md bg-white text-black border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-white/30 h-11"
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
