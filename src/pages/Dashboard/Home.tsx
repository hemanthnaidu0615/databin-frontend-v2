import { memo } from "react";
import PageMeta from "../../components/common/PageMeta";
import EcommerceMetrics from "../../components/dashboard/SubHeader";
import StatisticsChart from "../../components/dashboard/StatisticsChart";
import RecentOrders from "../../components/dashboard/RecentOrders";
import OrderTracking from "../../components/dashboard/OrderTracking";
import DemographicCard from "../../components/dashboard/DemographicCard";

// Direct Widget Imports
import OrderProcessingTime from "../../components/dashboard/OrderProcessingTime";
import OrderTrendsCategory from "../../components/dashboard/OrderTrendsCategory";
import OrderValueSegment from "../../components/dashboard/OrderValueSegment";
import RevenuePerCustomer from "../../components/dashboard/RevenuePerCustomer";
import SalesFunnel from "../../components/dashboard/SalesFunnel";
import InventoryHealth from "../../components/dashboard/InventoryHealth";
import ShipmentPerformance from "../../components/dashboard/ShipmentPerformance";
import CustomerSegmentation from "../../components/dashboard/ProfitabilityTable";
import FulfillmentEfficiency from "../../components/dashboard/FulfillmentEfficiency";

// Memoized Components
const MemoizedEcommerceMetrics = memo(EcommerceMetrics);
const MemoizedStatisticsChart = memo(StatisticsChart);
const MemoizedRecentOrders = memo(RecentOrders);
const MemoizedOrderTracking = memo(OrderTracking);
const MemoizedDemographicCard = memo(DemographicCard);

const MemoizedOrderProcessingTime = memo(OrderProcessingTime);
const MemoizedOrderTrendsCategory = memo(OrderTrendsCategory);
const MemoizedOrderValueSegment = memo(OrderValueSegment);
const MemoizedRevenuePerCustomer = memo(RevenuePerCustomer);
const MemoizedSalesFunnel = memo(SalesFunnel);
const MemoizedInventoryHealth = memo(InventoryHealth);
const MemoizedShipmentPerformance = memo(ShipmentPerformance);
const MemoizedCustomerSegmentation = memo(CustomerSegmentation);
const MemoizedFulfillmentEfficiency = memo(FulfillmentEfficiency);

export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin"
        description="This is the React.js Ecommerce Dashboard for TailAdmin"
      />

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 p-4">
        {/* Header Metrics */}
        <div className="col-span-12">
          <MemoizedEcommerceMetrics />
        </div>

        {/* Key Charts Section (Two per row) */}
        <div className="col-span-12 md:col-span-6 xl:col-span-6">
          <MemoizedStatisticsChart />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-6">
          <MemoizedRecentOrders />
        </div>

        {/* Order Tracking & Demographics */}
        <div className="col-span-12 md:col-span-6 xl:col-span-6">
          <MemoizedOrderTracking />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-6">
          <MemoizedDemographicCard />
        </div>

        {/* Main Widgets - 3 per row */}
        <div className="col-span-12 md:col-span-4 xl:col-span-4">
          <MemoizedOrderProcessingTime />
        </div>
        <div className="col-span-12 md:col-span-4 xl:col-span-4">
          <MemoizedOrderTrendsCategory />
        </div>
        <div className="col-span-12 md:col-span-4 xl:col-span-4">
          <MemoizedOrderValueSegment />
        </div>

        <div className="col-span-12 md:col-span-4 xl:col-span-4">
          <MemoizedRevenuePerCustomer />
        </div>
        <div className="col-span-12 md:col-span-4 xl:col-span-4">
          <MemoizedSalesFunnel />
        </div>
        <div className="col-span-12 md:col-span-4 xl:col-span-4">
          <MemoizedInventoryHealth />
        </div>

        <div className="col-span-12 md:col-span-4 xl:col-span-4">
          <MemoizedShipmentPerformance />
        </div>
        <div className="col-span-12 md:col-span-4 xl:col-span-4">
          <MemoizedCustomerSegmentation />
        </div>
        <div className="col-span-12 md:col-span-4 xl:col-span-4">
          <MemoizedFulfillmentEfficiency />
        </div>
      </div>
    </>
  );
}
