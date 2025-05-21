import { memo } from "react";
import PageMeta from "../../components/common/PageMeta";
import EcommerceMetrics from "../../components/dashboard/DashboardKPI";
import StatisticsChart from "../../components/dashboard/SalesAndRevenue";
import RecentOrders from "../../components/dashboard/RecentOrders";
import OrderTracking from "../../components/dashboard/OrderTracking";
import DemographicCard from "../../components/dashboard/CustomerDemographic";
import OrderTrendsCategory from "../../components/dashboard/OrderTrendsCategory";
import RevenuePerCustomer from "../../components/dashboard/RevenuePerCustomer";
import ShipmentPerformance from "../../components/dashboard/ShipmentPerformance";
import CustomerSegmentation from "../../components/dashboard/BestSelling";
import FulfillmentEfficiency from "../../components/dashboard/FulfillmentEfficiency";

const Memoized = {
  EcommerceMetrics: memo(EcommerceMetrics),
  StatisticsChart: memo(StatisticsChart),
  RecentOrders: memo(RecentOrders),
  OrderTracking: memo(OrderTracking),
  DemographicCard: memo(DemographicCard),
  OrderTrendsCategory: memo(OrderTrendsCategory),
  RevenuePerCustomer: memo(RevenuePerCustomer),
  ShipmentPerformance: memo(ShipmentPerformance),
  CustomerSegmentation: memo(CustomerSegmentation),
  FulfillmentEfficiency: memo(FulfillmentEfficiency),
};

export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin"
        description="This is the React.js Ecommerce Dashboard for TailAdmin"
      />

      <div className="grid grid-cols-1 sm:grid-cols-6 xl:grid-cols-12 gap-4 md:gap-6 p-4">
        {/* 📊 Overview */}
        <div className="col-span-full">
          <Memoized.EcommerceMetrics />
        </div>

        {/* 📈 Sales & Revenue */}
        <div className="sm:col-span-6 xl:col-span-12 flex flex-col xl:flex-row gap-4">
          <div className="w-full xl:w-2/3 h-full">
            <div className="h-full bg-white dark:bg-[#0E1625] dark:border-[#1C2738] dark:border dark:ring-1 dark:ring-white/10 dark:shadow-md rounded-2xl shadow-md p-4">
              <Memoized.StatisticsChart />
            </div>
          </div>
          <div className="w-full xl:w-1/3 h-full">
            <div className="h-full bg-white dark:bg-[#0E1625] dark:border-[#1C2738] dark:border dark:ring-1 dark:ring-white/10 dark:shadow-md rounded-2xl shadow-md p-4">
              <Memoized.RevenuePerCustomer />
            </div>
          </div>
        </div>

        {/* 📦 Orders & Tracking */}
        <div className="sm:col-span-6 xl:col-span-12 flex flex-col xl:flex-row gap-4">
          <div className="w-full xl:w-2/3 h-full">
            <div className="h-full bg-white dark:bg-[#0E1625] dark:border-[#1C2738] dark:border dark:ring-1 dark:ring-white/10 dark:shadow-md rounded-2xl shadow-md p-4">
              <Memoized.RecentOrders />
            </div>
          </div>
          <div className="w-full xl:w-1/3 h-full">
            <div className="h-full bg-white dark:bg-[#0E1625] dark:border-[#1C2738] dark:border dark:ring-1 dark:ring-white/10 dark:shadow-md rounded-2xl shadow-md p-4">
              <Memoized.OrderTracking />
            </div>
          </div>
        </div>

        {/* 🛠 Operational Insights */}
        <div className="sm:col-span-6 xl:col-span-12 flex flex-col xl:flex-row gap-4">
          <div className="w-full xl:w-1/2 h-full">
            <div className="h-full bg-white dark:bg-[#0E1625] dark:border-[#1C2738] dark:border dark:ring-1 dark:ring-white/10 dark:shadow-md rounded-2xl shadow-md p-4">
              <Memoized.ShipmentPerformance />
            </div>
          </div>

          <div className="w-full xl:w-1/2 h-full">
            <div className="h-full bg-white dark:bg-[#0E1625] dark:border-[#1C2738] dark:border dark:ring-1 dark:ring-white/10 dark:shadow-md rounded-2xl shadow-md p-4">
              <Memoized.FulfillmentEfficiency />
            </div>
          </div>
        </div>

        {/* 👥 Customer Insights */}
        <div className="sm:col-span-6 xl:col-span-12 flex flex-col xl:flex-row gap-4">
          <div className="w-full xl:w-1/2 h-full">
            <div className="h-full bg-white dark:bg-[#0E1625] dark:border-[#1C2738] dark:border dark:ring-1 dark:ring-white/10 dark:shadow-md rounded-2xl shadow-md p-4">
              <Memoized.OrderTrendsCategory />
            </div>
          </div>

          <div className="w-full xl:w-1/2 h-full">
            <div className="h-full bg-white dark:bg-[#0E1625] dark:border-[#1C2738] dark:border dark:ring-1 dark:ring-white/10 dark:shadow-md rounded-2xl shadow-md p-4">
              <Memoized.DemographicCard />
            </div>
          </div>
        </div>

        {/* 🔄 Product Trends */}
        {/* <div className="sm:col-span-6 xl:col-span-12 flex flex-col xl:flex-row gap-4">
          <div className="w-full xl:w-1/2 h-full">
            <div className="h-full bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
              <Memoized.OrderValueSegment />
            </div>
          </div>
          <div className="w-full xl:w-1/2 h-full">
            <div className="h-full bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
              <Memoized.SalesFunnel />
            </div>
          </div>
        </div> */}

        {/* 🧾 Top Row: Inventory + Customer Segmentation (side by side, matching height) */}
        {/* Inventory Health Widget */}
        {/* <div className="sm:col-span-6 xl:col-span-12">
          <div className="bg-white dark:bg-[#0E1625] dark:border-[#1C2738] dark:border dark:ring-1 dark:ring-white/10 dark:shadow-md rounded-2xl shadow-md p-4">
            <Memoized.InventoryHealth />
          </div>
        </div> */}
        {/* 📊 Combined Widget Container */}
        <div className="sm:col-span-6 xl:col-span-12">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Customer Segmentation Widget */}
            <div className="col-span-1">
              <div className="bg-white dark:bg-[#0E1625] dark:border-[#1C2738] dark:border dark:ring-1 dark:ring-white/10 dark:shadow-md rounded-2xl shadow-md p-4">
                <Memoized.CustomerSegmentation />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
