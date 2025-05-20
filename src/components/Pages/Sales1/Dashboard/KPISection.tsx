import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PrimeIcons } from "primereact/api";
import "primeicons/primeicons.css";

// 📌 INR to USD conversion
function convertToUSD(rupees: number): number {
  const exchangeRate = 0.012; // Adjust as needed
  return rupees * exchangeRate;
}

// 📦 KPI Card Type
type KPIItem = {
  title: string;
  value: string | number;
  icon: string;
  border: string;
  iconColor: string;
};

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const KPISection: React.FC = () => {
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange || [];

  const [kpis, setKpis] = useState<KPIItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) return;

      const formattedStart = formatDate(new Date(startDate));
      const formattedEnd = formatDate(new Date(endDate));

      const params = new URLSearchParams({
        startDate: formattedStart,
        endDate: formattedEnd,
      });

      if (enterpriseKey) {
        params.append("enterpriseKey", enterpriseKey);
      }

      try {
        const response = await fetch(`http://localhost:8080/api/sales/sales-kpis?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch KPI data");
        }

        const data = await response.json();

        const mappedData: KPIItem[] = [
          {
            title: "Total Sales",
            value: `$${convertToUSD(Number(data.total_sales)).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            icon: PrimeIcons.DOLLAR,
            border: "#8b5cf6",
            iconColor: "text-purple-500",
          },
          {
            title: "Total Orders",
            value: Number(data.total_orders).toLocaleString(),
            icon: PrimeIcons.SHOPPING_CART,
            border: "#22c55e",
            iconColor: "text-green-500",
          },
          {
            title: "Avg. Order Value",
            value: `$${convertToUSD(Number(data.avg_order_value)).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            icon: PrimeIcons.CHART_BAR,
            border: "#f59e0b",
            iconColor: "text-yellow-500",
          },          
          {
            title: "Total Taxes",
            value: `$${convertToUSD(Number(data.total_taxes)).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            icon: PrimeIcons.PERCENTAGE,
            border: "#ef4444",
            iconColor: "text-red-500",
          },
          {
            title: "Shipping Fees",
            value: `$${convertToUSD(Number(data.total_shipping_fees)).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            icon: PrimeIcons.SEND,
            border: "#3b82f6",
            iconColor: "text-blue-500",
          },
        ];

        setKpis(mappedData);
      } catch (error) {
        console.error("Error fetching KPI data:", error);
      }
    };

    fetchData();
  }, [startDate, endDate, enterpriseKey]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      {kpis.map((item, index) => (
        <div
          key={index}
          className="group relative p-5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-l-4 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]"
          style={{ borderLeftColor: item.border }}
        >
          <div
            className="absolute inset-0 rounded-xl border-2 opacity-0 group-hover:opacity-60 group-hover:shadow-[0_0_15px] transition duration-300 pointer-events-none"
            style={{
              borderColor: item.border,
              boxShadow: `0 0 15px ${item.border}`,
            }}
          ></div>

          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <i className={`pi ${item.icon} ${item.iconColor} text-lg`} />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {item.title}
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPISection;
