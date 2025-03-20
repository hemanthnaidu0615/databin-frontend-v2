import { lazy, Suspense, memo, useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import EcommerceMetrics from "../../components/dashboard/SubHeader";
import StatisticsChart from "../../components/dashboard/StatisticsChart";
import RecentOrders from "../../components/dashboard/RecentOrders";
import OrderTracking from "../../components/dashboard/OrderTracking";
import DemographicCard from "../../components/dashboard/DemographicCard";

// Lazy Load Widgets with Optimized Import
const OrderProcessingTime = lazy(() => import("../../components/dashboard/Widgets/OrderProcessingTime"));
const OrderTrendsCategory = lazy(() => import("../../components/dashboard/Widgets/OrderTrendsCategory"));
const OrderValueSegment = lazy(() => import("../../components/dashboard/Widgets/OrderValueSegment"));
const RevenuePerCustomer = lazy(() => import("../../components/dashboard/Widgets/RevenuePerCustomer"));

// Memoized Components to Avoid Re-renders
const MemoizedEcommerceMetrics = memo(EcommerceMetrics);
const MemoizedStatisticsChart = memo(StatisticsChart);
const MemoizedRecentOrders = memo(RecentOrders);
const MemoizedOrderTracking = memo(OrderTracking);
const MemoizedDemographicCard = memo(DemographicCard);

const widgetComponents = [
  { Component: OrderProcessingTime, span: "xl:col-span-4" },
  { Component: OrderTrendsCategory, span: "xl:col-span-4" },
  { Component: OrderValueSegment, span: "xl:col-span-4" },
  { Component: RevenuePerCustomer, span: "xl:col-span-6" },
];

export default function Home() {
  // Load widgets with a delay after main content
  const [widgetsLoaded, setWidgetsLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setWidgetsLoaded(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
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

        {/* Additional Widgets - Load After 1s */}
        {widgetsLoaded && (
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

// Skeleton Loader for Smooth UX
function SkeletonLoader() {
  return (
    <div className="p-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 w-3/4 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 w-1/2 rounded"></div>
    </div>
  );
}






// <div className="grid grid-cols-12 gap-4 md:gap-6">
//         <div className="col-span-12 space-y-6 xl:col-span-7">
//           <EcommerceMetrics />

//         </div>

//         <div className="col-span-12 xl:col-span-5">
//           <OrderTracking />
//         </div>

//         <div className="col-span-12">
//           <StatisticsChart />
//         </div>

//         <div className="col-span-12 xl:col-span-5">
//           <DemographicCard />
//         </div>

//         <div className="col-span-12 xl:col-span-7">
//           <RecentOrders />
//         </div>
//       </div>
//     </>
//   );
// }


// export default function Home() {
//   return (
//     <>
//       <PageMeta
//         title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
//         description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
//       />

//       {/* Main Dashboard Content */}
//       <div className="grid grid-cols-12 gap-4 md:gap-6 p-4">
//         {/* Metrics and Sales Chart */}
//         <div className="col-span-12 space-y-6">
//           <EcommerceMetrics />
//           <StatisticsChart />
//         </div>

//         {/* Recent Orders, Order Tracking, Demographics */}
//         <div className="col-span-12 space-y-6">
//           <RecentOrders />
//           <OrderTracking />
//           <DemographicCard />
//         </div>

//         {/* Additional Widgets Section */}
//         <div className="col-span-12 grid grid-cols-12 gap-4 md:gap-6">
//           {widgetComponents.map(({ Component, span }, index) => (
//             <div key={index} className={`col-span-12 md:col-span-6 ${span}`}>
//               <Component />
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

