import React from 'react';
import InventoryCards from './InventoryCards';
import InventoryOverview from './InventoryOverview';
import InventoryTable from './InventoryTable';

const InventoryPage = () => {
  return (
    <div className="p-4 space-y-6">
      {/* Section 1: Top Summary Cards */}
      <InventoryCards />

      {/* Section 2: Overview Charts (Warehouse + Turnover) */}
      <InventoryOverview />

      {/* Section 3: Full Inventory List Table */}
      <InventoryTable />
    </div>
  );
};

export default InventoryPage;
