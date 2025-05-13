import { TabView, TabPanel } from "primereact/tabview";
import KPISection from "./KPISection";
import SalesTrendsChart from "./SalesTrendsChart";
import TopProductsTable from "./TopProductsTable";
import TopCustomersTable from "./TopCustomersTable";
import ShippingBreakdown from "./ShippingBreakdown";

const SalesAnalysis = () => {
  return (
    <div className="min-h-screen px-4 py-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Sales Analysis</h1>

        {/* ❌ No need to pass kpis — it’s internal to KPISection now */}
        <KPISection />

        <TabView
          className="mt-4"
          pt={{
            navContainer: {
              className: "flex gap-8", // spacing between tabs
            },
          }}
        >
          <TabPanel header="Sales Trends">
            <SalesTrendsChart />
          </TabPanel>
          <TabPanel header="Top Products">
            <TopProductsTable />
          </TabPanel>
          <TabPanel header="Top Customers">
            <TopCustomersTable />
          </TabPanel>
          <TabPanel header="Shipping Breakdown">
            <ShippingBreakdown />
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default SalesAnalysis;