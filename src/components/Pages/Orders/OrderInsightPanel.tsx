
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const OrderInsightPanel = () => {
  const delayReasonsOptions: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
    },
    theme: {
      mode: "dark",
    },
    xaxis: {
      categories: ["Weather", "Carrier Delay", "Inventory", "Customs", "Other"],
      labels: {
        style: { colors: "#ffffff", fontFamily: "Outfit, sans-serif" },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    tooltip: {
      theme: "dark",
    },
    dataLabels: {
      style: {
        colors: ["#ffffff"],
        fontFamily: "Outfit, sans-serif",
      },
    },
  };

  const delayReasonsSeries = [
    {
      name: "Delays",
      data: [25, 40, 15, 10, 10],
    },
  ];

  const carrierDelayOptions: ApexOptions = {
    chart: {
      type: "donut",
      background: "transparent",
    },
    labels: ["FedEx", "UPS", "DHL", "USPS"],
    theme: {
      mode: "dark",
    },
    legend: {
      labels: { colors: "#ffffff" },
    },
    tooltip: {
      theme: "dark",
    },
    dataLabels: {
      style: {
        colors: ["#ffffff"],
        fontFamily: "Outfit, sans-serif",
      },
    },
  };

  const carrierDelaySeries = [44, 33, 15, 8];

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 flex flex-col gap-6 font-outfit shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
        📊 Order Insights
      </h3>

      {/* Delay Reasons Chart */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 shadow-md">
        <h4 className="mb-3 font-medium text-gray-700 dark:text-white">
          🕒 Delay Reasons
        </h4>
        <Chart
          options={delayReasonsOptions}
          series={delayReasonsSeries}
          type="bar"
          height={250}
        />
      </div>

      {/* Carrier Delays Chart */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 shadow-md">
        <h4 className="mb-3 font-medium text-gray-700 dark:text-white">
          🚚 Top Carriers with Delays
        </h4>
        <Chart
          options={carrierDelayOptions}
          series={carrierDelaySeries}
          type="donut"
          height={250}
        />
      </div>
    </div>
  );
};

export default OrderInsightPanel;
