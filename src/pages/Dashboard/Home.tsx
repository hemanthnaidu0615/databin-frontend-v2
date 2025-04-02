// import { lazy, Suspense, memo, useState, useEffect, useMemo, useDeferredValue } from "react";
// import PageMeta from "../../components/common/PageMeta";
// import EcommerceMetrics from "../../components/dashboard/SubHeader";
// import StatisticsChart from "../../components/dashboard/StatisticsChart";
// import RecentOrders from "../../components/dashboard/RecentOrders";
// import OrderTracking from "../../components/dashboard/OrderTracking";
// import DemographicCard from "../../components/dashboard/DemographicCard";

// // Lazy Load Widgets
// const OrderProcessingTime = lazy(() => import("../../components/dashboard/Widgets/OrderProcessingTime"));
// const OrderTrendsCategory = lazy(() => import("../../components/dashboard/Widgets/OrderTrendsCategory"));
// const OrderValueSegment = lazy(() => import("../../components/dashboard/Widgets/OrderValueSegment"));
// const RevenuePerCustomer = lazy(() => import("../../components/dashboard/Widgets/RevenuePerCustomer"));
// const SalesFunnel = lazy(() => import("../../components/dashboard/Widgets/SalesFunnel"));

// // Memoized Components
// const MemoizedEcommerceMetrics = memo(EcommerceMetrics);
// const MemoizedStatisticsChart = memo(StatisticsChart);
// const MemoizedRecentOrders = memo(RecentOrders);
// const MemoizedOrderTracking = memo(OrderTracking);
// const MemoizedDemographicCard = memo(DemographicCard);

// export default function Home() {
//   // State for widget loading
//   const [widgetsLoaded, setWidgetsLoaded] = useState(false);
//   const deferredWidgetsLoaded = useDeferredValue(widgetsLoaded); // Defers rendering for smoother UI

//   useEffect(() => {
//     const timeout = setTimeout(() => setWidgetsLoaded(true), 800); // Reduced delay for better UX
//     return () => clearTimeout(timeout);
//   }, []);

//   // Memoized widget components
//   const widgetComponents = useMemo(() => [
//     { Component: OrderProcessingTime, span: "xl:col-span-4" },
//     { Component: OrderTrendsCategory, span: "xl:col-span-4" },
//     { Component: OrderValueSegment, span: "xl:col-span-4" },
//     { Component: RevenuePerCustomer, span: "xl:col-span-6" },
//     { Component: SalesFunnel, span: "xl:col-span-6" },
//   ], []);

//   return (
//     <>
//       <PageMeta
//         title="React.js Ecommerce Dashboard | TailAdmin"
//         description="This is the React.js Ecommerce Dashboard for TailAdmin"
//       />

//       {/* Main Dashboard Content */}
//       <div className="grid grid-cols-12 gap-4 md:gap-6 p-4">
//         <div className="col-span-12">
//           <MemoizedEcommerceMetrics />
//         </div>

//         {/* Key Metrics Section */}
//         <div className="col-span-12 md:col-span-6 xl:col-span-6">
//           <MemoizedStatisticsChart />
//         </div>
//         <div className="col-span-12 md:col-span-6 xl:col-span-6">
//           <MemoizedRecentOrders />
//         </div>
//         <div className="col-span-12 md:col-span-6 xl:col-span-6">
//           <MemoizedOrderTracking />
//         </div>
//         <div className="col-span-12 md:col-span-6 xl:col-span-6">
//           <MemoizedDemographicCard />
//         </div>

//         {/* Additional Widgets - Load After 0.8s */}
//         {deferredWidgetsLoaded && (
//           <div className="col-span-12 grid grid-cols-12 gap-4 md:gap-6">
//             {widgetComponents.map(({ Component, span }, index) => (
//               <div key={index} className={`col-span-12 md:col-span-6 ${span}`}>
//                 <Suspense fallback={<SkeletonLoader />}>
//                   <Component />
//                 </Suspense>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// // Optimized Skeleton Loader
// const SkeletonLoader = () => (
//   <div className="p-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg">
//     <div className="h-5 bg-gray-300 dark:bg-gray-600 w-2/3 rounded mb-2"></div>
//     <div className="h-4 bg-gray-300 dark:bg-gray-600 w-1/2 rounded"></div>
//   </div>
// );


