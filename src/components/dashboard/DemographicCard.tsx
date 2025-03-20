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
    <div className="border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-default bg-white dark:bg-gray-900 rounded-xl w-full">
      <div className="flex justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Customers Demographic
          </h3>
          <p className="mt-1 text-gray-500 text-xs dark:text-gray-400">
            Orders and revenue per state
          </p>
        </div>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-5" />
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

      <div className="px-3 py-3 my-3 overflow-hidden border border-gray-200 dark:border-gray-800 rounded-xl sm:px-5 w-full">
        <div id="mapOne" className="h-[140px] w-full">
          <USMap />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-gray-800 dark:text-white/90 text-xs">
        {[
          { label: "Returning vs New", value: `${customerData.returningCustomers} / ${customerData.newCustomers}` },
          { label: "Avg Order Value", value: `$${customerData.avgOrderValue.toFixed(2)}` },
          { label: "High Spenders", value: customerData.highSpenders },
        ].map((item, index) => (
          <div key={index} className="p-2 border border-gray-200 dark:border-gray-800 rounded-md">
            <h4 className="font-medium">{item.label}</h4>
            <p className="text-sm font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}