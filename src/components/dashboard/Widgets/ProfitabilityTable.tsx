import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import { Dropdown } from "../../ui/dropdown/Dropdown";
import { DropdownItem } from "../../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../../icons";

interface ProductData {
  id: number;
  name: string;
  totalSales: number;
}

const tableData: ProductData[] = [
  { id: 1, name: "MacBook Pro 13\"", totalSales: 1200 },
  { id: 2, name: "Apple Watch Ultra", totalSales: 980 },
  { id: 3, name: "iPhone 15 Pro Max", totalSales: 870 },
  { id: 4, name: "iPad Pro 3rd Gen", totalSales: 760 },
  { id: 5, name: "AirPods Pro 2nd Gen", totalSales: 650 },
];

const ProfitabilityTable: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const closeDropdown = () => setIsDropdownOpen(false);
  const removeChart = () => console.log("Remove Chart");

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900 p-5 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Best Selling Products</h3>
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <MoreDotIcon className="text-gray-500 dark:text-gray-400 size-6" />
          </button>
          {isDropdownOpen && (
            <Dropdown isOpen={isDropdownOpen} onClose={closeDropdown} className="w-40 p-2">
              <DropdownItem onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700">
                View More
              </DropdownItem>
              <DropdownItem onItemClick={removeChart} className="flex w-full font-normal text-left text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700">
                Remove
              </DropdownItem>
            </Dropdown>
          )}
        </div>
      </div>

      <Table className="w-full">
        <TableHeader className="border-b border-gray-200 dark:border-gray-700">
          <TableRow>
            <TableCell isHeader className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
              Product Name
            </TableCell>
            <TableCell isHeader className="py-3 px-4 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
              Total Sales
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((product) => (
            <TableRow key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <TableCell className="py-3 px-4 text-gray-800 dark:text-white">
                {product.name}
              </TableCell>
              <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-300 text-center">
                {product.totalSales}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProfitabilityTable;
