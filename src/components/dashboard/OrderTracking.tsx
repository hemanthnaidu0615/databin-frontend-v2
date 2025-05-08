import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Button } from "primereact/button";

const formatValue = (value: number) => {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "m";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "k";
  return value.toFixed(0);
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
    .padStart(3, "0")}`;
};

interface OrderTrackingProps {
  onRemove?: () => void;
  onViewMore?: () => void;
}

export default function OrderTracking(_: OrderTrackingProps) {
  const [totalOrders, setTotalOrders] = useState(0);
  const [orderCounts, setOrderCounts] = useState({
    Shipped: 0,
    Cancelled: 0,
    "Return Received": 0,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(() => {
    return localStorage.getItem("orderTrackingVisible") !== "false";
  });

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange;

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("orderTrackingVisible", String(isVisible));
  }, [isVisible]);

  useEffect(() => {
    async function fetchData() {
      try {
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        const params = new URLSearchParams({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        });

        if (enterpriseKey) {
          params.append("enterpriseKey", enterpriseKey);
        }

        const totalOrdersResponse = await axios.get(
          `http://localhost:8080/api/dashboard-kpi/total-orders?${params.toString()}`
        );
        setTotalOrders(totalOrdersResponse.data.total_orders);

        const orderCountsResponse = await axios.get(
          `http://localhost:8080/api/shipment-status/count?${params.toString()}`
        );

        const counts = orderCountsResponse.data;

        setOrderCounts({
          Shipped: counts.Shipped || 0,
          Cancelled: counts.Cancelled || 0,
          "Return Received": counts.Returned || 0, // remapped from "Returned"
        });
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    }

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate, enterpriseKey]);

  const progressPercentage =
    totalOrders > 0
      ? ((orderCounts.Shipped + orderCounts["Return Received"]) / totalOrders) * 100
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

  function handleViewMore() {
    navigate("/orders");
    closeDropdown();
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
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                  Order Tracking
                </h3>
                <p className="mt-1 text-gray-500 text-xs dark:text-gray-400">
                  Monitor orders and fulfillment speed
                </p>
              </div>

              <button
                onClick={handleViewMore}
                className="text-xs font-medium hover:underline mt-1"
                style={{ color: "#9614d0" }}
              >
                View More
              </button>
            </div>

            <div className="relative mt-4">
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
            {[{
              label: "Shipped",
              count: orderCounts.Shipped,
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
              color: "text-yellow-500",
            }].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <p className={`mb-1 text-xs ${item.color}`}>{item.label}</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {formatValue(item.count)}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
