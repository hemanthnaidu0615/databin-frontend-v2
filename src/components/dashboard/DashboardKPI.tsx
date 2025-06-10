import { useEffect, useState } from "react";
import { PrimeIcons } from "primereact/api";
import { axiosInstance } from "../../axios";
import KPIWidget from "../modularity/kpis/KPIWidget";
import { formatDateTime, formatValue } from "../utils/kpiUtils";
import { useDateRangeEnterprise } from "../utils/useGlobalFilters";

type Metric = {
  label: string;
  value: string;
  icon: string;
  iconColor: string;
  glowColor: string;
};

const DashboardKPIs = () => {
  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchData = async () => {
      try {
        const params = {
          startDate: formatDateTime(startDate),
          endDate: formatDateTime(endDate),
          ...(enterpriseKey ? { enterpriseKey } : {}),
        };

        type TotalOrdersResponse = { total_orders: number };
        type FulfillmentRateResponse = { fulfillment_rate: number };
        type ShipmentStatusResponse = { in_transit_orders: number; delayed_percentage: number };

        const [totalOrdersRes, fulfillmentRateRes, shipmentStatusRes] = await Promise.all([
          axiosInstance.get<TotalOrdersResponse>("/dashboard-kpi/total-orders", { params }),
          axiosInstance.get<FulfillmentRateResponse>("/dashboard-kpi/fulfillment-rate", { params }),
          axiosInstance.get<ShipmentStatusResponse>("/dashboard-kpi/shipment-status-percentage", { params }),
        ]);

        setMetrics([
          {
            label: "Total Orders",
            value: formatValue(totalOrdersRes.data.total_orders),
            icon: PrimeIcons.BOX,
            iconColor: "text-purple-500",
            glowColor: "#8B5CF6",
          },
          {
            label: "Fulfillment Rate",
            value: `${fulfillmentRateRes.data.fulfillment_rate}`,
            icon: PrimeIcons.CHECK_CIRCLE,
            iconColor: "text-green-500",
            glowColor: "#22C55E",
          },
          {
            label: "Orders in Transit",
            value: formatValue(shipmentStatusRes.data.in_transit_orders),
            icon: PrimeIcons.SEND,
            iconColor: "text-yellow-500",
            glowColor: "#FACC15",
          },
          {
            label: "Delayed Orders",
            value: `${shipmentStatusRes.data.delayed_percentage}`,
            icon: PrimeIcons.EXCLAMATION_TRIANGLE,
            iconColor: "text-red-500",
            glowColor: "#F87171",
          },
        ]);
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
      }
    };

    fetchData();
  }, [startDate, endDate, enterpriseKey]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((item, i) => (
        <KPIWidget key={i} {...item} />
      ))}
    </div>
  );
};

export default DashboardKPIs;
