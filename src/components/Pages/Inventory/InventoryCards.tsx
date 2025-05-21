import { useEffect, useState } from "react";
import { PrimeIcons } from "primereact/api";
import { useSelector } from "react-redux";
import "primeicons/primeicons.css";

// Helper function to format dates
const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
};

const InventoryCards = () => {
  const [stockData, setStockData] = useState({
    total_products: 0,
    available: 0,
    low_stock: 0,
    out_of_stock: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    const fetchStockSummary = async () => {
      try {
        if (!startDate || !endDate) return;

        const formattedStart = formatDate(startDate);
        const formattedEnd = formatDate(endDate);

        const response = await fetch(
          `http://localhost:8080/api/inventory/stock-summary?startDate=${formattedStart}&endDate=${formattedEnd}`
        );

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        setStockData(data);
      } catch (err) {
        console.error("Failed to fetch stock summary:", err);
        setError("Unable to load stock summary.");
      }
    };

    fetchStockSummary();
  }, [startDate, endDate]);

  const cardData = [
    {
      label: "Total Products",
      value: stockData.total_products,
      border: "#8b5cf6",
      icon: PrimeIcons.BOX,
      iconColor: "text-purple-500",
    },
    {
      label: "Available",
      value: stockData.available,
      border: "#00c853",
      icon: PrimeIcons.CHECK_CIRCLE,
      iconColor: "text-green-500",
    },
    {
      label: "Low Stock",
      value: stockData.low_stock,
      border: "#ffc400",
      icon: PrimeIcons.EXCLAMATION_CIRCLE,
      iconColor: "text-yellow-500",
    },
    {
      label: "Out of Stock",
      value: stockData.out_of_stock,
      border: "#ff3d00",
      icon: PrimeIcons.TIMES_CIRCLE,
      iconColor: "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {error ? (
        <div className="col-span-full text-red-500 text-sm">{error}</div>
      ) : (
        cardData.map((card, index) => (
          <div
            key={index}
          className="group relative flex flex-col gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-[#1C2333] text-black dark:text-white shadow-sm border-l-[6px] transition-transform transform hover:scale-[1.015]"
            style={{ borderLeftColor: card.border }}
          >
            <div
              className="absolute inset-0 rounded-xl border-2 opacity-0 group-hover:opacity-60 group-hover:shadow-[0_0_15px] transition duration-300 pointer-events-none"
              style={{
                borderColor: card.border,
                boxShadow: `0 0 15px ${card.border}`,
              }}
            ></div>

            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <i className={`pi ${card.icon} ${card.iconColor} text-lg`} />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {card.label}
                </p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {card.value.toLocaleString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default InventoryCards;
