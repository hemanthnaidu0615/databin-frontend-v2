import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

interface OrderTrackingProps {
  onRemove?: () => void;
  onViewMore?: () => void;
}

export default function OrderTracking(_: OrderTrackingProps) {
  const totalOrders = 300;
  const pendingOrders = 60;
  const shippedOrders = 110;
  const deliveredOrders = 100;
  const canceledOrders = 20;
  const returnedOrders = 10;
  const refundedOrders = 5;

  const progressPercentage =
    ((deliveredOrders + refundedOrders) / totalOrders) * 100;
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

  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(() => {
    return localStorage.getItem("orderTrackingVisible") !== "false"; // Persist visibility
  });

  useEffect(() => {
    localStorage.setItem("orderTrackingVisible", String(isVisible));
  }, [isVisible]);

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
      {/* ✅ Restore Button (if removed) */}
      {!isVisible && (
        <div className="flex justify-center py-4">
          <Button label="Restore Chart" className="p-button-primary" onClick={restoreChart} />
        </div>
      )}

      {/* ✅ Chart Section (if visible) */}
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

              {/* Dropdown Actions */}
              <div className="relative inline-block">
                <button className="dropdown-toggle" onClick={toggleDropdown}>
                  <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-5" />
                </button>
                {isOpen && (
                  <Dropdown className="w-36 p-2">
                    <DropdownItem
                      onItemClick={closeDropdown} // ✅ Dropdown closes after clicking "View More"
                      className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                    >
                      View More
                    </DropdownItem>
                    <DropdownItem
                      onItemClick={removeChart} // ✅ Remove chart and close dropdown
                      className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                    >
                      Remove
                    </DropdownItem>
                  </Dropdown>
                )}
              </div>
            </div>

            {/* Chart */}
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

          {/* Order Status Counts */}
          <div className="grid grid-cols-3 gap-3 px-5 py-3 sm:gap-4 sm:py-4">
            {[
              { label: "Pending", count: pendingOrders, color: "text-yellow-500" },
              { label: "Shipped", count: shippedOrders, color: "text-blue-500" },
              { label: "Delivered", count: deliveredOrders, color: "text-green-500" },
              { label: "Canceled", count: canceledOrders, color: "text-red-500" },
              { label: "Returned", count: returnedOrders, color: "text-purple-500" },
              { label: "Refunded", count: refundedOrders, color: "text-teal-500" },
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