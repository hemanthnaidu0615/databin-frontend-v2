import React from "react";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { AutoComplete } from "primereact/autocomplete";

export default function OrderFilters() {
  const [dateRange, setDateRange] = React.useState<[Date | null, Date | null] | null>(null);
  const [orderStatus, setOrderStatus] = React.useState<string[]>([]);
  const [carrier, setCarrier] = React.useState<string | null>(null);
  const [originCountry, setOriginCountry] = React.useState<string | null>(null);
  const [originCity, setOriginCity] = React.useState<string | null>(null);
  const [productCategories, setProductCategories] = React.useState<string[]>([]);

  const orderStatusOptions = ["Pending", "Shipped", "Delayed", "Delivered", "Cancelled"];
  const carriers = ["FedEx", "UPS", "DHL"];
  const countries = ["USA", "Canada", "Germany"];
  const cities = ["New York", "Berlin", "Toronto"];
  const productCategoryOptions = ["Electronics", "Clothing", "Home Goods"];

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Range */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date Range</label>
          <Calendar
            value={dateRange}
            onChange={(e) => setDateRange(e.value as [Date, Date])}
            selectionMode="range"
            placeholder="Select date range"
            showIcon
            className="w-full"
          />
        </div>

        {/* Order Status */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 dark:text-gray-400 mb-1">Order Status</label>
          <MultiSelect
            value={orderStatus}
            options={orderStatusOptions}
            onChange={(e) => setOrderStatus(e.value)}
            placeholder="Select Status"
            className="w-full"
          />
        </div>

        {/* Carrier */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 dark:text-gray-400 mb-1">Carrier</label>
          <MultiSelect
            value={carrier ? [carrier] : []}
            options={carriers}
            onChange={(e) => setCarrier(e.value[0] || null)}
            placeholder="Select Carrier"
            className="w-full"
          />
        </div>

        {/* Origin Country */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 dark:text-gray-400 mb-1">Origin Country</label>
          <MultiSelect
            value={originCountry ? [originCountry] : []}
            options={countries}
            onChange={(e) => setOriginCountry(e.value[0] || null)}
            placeholder="Select Country"
            className="w-full"
          />
        </div>

        {/* Origin City */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 dark:text-gray-400 mb-1">Origin City</label>
          <AutoComplete
            value={originCity}
            suggestions={cities as any}
            completeMethod={() => {}}
            onChange={(e) => setOriginCity(e.value)}
            placeholder="Type city"
            className="w-full"
          />
        </div>

        {/* Product Category */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 dark:text-gray-400 mb-1">Product Category</label>
          <MultiSelect
            value={productCategories}
            options={productCategoryOptions}
            onChange={(e) => setProductCategories(e.value)}
            placeholder="Select Category"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
