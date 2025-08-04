import { useEffect, useState } from "react";
import { PrimeIcons } from "primereact/api";
import "primeicons/primeicons.css";
import { axiosInstance } from "../../../axios";
import { useDateRangeEnterprise } from "../../utils/useGlobalFilters";
import { formatDate, formatValue } from "../../utils/kpiUtils";
import KPIWidget from "../../modularity/kpis/KPIWidget";

interface KPIData {
  label: string;
  value: string | number;
  icon: string;
  iconColor: string;
  glowColor: string;
}

const InventoryKPI = () => {
  const [stats, setStats] = useState<KPIData[]>([]);


  const { dateRange } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange || [];

  useEffect(() => {
    const fetchStockSummary = async () => {
      try {
        if (!startDate || !endDate) return;

        const formattedStart = formatDate(startDate);
        const formattedEnd = formatDate(endDate);

        const response = await axiosInstance.get("/inventory/stock-summary", {
          params: {
            startDate: formattedStart,
            endDate: formattedEnd,
          },
        });

        const data = response.data as {
          total_products: number;
          available: number;
          low_stock: number;
          out_of_stock: number;
        };

        const items: KPIData[] = [
          {
            label: "Total Products",
            value: formatValue(data.total_products),
            icon: PrimeIcons.BOX,
            iconColor: "text-purple-500",
            glowColor: "#8B5CF6",
          },
          {
            label: "Available",
            value: formatValue(data.available),
            icon: PrimeIcons.CHECK_CIRCLE,
            iconColor: "text-green-500",
            glowColor: "#00C853",
          },
          {
            label: "Low Stock",
            value: formatValue(data.low_stock),
            icon: PrimeIcons.EXCLAMATION_CIRCLE,
            iconColor: "text-yellow-500",
            glowColor: "#FFC400",
          },
          {
            label: "Out of Stock",
            value: formatValue(data.out_of_stock),
            icon: PrimeIcons.TIMES_CIRCLE,
            iconColor: "text-red-500",
            glowColor: "#FF3D00",
          },
        ];

        setStats(items);
      } catch (err) {
        console.error("Failed to fetch stock summary:", err);
      }
    };

    fetchStockSummary();
  }, [startDate, endDate]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-2 gap-4 mb-4">
      {stats.map((stat, index) => (
        <KPIWidget key={index} {...stat} />
      ))}
    </div>
  );
};

export default InventoryKPI;
