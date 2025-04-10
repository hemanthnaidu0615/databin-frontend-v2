import { useState, useEffect } from "react";

import Badge from "../ui/badge/Badge";

// Import images
import ArrowUpward from "../../images/arrow_upward.png";
import ArrowDownward from "../../images/arrow_downward.png";
import Inventory from "../../images/inventory.png";
import LocalShipping from "../../images/local_shipping.png";
import Warning from "../../images/warning.png";

export default function OrdersFulfillmentMetrics() {
  const [metrics, setMetrics] = useState([
    { icon: Inventory, label: "Total Orders", value: "-", isPositive: true },
    {
      icon: LocalShipping,
      label: "Fulfillment Rate",
      value: "-",
      isPositive: false,
    },
    { icon: Warning, label: "Delayed Orders", value: "-", isPositive: true },
    {
      icon: LocalShipping,
      label: "Orders in Transit",
      value: "-",
      isPositive: true,
    },
    { icon: Warning, label: "Inventory Alerts", value: "-", isWarning: true },
  ]);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const responses = await Promise.all([
          fetch("http://localhost:8080/api/dashboard-kpi/total-orders"),
          fetch("http://localhost:8080/api/dashboard-kpi/fulfillment-rate"),
          fetch(
            "http://localhost:8080/api/dashboard-kpi/shipment-status-percentage"
          ),
          fetch("http://localhost:8080/api/dashboard-kpi/out-of-stock"),
        ]);

        const data = await Promise.all(responses.map((res) => res.json()));

        setMetrics([
          {
            icon: Inventory,
            label: "Total Orders",
            value: data[0].total_orders,
            isPositive: true,
          },
          {
            icon: LocalShipping,
            label: "Fulfillment Rate",
            value: data[1].fulfillment_rate,
            isPositive: false,
          },
          {
            icon: Warning,
            label: "Delayed Orders",
            value: data[2].delayed_percentage,
            isPositive: true,
          },
          {
            icon: LocalShipping,
            label: "Orders in Transit",
            value: data[2].in_transit_orders,
            isPositive: true,
          },
          {
            icon: Warning,
            label: "Inventory Alerts",
            value: data[3].out_of_stock_count,
            isWarning: true,
          },
        ]);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    }

    fetchMetrics();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 pb-2 md:pb-4">
      {metrics.map((item, index) => {
        const arrowIcon = item.isPositive ? ArrowUpward : ArrowDownward;
        const badgeColor = item.isWarning
          ? "warning"
          : item.isPositive
          ? "success"
          : "error";

        return (
          <div
            key={index}
            className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex justify-between items-center"
          >
            {/* Left Section: Icon + Label + Value */}
            <div className="flex items-center gap-3">
              <img
                src={item.icon}
                alt={item.label}
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  {item.label}
                </span>
                <h4 className="font-bold text-gray-800 dark:text-white text-sm sm:text-lg">
                  {item.value}
                </h4>
              </div>
            </div>

            {/* Right Section: Badge with Arrow */}
            <Badge color={badgeColor}>
              <img
                src={arrowIcon}
                alt="Arrow"
                className="w-4 h-4 brightness-50 dark:brightness-100 opacity-90 dark:opacity-100"
              />
            </Badge>
          </div>
        );
      })}
    </div>
  );
}
