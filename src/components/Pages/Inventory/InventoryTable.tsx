import React, { useState, useEffect } from 'react';
import { Paginator } from 'primereact/paginator';
import 'primereact/resources/themes/lara-dark-indigo/theme.css';
import 'primereact/resources/primereact.min.css';

interface Filters {
  selectedRegion: string;
  selectedSource: string;
  selectedLocation: string;
}

interface InventoryTableProps {
  filters: Filters;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ filters }) => {
  const [inventoryItems, setInventoryItems] = useState<
    {
      name: string;
      sku: string;
      category: string;
      stock: number;
      warehouse: string;
      status: string;
      updated: string;
      source: string;
      states: string;
    }[]
  >([]);

  const [productSearch, setProductSearch] = useState('');
  const [skuSearch, setSkuSearch] = useState('');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);

  const fullInventory = [
    {
      name: 'Wireless Headphones',
      sku: 'WH-001',
      category: 'Electronics',
      stock: 125,
      warehouse: 'North',
      status: 'In Stock',
      updated: '2025-04-15',
      source: 'Warehouse',
      states: 'CA, TX, NY',
    },
    {
      name: 'Running Shoes',
      sku: 'RS-210',
      category: 'Apparel',
      stock: 15,
      warehouse: 'South',
      status: 'Low Stock',
      updated: '2025-04-16',
      source: 'Warehouse',
      states: 'FL, GA',
    },

    {
      name: 'Bluetooth Speaker',
      sku: 'BS-345',
      category: 'Electronics',
      stock: 90,
      warehouse: 'East',
      status: 'In Stock',
      updated: '2025-04-12',
      source: 'Warehouse',
      states: 'NY, MA',
    },
    {
      name: 'Yoga Mat',
      sku: 'YM-101',
      category: 'Fitness',
      stock: 20,
      warehouse: 'West',
      status: 'Low Stock',
      updated: '2025-04-13',
      source: 'Warehouse',
      states: 'CA, AZ',
    },
    {
      name: 'Laptop Backpack',
      sku: 'LB-998',
      category: 'Accessories',
      stock: 0,
      warehouse: 'North',
      status: 'Out of Stock',
      updated: '2025-04-11',
      source: 'Warehouse',
      states: 'IL, WI',
    },
    {
      name: 'Ceramic Plate Set',
      sku: 'CP-712',
      category: 'Kitchen',
      stock: 60,
      warehouse: 'South',
      status: 'In Stock',
      updated: '2025-04-15',
      source: 'Warehouse',
      states: 'FL, NC',
    },
    {
      name: 'LED Desk Lamp',
      sku: 'DL-407',
      category: 'Home',
      stock: 5,
      warehouse: 'East',
      status: 'Low Stock',
      updated: '2025-04-17',
      source: 'Warehouse',
      states: 'PA, NJ',
    },
    {
      name: 'Men’s T-Shirt',
      sku: 'MT-334',
      category: 'Apparel',
      stock: 110,
      warehouse: 'West',
      status: 'In Stock',
      updated: '2025-04-18',
      source: 'Warehouse',
      states: 'NV, CA',
    },
    {
      name: 'Electric Toothbrush',
      sku: 'ET-566',
      category: 'Personal Care',
      stock: 0,
      warehouse: 'North',
      status: 'Out of Stock',
      updated: '2025-04-10',
      source: 'Warehouse',
      states: 'OH, MI',
    },
    {
      name: 'Baking Tray',
      sku: 'BT-909',
      category: 'Kitchen',
      stock: 35,
      warehouse: 'South',
      status: 'Low Stock',
      updated: '2025-04-14',
      source: 'Warehouse',
      states: 'TX, OK',
    },
    {
      name: 'Noise Cancelling Earbuds',
      sku: 'NE-321',
      category: 'Electronics',
      stock: 140,
      warehouse: 'West',
      status: 'In Stock',
      updated: '2025-04-15',
      source: 'Warehouse',
      states: 'CA, OR',
    },
    {
      name: 'Hiking Boots',
      sku: 'HB-754',
      category: 'Footwear',
      stock: 45,
      warehouse: 'East',
      status: 'Low Stock',
      updated: '2025-04-16',
      source: 'Warehouse',
      states: 'VA, MD',
    },
    
  ];

  useEffect(() => {
    const filtered = fullInventory.filter(
      (item) =>
        item.name.toLowerCase().includes(productSearch.toLowerCase()) &&
        item.sku.toLowerCase().includes(skuSearch.toLowerCase()) &&
        (!filters.selectedRegion || item.warehouse === filters.selectedRegion) &&
        (!filters.selectedSource || item.source === filters.selectedSource) &&
        (!filters.selectedLocation || item.states.includes(filters.selectedLocation))
    );

    const paginated = filtered.slice(first, first + rows);
    setInventoryItems(paginated);
  }, [productSearch, skuSearch, first, rows, filters]);

  const statusColors = {
    'In Stock': 'text-green-500',
    'Low Stock': 'text-yellow-500',
    'Out of Stock': 'text-red-500',
  };

  const barColors = {
    'In Stock': 'bg-teal-400',
    'Low Stock': 'bg-orange-400',
    'Out of Stock': 'bg-pink-500',
  };

  const getBarWidth = (stock: number): number => {
    if (stock >= 100) return 100;
    if (stock >= 50) return 70;
    if (stock > 0) return 30;
    return 0;
  };

  const totalRecords = fullInventory.filter(
    (item) =>
      item.name.toLowerCase().includes(productSearch.toLowerCase()) &&
      item.sku.toLowerCase().includes(skuSearch.toLowerCase()) &&
      (!filters.selectedRegion || item.warehouse === filters.selectedRegion) &&
      (!filters.selectedSource || item.source === filters.selectedSource) &&
      (!filters.selectedLocation || item.states.includes(filters.selectedLocation))
  ).length;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      {/* Filters */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Inventory List</h3>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search Product"
            className="px-2 py-1 text-sm border dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search SKU"
            className="px-2 py-1 text-sm border dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white"
            value={skuSearch}
            onChange={(e) => setSkuSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table: Desktop */}
      <div className="overflow-hidden">
        <table className="hidden md:table min-w-full text-sm text-left">
          <thead className="text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
            <tr>
              <th className="py-2">Product Name</th>
              <th className="py-2">SKU</th>
              <th className="py-2">Category</th>
              <th className="py-2">Warehouse</th>
              <th className="py-2">Source</th>
              <th className="py-2">State</th>
              <th className="py-2">Stock Level</th>
              <th className="py-2">Status</th>
              <th className="py-2">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map((item, idx) => {
              const percent = getBarWidth(item.stock);
              const barColor = barColors[item.status as keyof typeof barColors];
              const state = item.states || '—';

              return (
                <tr key={idx} className="border-t dark:border-gray-700">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2">{item.sku}</td>
                  <td className="py-2">{item.category}</td>
                  <td className="py-2">{item.warehouse}</td>
                  <td className="py-2">{item.source}</td>
                  <td className="py-2">{state}</td>
                  <td className="py-2 w-45">
                    <div className="h-1.5 w-full bg-gray-300 dark:bg-gray-700 rounded-full">
                      <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${percent}%` }}></div>
                    </div>
                  </td>
                  <td className={`py-2 pl-4 font-medium ${statusColors[item.status as keyof typeof statusColors]}`}>
                    {item.status}
                  </td>
                  <td className="py-2">{item.updated}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Paginator
          first={first}
          rows={rows}
          totalRecords={totalRecords}
          onPageChange={(e) => {
            setFirst(e.first);
            setRows(e.rows);
          }}
          template="PrevPageLink PageLinks NextPageLink"
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>
    </div>
  );
};

export default InventoryTable;