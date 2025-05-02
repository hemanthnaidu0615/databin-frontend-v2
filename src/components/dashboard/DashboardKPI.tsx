import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "next-themes"; // Import useTheme

// Import images
import Inventory from "../../images/inventory.png";
import LocalShipping from "../../images/local_shipping.png";
import Warning from "../../images/warning.png";

// Helper function to format date to match the API requirement
const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ${d
    .getHours()
    .toString()
    .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d
    .getSeconds()
    .toString()
    .padStart(2, "0")}.${d.getMilliseconds().toString().padStart(3, "0")}`;
};

export default function OrdersFulfillmentMetrics() {
  const [metrics, setMetrics] = useState([
    {
      icon: Inventory,
      label: "Total Orders",
      value: "-",
      glowColor: "#22C55E", // Green
    },
    {
      icon: LocalShipping,
      label: "Fulfillment Rate",
      value: "-",
      glowColor: "#22C55E", // Green
    },
    {
      icon: Warning,
      label: "Delayed Orders",
      value: "-",
      glowColor: "#EF4444", // Red
    },
    {
      icon: LocalShipping,
      label: "Orders in Transit",
      value: "-",
      glowColor: "#22C55E", // Green
    },
    // {
    //   icon: Warning,
    //   label: "Inventory Alerts",
    //   value: "-",
    //   glowColor: "#F59E0B", // Yellow
    // },
  ]);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;
  const { theme } = useTheme(); // Get current theme

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);
  
        const urls = [
          `http://localhost:8080/api/dashboard-kpi/total-orders?startDate=${encodeURIComponent(
            formattedStartDate
          )}&endDate=${encodeURIComponent(formattedEndDate)}`,
          `http://localhost:8080/api/dashboard-kpi/fulfillment-rate?startDate=${encodeURIComponent(
            formattedStartDate
          )}&endDate=${encodeURIComponent(formattedEndDate)}`,
          `http://localhost:8080/api/dashboard-kpi/shipment-status-percentage?startDate=${encodeURIComponent(
            formattedStartDate
          )}&endDate=${encodeURIComponent(formattedEndDate)}`,
        ];
  
        const responses = await Promise.all(urls.map((url) => fetch(url)));
        const data = await Promise.all(responses.map((res) => res.json()));
  
        setMetrics([
          {
            icon: Inventory,
            label: "Total Orders",
            value: data[0].total_orders,
            glowColor: "#22C55E",
          },
          {
            icon: LocalShipping,
            label: "Fulfillment Rate",
            value: data[1].fulfillment_rate,
            glowColor: "#22C55E",
          },
          {
            icon: Warning,
            label: "Delayed Orders",
            value: data[2].delayed_percentage,
            glowColor: "#EF4444",
          },
          {
            icon: LocalShipping,
            label: "Orders in Transit",
            value: data[2].in_transit_orders,
            glowColor: "#22C55E",
          },
        ]);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    }
  
    if (startDate && endDate) {
      fetchMetrics();
    }
  }, [startDate, endDate]);
  

  return (
    // <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 pb-2 md:pb-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">

      {metrics.map((item, index) => (
        <div
          key={index}
          className="group relative flex flex-col gap-2 px-5 py-4 rounded-lg bg-white/70 dark:bg-white/5 shadow-sm backdrop-blur-md border-l-4 transition-transform transform hover:scale-[1.015] hover:shadow-md"
          style={{ borderColor: item.glowColor }}
        >
          {/* Border glow effect on hover */}
          <div
            className="absolute inset-0 rounded-xl border-2 opacity-0 group-hover:opacity-60 group-hover:shadow-[0_0_15px] transition duration-300 pointer-events-none"
            style={{
              borderColor: item.glowColor,
              boxShadow: `0 0 15px ${item.glowColor}`,
            }}
          ></div>

          <div className="flex items-center gap-3 text-gray-800 dark:text-gray-200">
            {/* Apply filter to darken icon in light theme */}
            <img
              src={item.icon}
              alt={item.label}
              className={`w-6 h-6 ${
                theme === "light" && item.icon === Warning
                  ? "filter brightness-0" // Darken icon in light theme for 'Warning' icon
                  : ""
              }`}
            />
            <span className="text-sm font-medium">{item.label}</span>
          </div>

          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
