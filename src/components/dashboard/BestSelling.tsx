import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { MoreDotIcon } from "../../icons";
import { useTheme } from "next-themes";

interface ProductData {
  id: number;
  name: string;
  price: number;
  description: string;
  url: string;
  updateDate?: string;
}

const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
};

function convertToUSD(rupees: number): number {
  const exchangeRate = 0.012; // Adjust this if needed
  return rupees * exchangeRate;
}

function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}


const ProfitabilityTable: React.FC = () => {
  const { theme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [productData, setProductData] = useState<ProductData[]>([]);
  const [position, setPosition] = useState(1);
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const navigate = useNavigate();

  const closeDropdown = () => setIsDropdownOpen(false);
  const removeWidget = () => console.log("Remove Widget");

  const handleViewMore = () => {
    navigate("/orders");
  };

  const moveLeft = () =>
    setPosition((prev) => (prev === 1 ? productData.length : prev - 1));
  const moveRight = () =>
    setPosition((prev) => (prev === productData.length ? 1 : prev + 1));

  useEffect(() => {
    const fetchTopProducts = async () => {
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

        const response = await fetch(
          `http://localhost:8080/api/top-sellers/top-products?${params.toString()}`
        );
        const json = await response.json();

        if (json.top_products && Array.isArray(json.top_products)) {
          const transformed = json.top_products.map(
            (product: any, index: number) => ({
              id: index + 1,
              name: product.product_name,
              price: parseFloat(product.price ?? 0),
              description: product.description ?? "No description available",
              url: product.url ?? "#",
              updateDate: product.update_date,
            })
          );
          setProductData(transformed.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch top products:", error);
      }
    };

    if (startDate && endDate) {
      fetchTopProducts();
    }
  }, [startDate, endDate, enterpriseKey]); 

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") moveLeft();
      if (e.key === "ArrowRight") moveRight();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [productData.length]);

  useEffect(() => {
    const interval = setInterval(() => moveRight(), 5000);
    return () => clearInterval(interval);
  }, [productData.length]);

  return (
    <div className="overflow-visible rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md p-4 w-full relative min-h-[400px] sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-semibold text-gray-800 dark:text-white">
          Top Selling Products
        </h3>
        <button
          onClick={handleViewMore}
          className="text-xs font-medium hover:underline"
          style={{ color: "#9614d0" }}
        >
          View More
        </button>
        {/* Dropdown (Commented) */}
        {/*
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <MoreDotIcon className="text-gray-500 dark:text-gray-400 size-5" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-md z-50 p-2">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  closeDropdown?.();
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
              >
                View More
              </button>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  removeWidget?.();
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
              >
                Remove
              </button>
            </div>
          )}
        </div>
        */}
      </div>

      {/* Carousel */}
      <div
        className="relative flex items-center justify-center w-full h-[360px] overflow-visible"
        style={{ perspective: "600px" }}
      >
        {/* Dots Below */}
        <div className="absolute -bottom-2 w-full flex justify-center gap-2 z-50">
          {productData.map((_, index) => (
            <button
              key={index}
              onClick={() => setPosition(index + 1)}
              className={`w-3 h-3 rounded-full border-2 transition-colors ${
                position === index + 1
                  ? "bg-purple-600 border-purple-600"
                  : theme === "dark"
                  ? "border-gray-600"
                  : "border-gray-300"
              }`}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>

        {/* Cards */}
        <div className="relative w-full h-full flex items-center justify-center">
          {productData.map((product, i) => {
            const offset = i + 1;
            const r = offset - position;
            const abs = Math.abs(r);
            const scale = abs === 0 ? 1.03 : 1 - abs * 0.04;
            const rotateY = -r * 15;
            const translateX = r * 100;
            const opacity = abs > 2 ? 0 : 1;

            return (
              <div
                key={product.id}
                onClick={() => setPosition(offset)}
                className="cursor-pointer absolute w-[220px] h-[300px] flex flex-col justify-between items-center p-3 rounded-2xl border text-center shadow-lg bg-white dark:bg-gray-800"
                style={{
                  transform: `translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
                  zIndex: 100 - abs,
                  opacity,
                  border: `2px solid ${abs === 0 ? "#9614d0" : "#8417b2"}`,
                  boxShadow: `0 0 10px ${abs === 0 ? "#9614d0" : "#8417b2"}40`,
                  pointerEvents: abs > 2 ? "none" : "auto",
                  transition:
                    "transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease-out, border 0.3s ease-out, box-shadow 0.3s ease-out",
                }}
              >
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 truncate">
                    {product.description.length > 50
                      ? product.description.slice(0, 50) + "..."
                      : product.description}
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-400">
                    Price: {formatUSD(convertToUSD(product.price))}
                  </p>
                </div>

                <div className="flex flex-col items-center mt-2">
                  <span
                    className="px-3 py-1 rounded-full text-white text-xs font-medium"
                    style={{ backgroundColor: "#9614d0" }}
                  >
                    Top Product #{i + 1}
                  </span>
                  {product.updateDate && (
                    <p className="text-[10px] mt-2 text-gray-500 dark:text-gray-400">
                      Updated: {formatDate(product.updateDate)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfitabilityTable;