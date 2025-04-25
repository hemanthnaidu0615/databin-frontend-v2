import FulfillmentStats from './FulfillmentStats';
import FulfillmentPipeline from './FulfillmentPipeline';
import FulfillmentCenters from './FulfillmentCenters';
import BottleneckChart from './BottleneckChart';
import OrdersInProcess from './OrdersInProcess';

const FulfillmentPage = () => {
  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-black min-h-screen">
      {/* Section 1: Stats Cards (4 cards, 1:1:1:1) */}
      <div >
        <FulfillmentStats />
      </div>

      {/* Section 2: Fulfillment Pipeline (6 steps, equal width) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FulfillmentPipeline />
      </div>

      {/* Section 3: Performance Table (60%) + Bottleneck Chart (40%) */}
      <div >
        <div className="lg:col-span-5">
          <FulfillmentCenters />
        </div>
        <div className="lg:col-span-5">
          <BottleneckChart />
        </div>
      </div>

      {/* Section 4: Orders Table (Full width) */}
      <div>
        <OrdersInProcess />
      </div>
    </div>
  );
};

export default FulfillmentPage;
