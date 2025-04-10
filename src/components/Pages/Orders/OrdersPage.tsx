import React, { useState, useMemo } from 'react';
import OrderFilters from './OrderFilters';
import OrderList from './OrderList';
import { orders as allOrders } from './ordersData';

const defaultFilterValues = {
  dateRange: 'Last 30 days',
  status: 'All statuses',
  orderType: 'All types',
  paymentMethod: 'All methods',
  priceRange: 'All prices',
  carrier: 'All carriers',
  customer: '',
  orderId: '',
};

const OrdersPage: React.FC = () => {
  const [filters, setFilters] = useState(defaultFilterValues);
  const [tempFilters, setTempFilters] = useState(defaultFilterValues);

  const handleFilterChange = (field: string, value: string) => {
    setTempFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
  };

  const handleResetFilters = () => {
    setTempFilters(defaultFilterValues);
    setFilters(defaultFilterValues);
  };

  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      const match = (field: string, filterKey: string) => {
        const filterValue = filters[filterKey as keyof typeof filters].toLowerCase();
        if (filterValue === '' || filterValue.startsWith('all')) return true;

        const fieldValue = order[field as keyof typeof order];

        // Check for direct string matches (customer, id, paymentMethod)
        if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(filterValue);
        }

        // Special cases for nested product info
        if (field === 'status') {
          return order.products?.some((p) =>
            p.status.toLowerCase().includes(filterValue)
          );
        }

        if (field === 'product') {
          return order.products?.some((p) =>
            p.name.toLowerCase().includes(filterValue)
          );
        }

        return false;
      };

      return (
        match('status', 'status') &&
        match('paymentMethod', 'paymentMethod') &&
        match('customer', 'customer') &&
        match('id', 'orderId')
      );
    });
  }, [filters]);

  return (
    <div className="p-6 dark:bg-white/[0.03] dark:text-white/90">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Orders</h1>

        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm border border-white/20 text-white rounded-md hover:bg-white/10 transition">
            Export
          </button>
          <button className="px-4 py-2 text-sm border border-white/20 text-white rounded-md hover:bg-white/10 transition">
            Print
          </button>
          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            + New Order
          </button>
        </div>
      </div>

      <OrderFilters
        filters={tempFilters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onApply={handleApplyFilters}
      />

      <div className="mt-6">
        <OrderList orders={filteredOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
