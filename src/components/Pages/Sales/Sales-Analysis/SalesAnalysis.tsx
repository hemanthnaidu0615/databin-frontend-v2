import React, { useState } from "react";
import SalesTrendsChart from "./SalesTrendsChart";
import TopProductsTable from "./TopProductsTable";
import TopCustomersTable from "./TopCustomersTable";
import ShippingBreakdown from "./ShippingBreakdown";

type TabKey = "trends" | "products" | "customers" | "shipping";

const SalesAnalysis = () => {
  /** map keys → labels & components once */
  const tabs: Record<
    TabKey,
    { label: string; component: React.ReactElement }
  > = {
    trends:   { label: "Sales Trends",       component: <SalesTrendsChart /> },
    products: { label: "Top Products",       component: <TopProductsTable /> },
    customers:{ label: "Top Customers",      component: <TopCustomersTable /> },
    shipping: { label: "Shipping Breakdown", component: <ShippingBreakdown /> }
  };

  // default to first key
  const [active, setActive] = useState<TabKey>("trends");

  return (
    <div className="w-full max-w-screen-2xl mx-auto  
                    min-h-screen bg-gray-50 dark:bg-gray-900
                    text-gray-900 dark:text-white overflow-x-hidden">

      <h1 className="app-section-title">Sales Analysis</h1>

      {/* Drop-down selector (full-width on mobile, inline on larger screens) */}
      <div className="mt-4">
        <label htmlFor="analysisView" className="sr-only">
          Select analysis view
        </label>

        <select
          id="analysisView"
          value={active}
          onChange={(e) => setActive(e.target.value as TabKey)}
          className="
            w-full sm:w-72 lg:w-80
            px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-800
            text-sm sm:text-base
            focus:outline-none 
            transition-colors
          "
        >
          {Object.entries(tabs).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Active panel */}
      <div className="mt-6">
        {tabs[active].component}
      </div>
    </div>
  );
};

export default SalesAnalysis;
