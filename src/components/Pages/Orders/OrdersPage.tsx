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
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Orders</h1>


      <div className="flex flex-nowrap gap-1.5 overflow-x-auto no-scrollbar sm:flex-wrap sm:gap-2 sm:overflow-visible">
  <button className="px-2 py-1 text-[11px] border border-white/20 text-white rounded-md hover:bg-white/10 transition whitespace-nowrap sm:px-4 sm:py-2 sm:text-sm">
    Export
  </button>
  <button className="px-2 py-1 text-[11px] border border-white/20 text-white rounded-md hover:bg-white/10 transition whitespace-nowrap sm:px-4 sm:py-2 sm:text-sm">
    Print
  </button>
  <button className="px-2 py-1 text-[11px] bg-[#9614d0] text-white rounded-md hover:bg-[#660094] transition whitespace-nowrap sm:px-4 sm:py-2 sm:text-sm">
    + Order
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
