import React, { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

interface ProductData {
  id: number;
  name: string;
  salesPercentage: number;
  popularity: number; // Value between 0 and 100
}

const getPopularityColor = (popularity: number) => {
  if (popularity <= 30) return "#EF4444";
  if (popularity <= 60) return "#3B82F6";
  return "#22C55E";
};

const ProfitabilityTable: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [productData, setProductData] = useState<ProductData[]>([]);

  const closeDropdown = () => setIsDropdownOpen(false);
  const removeWidget = () => console.log("Remove Widget");

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/top-sellers/top-products");
        const json = await response.json();

        if (json.top_products && Array.isArray(json.top_products)) {
          const transformed = json.top_products.map((product: any, index: number) => ({
            id: index + 1,
            name: product.product_name,
            salesPercentage: parseFloat(product.percentage), // e.g. "8.00%" => 8
            popularity: Math.floor(Math.random() * 100), // You can replace this with actual logic if needed
          }));

          setProductData(transformed);
        }
      } catch (error) {
        console.error("Failed to fetch top products:", error);
      }
    };

    fetchTopProducts();
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900 p-10 w-full">
      <div className="flex items-center justify-between mb-13">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
        ProfitabilityTable
        </h3>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <MoreDotIcon className="text-gray-500 dark:text-gray-400 size-6" />
          </button>
          {isDropdownOpen && (
            <Dropdown isOpen={isDropdownOpen} onClose={closeDropdown} className="w-40 p-2">
              <DropdownItem onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700">
                View More
              </DropdownItem>
              <DropdownItem onItemClick={removeWidget} className="flex w-full font-normal text-left text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700">
                Remove
              </DropdownItem>
            </Dropdown>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {productData.map((product, index) => {
          const barColor = getPopularityColor(product.popularity);
          return (
            <div key={product.id} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3 w-1/4">
                <span className="text-gray-500 dark:text-gray-400 font-medium">{`0${index + 1}`}</span>
                <span className="text-gray-800 dark:text-white">{product.name}</span>
              </div>

              <div className="flex-1 flex items-center space-x-2">
                <div className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full relative">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${product.popularity}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>

                <span
                  className="px-3 py-1 rounded-md text-white text-sm font-medium"
                  style={{
                    backgroundColor: barColor,
                  }}
                >
                  {product.salesPercentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfitabilityTable;
