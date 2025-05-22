import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { axiosInstance } from "../../axios";

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
  const usdAmount = convertToUSD(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdAmount);
}

interface Order {
  order_id: number;
  product_name: string;
  category_name: string;
  unit_price: number;
  shipment_status: "Delivered" | "Pending" | "Canceled";
  order_type: "Online" | "In-Store" | "Wholesale";
}

export default function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching recent orders...");

    const fetchRecentOrders = async () => {
      try {
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        const params = new URLSearchParams({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        });

        if (enterpriseKey && enterpriseKey !== "All") {
          params.append("enterpriseKey", enterpriseKey);
        }

        const response = await axiosInstance.get(
          `/orders/recent-orders?${params.toString()}`
        );
        const rawData = response.data;

        const data: Order[] = Array.isArray(rawData)
          ? rawData
          : (typeof rawData === "object" && rawData !== null && "orders" in rawData && Array.isArray((rawData as any).orders)
            ? (rawData as { orders: Order[] }).orders
            : []);

        const processedOrders = data.map((order) => ({
          ...order,
          price:
            typeof order.unit_price === "number"
              ? order.unit_price
              : parseFloat(order.unit_price) || 0,
        }));

        setOrders(processedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again.");
      }
    };

    if (startDate && endDate) {
      fetchRecentOrders();
    }
  }, [startDate, endDate, enterpriseKey]);

  function handleViewMore() {
    navigate("/orders");
  }

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden rounded-xl border border-gray-200 bg-white px-3 pb-3 pt-3 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between mb-3">
        <h2 className="app-subheading">
          Recent Orders
        </h2>
        <button
          onClick={handleViewMore}
          className="text-xs font-medium hover:underline"
          style={{ color: "#9614d0" }}
        >
          View More
        </button>
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
                    {order.category_name}
                  </TableCell>
                  <TableCell className="py-2 px-3 text-xs text-gray-500 dark:text-gray-400 text-center whitespace-nowrap">
                    {formatUSD(order.unit_price)}
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
