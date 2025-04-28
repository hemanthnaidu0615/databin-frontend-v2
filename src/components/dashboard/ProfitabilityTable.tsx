import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

interface ProductData {
  id: number;
  name: string;
  price: number;
  description: string;
  url: string;
  salesPercentage: number;
  popularity: number;
  updateDate?: string;
}

const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
};

const getPopularityColor = (popularity: number) => {
  if (popularity <= 30) return "#EF4444"; // red
  if (popularity <= 60) return "#3B82F6"; // blue
  return "#22C55E"; // green
};

const ProfitabilityTable: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [productData, setProductData] = useState<ProductData[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;

  const closeDropdown = () => setIsDropdownOpen(false);
  const removeWidget = () => console.log("Remove Widget");

  const moveLeft = () => {
    setCarouselIndex((prev) => (prev === 0 ? productData.length - 1 : prev - 1));
  };

  const moveRight = () => {
    setCarouselIndex((prev) => (prev === productData.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        const response = await fetch(
          `http://localhost:8080/api/top-sellers/top-products?startDate=${encodeURIComponent(
            formattedStartDate
          )}&endDate=${encodeURIComponent(formattedEndDate)}`
        );
        const json = await response.json();

        if (json.top_products && Array.isArray(json.top_products)) {
          const transformed = json.top_products.map((product: any, index: number) => ({
            id: index + 1,
            name: product.product_name,
            price: parseFloat(product.price ?? 0),
            description: product.description ?? "No description available",
            url: product.url ?? "#",
            salesPercentage: parseFloat(product.percentage ?? 0),
            popularity: Math.floor(Math.random() * 100),
            updateDate: product.update_date,
          }));
          setProductData(transformed);
        }
      } catch (error) {
        console.error("Failed to fetch top products:", error);
      }
    };

    if (startDate && endDate) {
      fetchTopProducts();
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") moveLeft();
      if (e.key === "ArrowRight") moveRight();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [productData.length]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md p-6 w-full relative min-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Profitability Table
        </h3>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <MoreDotIcon className="text-gray-500 dark:text-gray-400 size-6" />
          </button>
          {isDropdownOpen && (
            <Dropdown
              isOpen={isDropdownOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              <DropdownItem
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
              >
                View More
              </DropdownItem>
              <DropdownItem
                onItemClick={removeWidget}
                className="flex w-full font-normal text-left text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
              >
                Remove
              </DropdownItem>
            </Dropdown>
          )}
        </div>
      </div>

      {/* Carousel */}
      <div className="relative flex items-center justify-center w-full h-[450px] overflow-hidden">
        {/* Left Arrow */}
        <button
          onClick={moveLeft}
          className="absolute top-1/2 -translate-y-1/2 left-4 z-50 bg-black/30 dark:bg-white/20 hover:bg-black/50 dark:hover:bg-white/30 text-white dark:text-white rounded-full p-3 backdrop-blur-md transition shadow-lg"
        >
          <i className="pi pi-chevron-left text-2xl" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={moveRight}
          className="absolute top-1/2 -translate-y-1/2 right-4 z-50 bg-black/30 dark:bg-white/20 hover:bg-black/50 dark:hover:bg-white/30 text-white dark:text-white rounded-full p-3 backdrop-blur-md transition shadow-lg"
        >
          <i className="pi pi-chevron-right text-2xl" />
        </button>

        {/* Cards */}
        <div className="relative w-full h-full flex items-center justify-center perspective-1000">
          {productData.slice(0, 10).map((product, index) => {
            const offset = index - carouselIndex;
            const isActive = offset === 0;
            const popularityColor = getPopularityColor(product.popularity);

            const styles = {
              transform: `translateX(${offset * 300}px) rotateY(${offset * -30}deg) scale(${isActive ? 1 : 0.8})`,
              zIndex: isActive ? 50 : 30 - Math.abs(offset),
              opacity: Math.abs(offset) > 2 ? 0 : 1,
              transition: "all 0.5s ease",
              borderColor: popularityColor,
              backgroundColor: `${popularityColor}20`, // Light transparent background
            };

            return (
              <div
                key={product.id}
                className="absolute w-[260px] h-[370px] flex flex-col justify-between items-center p-4 rounded-2xl border transition-all duration-300 ease-in-out group"
                style={styles}
              >
                {/* Border Glow Effect on Hover */}
                <div
                  className="absolute inset-0 rounded-xl border-2 opacity-0 group-hover:opacity-60 group-hover:shadow-[0_0_15px] transition duration-300 pointer-events-none"
                  style={{
                    borderColor: popularityColor,
                    boxShadow: `0 0 15px ${popularityColor}`,
                  }}
                ></div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 truncate">
                    {product.description.length > 50
                      ? product.description.slice(0, 50) + "..."
                      : product.description}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-400 mb-1">
                    Price: ${product.price.toFixed(2)}
                  </p>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    Sales: {product.salesPercentage}%
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <span
                    className="mt-2 px-4 py-1 rounded-full text-white text-sm font-medium"
                    style={{
                      backgroundColor: popularityColor,
                    }}
                  >
                    Popularity: {product.popularity}
                  </span>
                  {product.updateDate && (
                    <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
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
