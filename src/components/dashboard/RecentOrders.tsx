import { useState, useEffect } from "react";
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

interface Order {
  order_id: number;
  product_name: string;
  category: string;
  price: number;
  shipment_status: "Delivered" | "Pending" | "Canceled";
  order_type: "Online" | "In-Store" | "Wholesale";
}

export default function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching recent orders...");

    fetch("http://localhost:8080/api/orders/recent-orders")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Order[]) => {
        // Ensure price is a valid number
        const processedOrders = data.map((order) => ({
          ...order,
          price:
            typeof order.price === "number"
              ? order.price
              : parseFloat(order.price) || 0,
        }));
        console.log("Received orders:", processedOrders);
        setOrders(processedOrders);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again.");
      });
  }, []);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white px-3 pb-3 pt-3 dark:border-gray-800 dark:bg-white/[0.03] w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
          Recent Orders
        </h3>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-36 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Remove
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="w-full">
        <Table className="w-full table-fixed">
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 w-3/12 min-w-[120px]"
              >
                Product
              </TableCell>
              <TableCell
                isHeader
                className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 w-2/12 min-w-[100px] hidden sm:table-cell"
              >
                Category
              </TableCell>
              <TableCell
                isHeader
                className="py-2 px-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 w-2/12 min-w-[90px] whitespace-nowrap"
              >
                Price
              </TableCell>
              <TableCell
                isHeader
                className="py-2 px-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 w-3/12 min-w-[100px] md:w-4/12 lg:w-2/12"
              >
                Shipment Status
              </TableCell>
              <TableCell
                isHeader
                className="py-2 px-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 w-0 min-w-[110px] hidden lg:table-cell"
              >
                Order Type
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {error ? (
              <TableRow>
                <td
                  colSpan={5}
                  className="text-center py-4 text-gray-500 dark:text-gray-400"
                >
                  No recent orders found.
                </td>
              </TableRow>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <TableRow
                  key={order.order_id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.05] transition"
                >
                  <TableCell className="py-2 px-3 text-xs text-gray-800 dark:text-white/90 break-words">
                    {order.product_name}
                  </TableCell>
                  <TableCell className="py-2 px-3 text-xs text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                    {order.category}
                  </TableCell>
                  <TableCell className="py-2 px-3 text-xs text-gray-500 dark:text-gray-400 text-center whitespace-nowrap">
                    {order.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-2 px-3 text-center">
                    <Badge
                      color={
                        order.shipment_status === "Delivered"
                          ? "success"
                          : order.shipment_status === "Pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {order.shipment_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2 px-3 text-xs text-gray-500 dark:text-gray-400 text-center hidden lg:table-cell">
                    {order.order_type}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <td
                  colSpan={5}
                  className="text-center py-4 text-gray-500 dark:text-gray-400"
                >
                  No recent orders found.
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
