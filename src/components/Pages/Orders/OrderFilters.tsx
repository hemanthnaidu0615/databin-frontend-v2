import React, { useState } from 'react';

interface OrderFiltersProps {
  filters: {
    dateRange: string;
    status: string;
    orderType: string;
    paymentMethod: string;
    priceRange: string;
    carrier: string;
    customer: string;
    orderId: string;
  };
  onFilterChange: (field: string, value: string) => void;
  onReset: () => void;
  onApply: () => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  onApply,
}) => {
  const inputStyle =
    'px-3 py-2 rounded border text-sm bg-white text-black border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500';

  const dateButtonStyle =
    'px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition';

  const [showCustomRange, setShowCustomRange] = useState(false);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const setPreset = (days: number) => {
    const today = new Date();
    const past = new Date();
    past.setDate(today.getDate() - days);
    const format = (d: Date) => d.toISOString().split('T')[0];
    onFilterChange('dateRange', `${format(past)} to ${format(today)}`);
  };

  const applyCustomRange = () => {
    if (start && end) {
      onFilterChange('dateRange', `${start} to ${end}`);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start text-sm text-white relative">
      {/* Date Range Filter with Dropdown */}
      <div className="relative">
        <button
          className={`${inputStyle} w-full text-left`}
          onClick={() => setShowCustomRange(!showCustomRange)}
        >
          {filters.dateRange || 'Select Date Range'}
        </button>

        {showCustomRange && (
          <div className="absolute z-10 mt-2 w-64 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg space-y-3">
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              Quick Ranges
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setPreset(7);
                  setShowCustomRange(false);
                }}
                className={dateButtonStyle}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => {
                  setPreset(30);
                  setShowCustomRange(false);
                }}
                className={dateButtonStyle}
              >
                Last 30 Days
              </button>
            </div>

            <div className="text-xs font-semibold text-gray-700 dark:text-gray-200 mt-2">
              Custom Range
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="date"
                className={inputStyle}
                value={start}
                onChange={(e) => setStart(e.target.value)}
                max={end || undefined}
              />
              <input
                type="date"
                className={inputStyle}
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                min={start || undefined}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCustomRange(false)}
                className="text-xs px-2 py-1 rounded bg-gray-300 dark:bg-gray-600 text-black dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  applyCustomRange();
                  setShowCustomRange(false);
                }}
                className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Other Filters */}
      <select
        className={inputStyle}
        value={filters.status}
        onChange={(e) => onFilterChange('status', e.target.value)}
      >
        <option>All statuses</option>
        <option>Delivered</option>
        <option>Pending</option>
        <option>Cancelled</option>
      </select>

      <select
        className={inputStyle}
        value={filters.orderType}
        onChange={(e) => onFilterChange('orderType', e.target.value)}
      >
        <option>All types</option>
        <option>Online</option>
        <option>In-Store</option>
      </select>

      <select
        className={inputStyle}
        value={filters.paymentMethod}
        onChange={(e) => onFilterChange('paymentMethod', e.target.value)}
      >
        <option>All methods</option>
        <option>Credit Card</option>
        <option>PayPal</option>
        <option>Cash</option>
      </select>

      <select
        className={inputStyle}
        value={filters.priceRange}
        onChange={(e) => onFilterChange('priceRange', e.target.value)}
      >
        <option>All prices</option>
        <option>Under $50</option>
        <option>$50 - $100</option>
        <option>Over $100</option>
      </select>

      <select
        className={inputStyle}
        value={filters.carrier}
        onChange={(e) => onFilterChange('carrier', e.target.value)}
      >
        <option>All carriers</option>
        <option>UPS</option>
        <option>FedEx</option>
        <option>DHL</option>
      </select>

      <input
        type="text"
        placeholder="Search customer"
        className={inputStyle}
        value={filters.customer}
        onChange={(e) => onFilterChange('customer', e.target.value)}
      />

      <input
        type="text"
        placeholder="Search order ID"
        className={inputStyle}
        value={filters.orderId}
        onChange={(e) => onFilterChange('orderId', e.target.value)}
      />

      {/* Action Buttons */}
      <div className="col-span-full flex justify-end gap-2 mt-2">
        <button
          onClick={onReset}
          className="px-4 py-2 rounded bg-gray-700 text-sm text-white hover:bg-gray-600 transition"
        >
          Reset Filters
        </button>
        <button
          onClick={onApply}
          className="px-4 py-2 rounded bg-blue-600 text-sm text-white hover:bg-blue-700 transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default OrderFilters;
