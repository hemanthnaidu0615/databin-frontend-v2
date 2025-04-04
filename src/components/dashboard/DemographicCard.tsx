import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import USMap from "./CountryMap";

interface DemographicCardProps {
  onRemove?: () => void;
  onViewMore?: () => void;
}

export default function DemographicCard({ onRemove, onViewMore }: DemographicCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  const customerData = {
    returningCustomers: 320,
    newCustomers: 150,
    avgOrderValue: 75.5,
    highSpenders: 50,
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 pb-4 pt-4 w-full h-[346px]">
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Customers Demographic
          </h3>
          <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
            Orders and revenue per state
          </p>
        </div>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-36 p-2">
            <DropdownItem
              onItemClick={() => {
                closeDropdown();
                onViewMore && onViewMore();
              }}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={() => {
                closeDropdown();
                onRemove && onRemove();
              }}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Remove
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

{/* Map Section */}
<div className="border border-gray-200 dark:border-gray-800 rounded-xl w-full overflow-hidden p-3 sm:p-2 lg:p-3">
  <div id="mapOne" className="relative w-full h-[160px]">
    <div className="absolute inset-0 m-2 sm:m-3 lg:m-4">
      <USMap />
    </div>
  </div>
</div>


      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-2 mt-2 text-gray-800 dark:text-white text-xs">
  {[
    { label: "Returning vs New", value: `${customerData.returningCustomers} / ${customerData.newCustomers}` },
    { label: "Avg Order Value", value: `$${customerData.avgOrderValue.toFixed(2)}` },
    { label: "High Spenders", value: customerData.highSpenders },
  ].map((item, index) => (
    <div 
      key={index} 
      className="flex flex-col justify-between p-2 border border-gray-200 dark:border-gray-800 rounded-md h-full text-center"
    >
      <h4 className="font-medium text-[11px]">{item.label}</h4>
      <p className="text-sm font-semibold">{item.value}</p>
    </div>
  ))}
</div>

    </div>
  );
}
