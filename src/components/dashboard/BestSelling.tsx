import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import "primeicons/primeicons.css";
import { axiosInstance } from "../../axios";

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
  const exchangeRate = 0.012;
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
  const [productData, setProductData] = useState<ProductData[]>([]);
  const [position, setPosition] = useState(1);
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const navigate = useNavigate();

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

        const params: Record<string, string> = {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        };

        if (enterpriseKey) {
          params.enterpriseKey = enterpriseKey;
        }

        const response = await axiosInstance.get("/top-sellers/top-products", {
          params,
        });

        const json = response.data as { top_products?: any[] };

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
        <h2 className="app-subheading">
          Top Selling Products
        </h2>
        <button
          onClick={handleViewMore}
          className="text-lg font-medium hover:underline"
          style={{ color: "#9614d0" }}
        >
          View More
        </button>
      </div>

      {/* Carousel */}
      <div className="w-full overflow-visible relative">
        <div
          className="relative flex items-center justify-center w-full h-[380px] pt-2"
          style={{ perspective: "600px" }}
        >
          {/* Arrows (Desktop Only) */}
          {productData.length > 1 && (
            <>
              <button
                onClick={moveLeft}
                className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-[200] bg-black/50 text-white rounded-full w-8 h-8 items-center justify-center hover:bg-black/70 transition"
                aria-label="Previous"
              >
                <i className="pi pi-chevron-left text-base" />
              </button>
              <button
                onClick={moveRight}
                className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-[200] bg-black/50 text-white rounded-full w-8 h-8 items-center justify-center hover:bg-black/70 transition"
                aria-label="Next"
              >
                <i className="pi pi-chevron-right text-base" />
              </button>
            </>
          )}

          {/* Cards */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
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
                  className={`cursor-pointer absolute w-[220px] h-[280px] flex flex-col justify-between items-center p-3 rounded-2xl border text-center shadow-lg bg-white dark:bg-gray-800 ${abs === 0
                      ? "scale-105 transition-transform duration-300 ease-out"
                      : ""
                    }`}
                  style={{
                    transform: `translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
                    zIndex: 100 - abs,
                    opacity,
                    border: `2px solid ${abs === 0 ? "#9614d0" : "#8417b2"}`,
                    boxShadow: `0 0 10px ${abs === 0 ? "#9614d0" : "#8417b2"
                      }40`,
                    pointerEvents: abs > 2 ? "none" : "auto",
                    transition:
                      "transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease-out, border 0.3s ease-out, box-shadow 0.3s ease-out",
                  }}
                >
                  {/* Ranking */}
                  <span
                    className={`absolute top-2 left-2 text-4xl font-extrabold select-none pointer-events-none ${abs === 0
                        ? "text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text drop-shadow-[0_0_8px_rgba(150,20,208,0.5)]"
                        : "text-purple-600 opacity-30"
                      }`}
                  >
                    #{i + 1}
                  </span>

                  {/* Content */}
                  <div className="mt-20 w-full">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 whitespace-normal break-words">
                      {product.description.length > 100
                        ? product.description.slice(0, 100) + "..."
                        : product.description}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-400">
                      Price: {formatUSD(convertToUSD(product.price))}
                    </p>
                  </div>

                  <div className="flex flex-col items-center mt-2">
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

        {/* Dots (Mobile Only) */}
        <div className="flex sm:hidden justify-center gap-2 mt-3 z-50">
          {productData.map((_, index) => (
            <button
              key={index}
              onClick={() => setPosition(index + 1)}
              className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${position === index + 1
                  ? "bg-purple-600 border-purple-600"
                  : theme === "dark"
                    ? "border-gray-600 bg-gray-800"
                    : "border-gray-300 bg-white"
                }`}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfitabilityTable;