import { lazy, Suspense, memo, useState, useEffect, useMemo, useDeferredValue } from "react";
import PageMeta from "../../components/common/PageMeta";
import EcommerceMetrics from "../../components/dashboard/SubHeader";
import StatisticsChart from "../../components/dashboard/StatisticsChart";
import RecentOrders from "../../components/dashboard/RecentOrders";
import OrderTracking from "../../components/dashboard/OrderTracking";
import DemographicCard from "../../components/dashboard/DemographicCard";

// Lazy Load Widgets
const OrderProcessingTime = lazy(() => import("../../components/dashboard/Widgets/OrderProcessingTime"));
const OrderTrendsCategory = lazy(() => import("../../components/dashboard/Widgets/OrderTrendsCategory"));
const OrderValueSegment = lazy(() => import("../../components/dashboard/Widgets/OrderValueSegment"));
const RevenuePerCustomer = lazy(() => import("../../components/dashboard/Widgets/RevenuePerCustomer"));
const SalesFunnel = lazy(() => import("../../components/dashboard/Widgets/SalesFunnel"));
const InventoryHealth = lazy(() => import("../../components/dashboard/Widgets/InventoryHealth"));
const ShipmentPerformance = lazy(() => import("../../components/dashboard/Widgets/ShipmentPerformance"));
const CustomerSegmentation = lazy(() => import("../../components/dashboard/Widgets/ProfitabilityTable"));
const FulfillmentEfficiency = lazy(() => import("../../components/dashboard/Widgets/FulfillmentEfficiency"));

// Memoized Components
const MemoizedEcommerceMetrics = memo(EcommerceMetrics);
const MemoizedStatisticsChart = memo(StatisticsChart);
const MemoizedRecentOrders = memo(RecentOrders);
const MemoizedOrderTracking = memo(OrderTracking);
const MemoizedDemographicCard = memo(DemographicCard);

export default function Home() {
  // State for widget loading
  const [widgetsLoaded, setWidgetsLoaded] = useState(false);
  const deferredWidgetsLoaded = useDeferredValue(widgetsLoaded); // Defers rendering for smoother UI

  useEffect(() => {
    const timeout = setTimeout(() => setWidgetsLoaded(true), 800); // Reduced delay for better UX
    return () => clearTimeout(timeout);
  }, []);

  // Memoized widget components
  const widgetComponents = useMemo(() => [
    { Component: OrderProcessingTime, span: "xl:col-span-4" },
    { Component: OrderTrendsCategory, span: "xl:col-span-4" },
    { Component: OrderValueSegment, span: "xl:col-span-4" },
    { Component: RevenuePerCustomer, span: "xl:col-span-6" },
    { Component: SalesFunnel, span: "xl:col-span-6" },
    { Component: InventoryHealth, span: "xl:col-span-6" }, // New widget
    { Component: ShipmentPerformance, span: "xl:col-span-6" }, // New widget
    { Component: CustomerSegmentation, span: "xl:col-span-6" }, // New widget
    { Component: FulfillmentEfficiency, span: "xl:col-span-6" }, // New widget
  ], []);

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin"
        description="This is the React.js Ecommerce Dashboard for TailAdmin"
      />

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 p-4">
        <div className="col-span-12">
          <MemoizedEcommerceMetrics />
        </div>

        {/* Key Metrics Section */}
        <div className="col-span-12 md:col-span-6 xl:col-span-6">
          <MemoizedStatisticsChart />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-6">
          <MemoizedRecentOrders />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-6">
          <MemoizedOrderTracking />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-6">
          <MemoizedDemographicCard />
        </div>

        {/* Additional Widgets - Load After 0.8s */}
        {deferredWidgetsLoaded && (
          <div className="col-span-12 grid grid-cols-12 gap-4 md:gap-6">
            {widgetComponents.map(({ Component, span }, index) => (
              <div key={index} className={`col-span-12 md:col-span-6 ${span}`}>
                <Suspense fallback={<SkeletonLoader />}>
                  <Component />
                </Suspense>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// Optimized Skeleton Loader
const SkeletonLoader = () => (
  <div className="p-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg">
    <div className="h-5 bg-gray-300 dark:bg-gray-600 w-2/3 rounded mb-2"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-600 w-1/2 rounded"></div>
  </div>
);
