import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  status: "Delivered" | "Pending" | "Canceled";
  orderType: "Online" | "In-Store" | "Wholesale";
}

const tableData: Product[] = [
  { id: 1, name: "MacBook Pro 13\"", category: "Laptop", price: "$2399.00", status: "Delivered", orderType: "Online" },
  { id: 2, name: "Apple Watch Ultra", category: "Watch", price: "$879.00", status: "Pending", orderType: "In-Store" },
  { id: 3, name: "iPhone 15 Pro Max", category: "Smartphone", price: "$1869.00", status: "Delivered", orderType: "Wholesale" },
  { id: 4, name: "iPad Pro 3rd Gen", category: "Electronics", price: "$1699.00", status: "Canceled", orderType: "Online" },
  { id: 5, name: "AirPods Pro 2nd Gen", category: "Accessories", price: "$240.00", status: "Delivered", orderType: "In-Store" },
];

export default function RecentOrders() {
  const [isOpen, setIsOpen] = useState(false);
  function toggleDropdown() { setIsOpen(!isOpen); }
  function closeDropdown() { setIsOpen(false); }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white px-3 pb-3 pt-3 dark:border-gray-800 dark:bg-white/[0.03] w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">Recent Orders</h3>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-5" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-36 p-2">
            <DropdownItem onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">View More</DropdownItem>
            <DropdownItem onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">Remove</DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full">
        <Table className="w-full table-fixed">
        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
  <TableRow>
    <TableCell isHeader className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 w-3/12 min-w-[120px]">
      Product
    </TableCell>
    <TableCell isHeader className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 w-2/12 min-w-[100px] hidden sm:table-cell">
      Category
    </TableCell>
    <TableCell isHeader className="py-2 px-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 w-2/12 min-w-[90px] whitespace-nowrap">
      Price
    </TableCell>
    <TableCell isHeader className="py-2 px-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 w-3/12 min-w-[100px] md:w-4/12 lg:w-2/12">
      Status
    </TableCell>
    <TableCell isHeader className="py-2 px-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 w-0 min-w-[110px] hidden lg:table-cell">
      Order Type
    </TableCell>
  </TableRow>
</TableHeader>

<TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
  {tableData.map((product) => (
    <TableRow key={product.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.05] transition">
      <TableCell className="py-2 px-3 text-xs text-gray-800 dark:text-white/90 break-words">
        {product.name}
      </TableCell>
      <TableCell className="py-2 px-3 text-xs text-gray-500 dark:text-gray-400 hidden sm:table-cell">
        {product.category}
      </TableCell>
      <TableCell className="py-2 px-3 text-xs text-gray-500 dark:text-gray-400 text-center whitespace-nowrap">
        {product.price}
      </TableCell>
      <TableCell className="py-2 px-3 text-center">
        <Badge color={product.status === "Delivered" ? "success" : product.status === "Pending" ? "warning" : "error"}>
          {product.status}
        </Badge>
      </TableCell>
      <TableCell className="py-2 px-3 text-xs text-gray-500 dark:text-gray-400 text-center hidden lg:table-cell">
        {product.orderType}
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </div>
    </div>
  );
}
