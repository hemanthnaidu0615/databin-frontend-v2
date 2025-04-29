import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

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

interface OrderTrackingProps {
  onRemove?: () => void;
  onViewMore?: () => void;
}

export default function OrderTracking(_: OrderTrackingProps) {
  const [totalOrders, setTotalOrders] = useState(0);
  const [orderCounts, setOrderCounts] = useState({
    Pending: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
    "Return Received": 0,
    Refunded: 0,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(() => {
    return localStorage.getItem("orderTrackingVisible") !== "false";
  });

  // Access the date range from Redux store
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    localStorage.setItem("orderTrackingVisible", String(isVisible));
  }, [isVisible]);

  useEffect(() => {
    async function fetchData() {
      try {
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        // Fetch total orders with date range
        const totalOrdersResponse = await axios.get(
          `http://localhost:8080/api/dashboard-kpi/total-orders?startDate=${encodeURIComponent(
            formattedStartDate
          )}&endDate=${encodeURIComponent(formattedEndDate)}`
        );
        setTotalOrders(totalOrdersResponse.data.total_orders);

        // Fetch order status counts with date range
        const orderCountsResponse = await axios.get(
          `http://localhost:8080/api/shipment-status/count?startDate=${encodeURIComponent(
            formattedStartDate
          )}&endDate=${encodeURIComponent(formattedEndDate)}`
        );
        setOrderCounts(orderCountsResponse.data);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    }

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]); // Re-run when startDate or endDate changes

  const progressPercentage =
    totalOrders > 0
      ? ((orderCounts.Delivered + orderCounts.Refunded) / totalOrders) * 100
      : 0;
  const series = [progressPercentage];

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 260,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: { size: "70%" },
        track: { background: "#E4E7EC", strokeWidth: "100%", margin: 5 },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "24px",
            fontWeight: "600",
            offsetY: -25,
            color: "#1D2939",
            formatter: (val) => val.toFixed(1) + "%",
          },
        },
      },
    },
    fill: { type: "solid", colors: ["#465FFF"] },
    stroke: { lineCap: "round" },
    labels: ["Progress"],
  };

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function removeChart() {
    setIsVisible(false);
    closeDropdown();
  }

  function restoreChart() {
    setIsVisible(true);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] w-full max-w-full">
      {!isVisible && (
        <div className="flex justify-center py-4">
          <Button
            label="Restore Chart"
            className="p-button-primary"
            onClick={restoreChart}
          />
        </div>
      )}

      {isVisible && (
        <>
          <div className="px-4 pt-4 bg-white shadow-default rounded-xl pb-6 dark:bg-gray-900 sm:px-5 sm:pt-5">
            <div className="flex justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                  Order Tracking
                </h3>
                <p className="mt-1 text-gray-500 text-xs dark:text-gray-400">
                  Monitor orders and fulfillment speed
                </p>
              </div>

              <div className="relative inline-block text-left">
                <button onClick={toggleDropdown}>
                  <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-5" />
                </button>

                {isOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          closeDropdown();
                          _.onViewMore?.();
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 w-full text-left"
                      >
                        View More
                      </button>
                      <button
                        onClick={removeChart}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 w-full text-left"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="max-h-[260px]" id="chartDarkStyle">
                <Chart
                  options={options}
                  series={series}
                  type="radialBar"
                  height={260}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 px-5 py-3 sm:gap-4 sm:py-4">
            {[
              {
                label: "Pending",
                count: orderCounts.Pending,
                color: "text-yellow-500",
              },
              {
                label: "Shipped",
                count: orderCounts.Shipped,
                color: "text-blue-500",
              },
              {
                label: "Delivered",
                count: orderCounts.Delivered,
                color: "text-green-500",
              },
              {
                label: "Canceled",
                count: orderCounts.Cancelled,
                color: "text-red-500",
              },
              {
                label: "Returned",
                count: orderCounts["Return Received"],
                color: "text-purple-500",
              },
              {
                label: "Refunded",
                count: orderCounts.Refunded,
                color: "text-teal-500",
              },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <p className={`mb-1 text-xs ${item.color}`}>{item.label}</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {item.count}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
