import { useEffect, useState } from "react";
import { PrimeIcons } from "primereact/api";
import "primeicons/primeicons.css";
import { axiosInstance } from "../../../axios";
import { formatDateTime , formatValue } from "../../utils/kpiUtils";
import { useDateRangeEnterprise } from "../../utils/useGlobalFilters";
import KPIWidget from "../../modularity/kpis/KPIWidget";

interface ShipmentStatsProps {
  selectedCarrier: string | null;
  selectedMethod: string | null;
}

interface KPIData {
  label: string;
  value: string | number;
  icon: string;
  iconColor: string;
  glowColor: string;
}

const ShipmentKPI: React.FC<ShipmentStatsProps> = ({
  selectedCarrier,
  selectedMethod,
}) => {
  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange || [];

  const [stats, setStats] = useState<KPIData[]>([]);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const formattedStart = formatDateTime(startDate);
    const formattedEnd = formatDateTime(endDate);

    const params = new URLSearchParams({
      startDate: formattedStart,
      endDate: formattedEnd,
    });

    if (enterpriseKey) params.append("enterpriseKey", enterpriseKey);
    if (selectedCarrier) params.append("carrier", selectedCarrier);
    if (selectedMethod) params.append("shippingMethod", selectedMethod);

    const fetchStats = async () => {
      try {
        type TotalResType = { total_shipments: number | null };
        type OnTimeResType = { on_time_shipments: number | null };
        type DelayedResType = { delayed_shipments: number | null };
        type AvgTimeResType = { average_delivery_time: number | null };

        const [
          totalRes,
          onTimeRes,
          delayedRes,
          avgTimeRes,
        ] = await Promise.all([
          axiosInstance.get<TotalResType>(`shipment-dashboard-kpi/total-shipments?${params}`),
          axiosInstance.get<OnTimeResType>(`shipment-dashboard-kpi/on-time-shipments?${params}`),
          axiosInstance.get<DelayedResType>(`shipment-dashboard-kpi/delayed-shipments?${params}`),
          axiosInstance.get<AvgTimeResType>(`shipment-dashboard-kpi/average-delivery-time?${params}`),
        ]);

        const total = totalRes.data.total_shipments;
        const onTime = onTimeRes.data.on_time_shipments;
        const delayed = delayedRes.data.delayed_shipments;
        const avgTime = avgTimeRes.data.average_delivery_time;

        const deliveryTimeFormatted =
          avgTime !== null && !isNaN(avgTime)
            ? `${Math.ceil(parseFloat(avgTime.toString()))} day${Math.ceil(parseFloat(avgTime.toString())) > 1 ? "s" : ""
            }`
            : "--";

        const onTimePercentage =
          total && onTime !== null
            ? `${((onTime / total) * 100).toFixed(1)}%`
            : "--";

        const shipmentStats: KPIData[] = [
          {
            label: "Total Shipments",
            value: total !== null ? formatValue(total) : "--",
            icon: PrimeIcons.BOX,
            iconColor: "text-violet-500",
            glowColor: "#8B5CF6",
          },
          {
            label: "On-Time Delivery",
            value: onTimePercentage,
            icon: PrimeIcons.CLOCK,
            iconColor: "text-green-500",
            glowColor: "#22C55E",
          },
          {
            label: "Avg Delivery Time",
            value: deliveryTimeFormatted,
            icon: PrimeIcons.SPINNER,
            iconColor: "text-yellow-500",
            glowColor: "#FACC15",
          },
          {
            label: "Delayed Shipments",
            value: delayed !== null ? formatValue(delayed) : "--",
            icon: PrimeIcons.EXCLAMATION_TRIANGLE,
            iconColor: "text-red-500",
            glowColor: "#EF4444",
          },
        ];

        setStats(shipmentStats);
      } catch (error) {
        console.error("Error fetching shipment stats:", error);
      }
    };

    fetchStats();
  }, [startDate, endDate, enterpriseKey, selectedCarrier, selectedMethod]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4 font-outfit">
      {stats.map((stat, index) => (
        <KPIWidget key={index} {...stat} />
      ))}
    </div>
  );
};

export default ShipmentKPI;
