import { TabView, TabPanel } from "primereact/tabview";
// import KPISection from "./KPISection";
import SalesTrendsChart from "./SalesTrendsChart";
import TopProductsTable from "./TopProductsTable";
import TopCustomersTable from "./TopCustomersTable";
import ShippingBreakdown from "./ShippingBreakdown";

const SalesAnalysis = () => {
  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white overflow-x-hidden">
      <h1 className="text-2xl font-bold mb-6">Sales Analysis</h1>

      {/* <KPISection /> */}

      <div className="overflow-x-auto">
        <TabView
          className="mt-4"
          pt={{
            navContainer: {
              className: "flex gap-8", // spacing between tabs
            },
          }}
        >
          <TabPanel header="Sales Trends">
            <div className="overflow-x-auto">
              <SalesTrendsChart />
            </div>
          </TabPanel>
          <TabPanel header="Top Products">
            <div className="overflow-x-auto">
              <TopProductsTable />
            </div>
          </TabPanel>
          <TabPanel header="Top Customers">
            <div className="overflow-x-auto">
              <TopCustomersTable />
            </div>
          </TabPanel>
          <TabPanel header="Shipping Breakdown">
            <div className="overflow-x-auto">
              <ShippingBreakdown />
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default SalesAnalysis;
