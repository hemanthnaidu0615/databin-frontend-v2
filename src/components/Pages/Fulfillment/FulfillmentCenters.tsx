import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';

const centerData = [
  {
    center: 'New York',
    orders: 125,
    avgTime: '1.5 days',
    onTimeRate: 95,
    capacity: 82,
  },
  {
    center: 'Chicago',
    orders: 93,
    avgTime: '1.8 days',
    onTimeRate: 92,
    capacity: 68,
  },
  {
    center: 'Los Angeles',
    orders: 129,
    avgTime: '1.9 days',
    onTimeRate: 87,
    capacity: 93,
  },
  {
    center: 'Dallas',
    orders: 112,
    avgTime: '2.0 days',
    onTimeRate: 89,
    capacity: 76,
  },
  {
    center: 'San Francisco',
    orders: 105,
    avgTime: '1.7 days',
    onTimeRate: 94,
    capacity: 85,
  },
];

const getRateSeverity = (rate: number) => {
  if (rate >= 95) return 'success';
  if (rate >= 90) return 'info';
  if (rate >= 85) return 'warning';
  return 'danger';
};

const FulfillmentCenters = () => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-10">Fulfillment Center Performance</h2>
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 p-4">
        <DataTable
          value={centerData}
          paginator={false}
          rows={5}
          responsiveLayout="scroll"
          className="p-datatable-sm"
          style={{ height: '300px', width: '101%' }} // Increased table size
        >
          <Column field="center" header="Center" style={{ width: '25%' }} />
          <Column field="orders" header="Orders" style={{ width: '15%' }} />
          <Column field="avgTime" header="Avg Time" style={{ width: '15%' }} />
          <Column
            header="On-Time Rate"
            body={(rowData) => (
              <Tag
                value={`${rowData.onTimeRate}%`}
                severity={getRateSeverity(rowData.onTimeRate)}
              />
            )}
            style={{ width: '15%' }}
          />
          <Column
            header="Capacity"
            body={(rowData) => (
              <ProgressBar value={rowData.capacity} showValue={true} className="h-2 rounded-md" />
            )}
            style={{ width: '30%' }}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default FulfillmentCenters;
