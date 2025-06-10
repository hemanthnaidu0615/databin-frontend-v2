import { useEffect, useState } from "react";
import { PrimeIcons } from "primereact/api";
import "primeicons/primeicons.css";
import { axiosInstance } from "../../../../axios";
import KPIWidget from "../../../modularity/kpis/KPIWidget";
import { formatDate,formatValue } from "../../../utils/kpiutils"; 
import { useDateRangeEnterprise } from "../../../utils/useGlobalFilters";

interface KPIData {
  label: string;
  value: string | number;
  icon: string;
  iconColor: string;
  glowColor: string;
}

const SalesRegionStats = () => {
  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [stats, setStats] = useState<KPIData[]>([]);

  useEffect(() => {
    if (!dateRange || dateRange.length !== 2) return;

    const [startDate, endDate] = dateRange;
    if (!startDate || !endDate) return;

    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(endDate);

    const convertToUSD = (rupees: number): number => {
      const exchangeRate = 0.012;
      return rupees * exchangeRate;
    };

    const fetchSalesStats = async () => {
      try {
        const params = {
          startDate: formattedStart,
          endDate: formattedEnd,
          ...(enterpriseKey ? { enterpriseKey } : {}),
        };

        const response = await axiosInstance.get("/sales/sales-kpis", { params });

        const data = response.data as {
          total_sales: number;
          total_orders: number;
          avg_order_value: number;
          total_taxes: number;
          total_shipping_fees: number;
        };

        setStats([
          {
            label: "Total Sales",
            value: `$${formatValue(convertToUSD(data.total_sales))}`,
            icon: PrimeIcons.DOLLAR,
            iconColor: "text-purple-500",
            glowColor: "#8B5CF6",
          },
          {
            label: "Total Orders",
            value: formatValue(data.total_orders),
            icon: PrimeIcons.SHOPPING_CART,
            iconColor: "text-green-500",
            glowColor: "#22C55E",
          },
          {
            label: "Average Order Value",
            value: `$${convertToUSD(data.avg_order_value).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            icon: PrimeIcons.CHART_BAR,
            iconColor: "text-yellow-500",
            glowColor: "#F59E0B",
          },
          {
            label: "Total Taxes",
            value: `$${formatValue(convertToUSD(data.total_taxes))}`,
            icon: PrimeIcons.PERCENTAGE,
            iconColor: "text-red-500",
            glowColor: "#EF4444",
          },
          {
            label: "Shipping Fees",
            value: `$${formatValue(convertToUSD(data.total_shipping_fees))}`,
            icon: PrimeIcons.SEND,
            iconColor: "text-blue-500",
            glowColor: "#3B82F6",
          },
        ]);
      } catch (error) {
        console.error("Error fetching sales region stats:", error);
      }
    };

    fetchSalesStats();
  }, [dateRange, enterpriseKey]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 font-outfit">
      {stats.map((stat, index) => (
        <KPIWidget key={index} {...stat} />
      ))}
    </div>
  );
};

export default SalesRegionStats;
