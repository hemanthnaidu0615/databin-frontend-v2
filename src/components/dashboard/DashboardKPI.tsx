import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { PrimeIcons } from "primereact/api";
import { axiosInstance } from "../../axios";
import "primeicons/primeicons.css";

const formatValue = (value: number) => {
  return new Intl.NumberFormat("en-IN").format(value);
};

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
    .padStart(2, "0")}`;
};

export default function OrdersFulfillmentMetrics() {
  const [metrics, setMetrics] = useState([
    {
      icon: PrimeIcons.BOX,
      label: "Total Orders",
      value: "-",
      iconColor: "text-purple-500",
      glowColor: "#8B5CF6",
    },
    {
      icon: PrimeIcons.CHECK_CIRCLE,
      label: "Fulfillment Rate",
      value: "-",
      iconColor: "text-green-500",
      glowColor: "#22C55E",
    },
    {
      icon: PrimeIcons.SEND,
      label: "Orders in Transit",
      value: "-",
      iconColor: "text-yellow-500",
      glowColor: "#FACC15",
    },
    {
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      label: "Delayed Orders",
      value: "-",
      iconColor: "text-red-500",
      glowColor: "#F87171",
    },
  ]);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        const params: Record<string, string> = {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        };

        if (enterpriseKey) {
          params.enterpriseKey = enterpriseKey;
        }

        const [totalOrdersRes, fulfillmentRateRes, shipmentStatusRes] =
          await Promise.all([
            axiosInstance.get("/dashboard-kpi/total-orders", { params }),
            axiosInstance.get("/dashboard-kpi/fulfillment-rate", { params }),
            axiosInstance.get("/dashboard-kpi/shipment-status-percentage", {
              params,
            }),
          ]);

        // Type assertions for response data
        const totalOrdersData = totalOrdersRes.data as { total_orders: number };
        const fulfillmentRateData = fulfillmentRateRes.data as {
          fulfillment_rate: number;
        };
        const shipmentStatusData = shipmentStatusRes.data as {
          in_transit_orders: number;
          delayed_percentage: number;
        };

        // Type assertions for response data
        const totalOrdersData = totalOrdersRes.data as { total_orders: number };
        const fulfillmentRateData = fulfillmentRateRes.data as { fulfillment_rate: number };
        const shipmentStatusData = shipmentStatusRes.data as { in_transit_orders: number; delayed_percentage: number };

        setMetrics([
          {
            icon: PrimeIcons.BOX,
            label: "Total Orders",
            value: formatValue(totalOrdersData.total_orders),
            iconColor: "text-purple-500",
            glowColor: "#8B5CF6",
          },
          {
            icon: PrimeIcons.CHECK_CIRCLE,
            label: "Fulfillment Rate",
            value: `${fulfillmentRateData.fulfillment_rate}`,
            iconColor: "text-green-500",
            glowColor: "#22C55E",
          },
          {
            icon: PrimeIcons.SEND,
            label: "Orders in Transit",
            value: formatValue(shipmentStatusData.in_transit_orders),
            iconColor: "text-yellow-500",
            glowColor: "#FACC15",
          },
          {
            icon: PrimeIcons.EXCLAMATION_TRIANGLE,
            label: "Delayed Orders",
            value: `${shipmentStatusData.delayed_percentage}`,
            iconColor: "text-red-500",
            glowColor: "#F87171",
          },
        ]);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    }

    if (startDate && endDate) {
      fetchMetrics();
    }
  }, [startDate, endDate, enterpriseKey]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4 font-sans">
      {metrics.map((item, index) => (
        <div
          key={index}
          className={`group relative flex flex-col gap-2 px-5 py-4 rounded-2xl bg-white dark:bg-[#1C2333] text-black dark:text-white shadow-sm border-l-[6px] transition-transform transform hover:scale-[1.015]`}
          style={{ borderColor: item.glowColor }}
        >
          {/* Glowing border on hover */}
          <div
            className="absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-60 transition duration-300 pointer-events-none"
            style={{
              borderColor: item.glowColor,
              boxShadow: `0 0 15px ${item.glowColor}`,
            }}
          ></div>

          <div className="flex items-center gap-3 relative z-10 text-black/60 dark:text-white/80">
            <i className={`pi ${item.icon} ${item.iconColor} text-lg`} />
            <span className="text-sm font-medium">{item.label}</span>
          </div>

          <div className="text-2xl font-extrabold relative z-10">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
