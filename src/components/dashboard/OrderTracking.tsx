import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Button } from "primereact/button";
import { axiosInstance } from "../../axios";
import ResponsiveViewMoreButton from "../modularity/buttons/Button";

const formatValue = (value: number) => {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
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
  const [orderCounts, setOrderCounts] = useState({
    Shipped: 0,
    Cancelled: 0,
    "Return Received": 0,
  });
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(() => {
    return localStorage.getItem("orderTrackingVisible") !== "false";
  });

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange;
  const navigate = useNavigate();

  useEffect(() => {
    const scrollY = sessionStorage.getItem("scrollPosition");
    if (scrollY) {
      window.scrollTo({ top: parseInt(scrollY), behavior: "auto" });
      sessionStorage.removeItem("scrollPosition");
    }
  }, []);

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

        const response = await axiosInstance.get(
          `/shipment-status/count?${params.toString()}`
        );

        const counts = response.data as {
          Shipped?: number;
          Cancelled?: number;
          Returned?: number;
          ShippedPercentage?: number;
        };

        console.log("API Response:", counts);
        setOrderCounts({
          Shipped: counts.Shipped || 0,
          Cancelled: counts.Cancelled || 0,
          "Return Received": counts.Returned || 0,
        });

        setProgressPercentage(Number(counts.ShippedPercentage ?? 0));
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    }

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate, enterpriseKey]);

  const series = [Number(progressPercentage) || 0];

  const options: ApexOptions = {
    colors: ["#a855f7"],
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
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
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
    fill: {
      type: "solid",
      colors: ["#7b1fa2"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  function restoreChart() {
    setIsVisible(true);
  }

  function handleViewMore() {
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    navigate("/orders");
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
            <div className="flex justify-between items-start sm:items-center flex-wrap sm:flex-nowrap gap-2 mb-4">
              <div className="flex items-start justify-between w-full sm:w-auto">
                <h2 className="app-subheading flex-1 mr-2">Order Tracking</h2>

                {/* Mobile arrow (→) aligned right */}
                <ResponsiveViewMoreButton onClick={handleViewMore} showDesktop={false} />
              </div>

              {/* Desktop & tablet "View More" */}
              <ResponsiveViewMoreButton onClick={handleViewMore} showMobile={false} />
            </div>

            <div className="flex justify-center mt-13">
              <div className="max-h-[260px]" id="chartDarkStyle">
                {isVisible && progressPercentage > 0 && (
                  <Chart
                    options={options}
                    series={series}
                    type="radialBar"
                    height={260}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 px-5 py-3 sm:gap-4 sm:py-4">
            {[
              {
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
              },
            ].map((item, index) => (
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
