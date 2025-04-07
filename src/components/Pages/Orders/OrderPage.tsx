
import OrderFilters from "./OrderFilters";
import OrderSummary from "./OrderSummary";
import OrderList from "./OrderList";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function OrdersPage() {
  const delayReasonsOptions: ApexOptions = {
    chart: { type: "bar", background: "transparent" },
    xaxis: {
      categories: ["Weather", "Carrier Delay", "Inventory", "Customs", "Other"],
      labels: {
        style: { colors: "#ffffff", fontFamily: "Outfit, sans-serif" },
      },
    },
    plotOptions: {
      bar: { horizontal: true },
    },
    theme: { mode: "dark" },
    colors: ["#22c55e", "#ef4444", "#f97316", "#3b82f6", "#a855f7"],
    tooltip: { theme: "dark" },
    dataLabels: {
      style: { colors: ["#ffffff"], fontFamily: "Outfit, sans-serif" },
    },
  };

  const carrierDelayOptions: ApexOptions = {
    chart: { type: "pie", background: "transparent" },
    labels: ["FedEx", "UPS", "DHL", "USPS"],
    theme: { mode: "dark" },
    colors: ["#16a34a", "#f59e0b", "#3b82f6", "#ef4444"],
    legend: {
      labels: { colors: "#ffffff" },
    },
    tooltip: { theme: "dark" },
    dataLabels: {
      style: { colors: ["#ffffff"], fontFamily: "Outfit, sans-serif" },
    },
  };

  return (
    <div className="dark:bg-gray-900 bg-white text-gray-900 dark:text-white p-6 min-h-screen font-outfit">
      {/* Filters Section */}
      <div className="mb-6">
        <OrderFilters />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section: Summary + List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md p-5">
            <OrderSummary />
          </div>
          <OrderList />
        </div>

        {/* Right Section: Order Insights */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md p-5 space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            📊 Order Insights
          </h3>

          {/* Delay Reasons Chart */}
          <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h4 className="mb-3 font-medium text-gray-700 dark:text-white">
              🕒 Delay Reasons
            </h4>
            <Chart
              options={delayReasonsOptions}
              series={[{ name: "Delays", data: [25, 40, 15, 10, 10] }]}
              type="bar"
              height={200}
            />
          </div>

          {/* Carrier Delay Chart */}
          <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h4 className="mb-3 font-medium text-gray-700 dark:text-white">
              🚚 Top Carriers with Delays
            </h4>
            <Chart
              options={carrierDelayOptions}
              series={[18, 33, 40, 8]}
              type="pie"
              height={200}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
