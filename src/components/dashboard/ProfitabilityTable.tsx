import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

interface ProductData {
  id: number;
  name: string;
  salesPercentage: number;
  popularity: number; // Value between 0 and 100
}

// Updated with 5 products
const productData: ProductData[] = [
  { id: 1, name: "Home Decor Range", salesPercentage: 46, popularity: 85 },
  { id: 2, name: "Disney Princess Dress", salesPercentage: 17, popularity: 42 },
  { id: 3, name: "Bathroom Essentials", salesPercentage: 19, popularity: 58 },
  { id: 4, name: "Apple Smartwatch", salesPercentage: 29, popularity: 25 },
  { id: 5, name: "Wireless Headphones", salesPercentage: 33, popularity: 72 },
];

// Function to get color based on popularity range
const getPopularityColor = (popularity: number) => {
  if (popularity <= 30) return "#EF4444"; // Red for Low Popularity
  if (popularity <= 60) return "#3B82F6"; // Blue for Medium Popularity
  return "#22C55E"; // Green for High Popularity
};

const ProfitabilityTable: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const closeDropdown = () => setIsDropdownOpen(false);
  const removeWidget = () => console.log("Remove Widget");

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900 p-5 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Top Products
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
              {/* Ranking and Product Name */}
              <div className="flex items-center space-x-3 w-1/4">
                <span className="text-gray-500 dark:text-gray-400 font-medium">{`0${index + 1}`}</span>
                <span className="text-gray-800 dark:text-white">{product.name}</span>
              </div>

              {/* Popularity Bar */}
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

                {/* Sales Percentage Badge - Matches Popularity Bar */}
                <span
                  className="px-3 py-1 rounded-md text-white text-sm font-medium"
                  style={{
                    backgroundColor: barColor, // Match bar color
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
