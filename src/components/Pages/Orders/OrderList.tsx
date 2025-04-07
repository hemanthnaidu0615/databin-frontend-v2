import  { useState } from "react";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { dummyOrders } from "./dummyOrders";

export default function OrderList() {
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((oid) => oid !== id) : [...prev, id]
    );
  };

  const getStatusTag = (status: string) => {
    const severity =
      status === "Delayed"
        ? "danger"
        : status === "Shipped"
        ? "info"
        : status === "Delivered"
        ? "success"
        : "warning";
    return <Tag value={status} severity={severity} />;
  };

  const rowClass = (order: any) => {
    if (order.status === "Delayed") return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100";
    if (order.escalated) return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100";
    if (order.flagged) return "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100";
    return "bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100";
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm overflow-auto">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">📋 Order List</h3>

      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
            <th className="p-2 text-left">
              <input
                type="checkbox"
                checked={
                  selectedOrderIds.length === dummyOrders.length &&
                  dummyOrders.length > 0
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedOrderIds(dummyOrders.map((order) => Number(order.id)));
                  } else {
                    setSelectedOrderIds([]);
                  }
                }}
              />
            </th>
            <th className="p-2 text-left">Order ID</th>
            <th className="p-2 text-left">Customer</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Delivery ETA</th>
            <th className="p-2 text-left">Actual Delivery</th>
            <th className="p-2 text-left">Stage</th>
            <th className="p-2 text-left">Total Value</th>
            <th className="p-2 text-left">Origin</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {dummyOrders.map((order) => (
            <tr key={order.id} className={`${rowClass(order)} border-b border-gray-200 dark:border-gray-700`}>
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={selectedOrderIds.includes(Number(order.id))}
                  onChange={() => toggleSelect(Number(order.id))}
                />
              </td>
              <td className="p-2">{order.orderId}</td>
              <td className="p-2">{order.customerName}</td>
              <td className="p-2">{getStatusTag(order.status)}</td>
              <td className="p-2">{order.deliveryEta}</td>
              <td className="p-2">{order.actualDelivery}</td>
              <td className="p-2">{order.fulfillmentStage}</td>
              <td className="p-2">${Number(order.totalValue).toFixed(2)}</td>
              <td className="p-2">{order.origin}</td>
              <td className="p-2">
                <div className="flex gap-2">
                  <Button icon="pi pi-eye" className="p-button-sm p-button-text" tooltip="View" />
                  <Button icon="pi pi-map-marker" className="p-button-sm p-button-text" tooltip="Track" />
                  <Button icon="pi pi-exclamation-triangle" className="p-button-sm p-button-text" tooltip="Escalate" />
                  <Button icon="pi pi-flag" className="p-button-sm p-button-text" tooltip="Flag" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
