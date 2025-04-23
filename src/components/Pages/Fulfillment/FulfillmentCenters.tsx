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
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Fulfillment Center Performance</h2>
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 p-4">
        <DataTable
          value={centerData}
          paginator={false}
          rows={5}
          responsiveLayout="scroll"
          className="p-datatable-sm"
        >
          <Column field="center" header="Center" />
          <Column field="orders" header="Orders" />
          <Column field="avgTime" header="Avg Time" />
          <Column
            header="On-Time Rate"
            body={(rowData) => (
              <Tag
                value={`${rowData.onTimeRate}%`}
                severity={getRateSeverity(rowData.onTimeRate)}
              />
            )}
          />
          <Column
            header="Capacity"
            body={(rowData) => (
              <ProgressBar value={rowData.capacity} showValue={false} className="h-2 rounded-md" />
            )}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default FulfillmentCenters;
