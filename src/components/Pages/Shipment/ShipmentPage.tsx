// ShipmentPage.tsx
import React from 'react';
import ShipmentStats from './ShipmentStats';
import ShipmentCharts from './ShipmentCharts';
import ReactShipmentsTable from './RecentShipmentsTable';
import ShipmentTimelineChart from './ShipmentTimelineChart';

const ShipmentPage = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">📦 Shipment Analytics</h1>
        <p className="text-sm text-zinc-400">Get insights into your shipping performance and activity.</p>
      </div>

      {/* KPIs */}
      <ShipmentStats />

      {/* Charts */}
      <ShipmentCharts />

      {/* Table */}
      <ReactShipmentsTable />

      {/* Timeline */}
      <ShipmentTimelineChart />
    </div>
  );
};

export default ShipmentPage;
