import React, { useState, useEffect } from 'react';
import { Paginator } from 'primereact/paginator';
import 'primereact/resources/themes/lara-dark-indigo/theme.css'; // Or light theme
import 'primereact/resources/primereact.min.css';

const InventoryTable = () => {
  const [inventoryItems, setInventoryItems] = useState<
    {
      name: string;
      sku: string;
      category: string;
      stock: number;
      warehouse: string;
      status: string;
      updated: string;
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
    },
    {
      name: 'Running Shoes',
      sku: 'RS-210',
      category: 'Apparel',
      stock: 15,
      warehouse: 'South',
      status: 'Low Stock',
      updated: '2025-04-16',
    },
    {
      name: 'Coffee Mug',
      sku: 'CM-019',
      category: 'Kitchen',
      stock: 0,
      warehouse: 'East',
      status: 'Out of Stock',
      updated: '2025-04-10',
    },
    {
      name: 'Smartwatch',
      sku: 'SW-002',
      category: 'Electronics',
      stock: 80,
      warehouse: 'West',
      status: 'In Stock',
      updated: '2025-04-14',
    },
    {
      name: 'Bluetooth Speaker',
      sku: 'BS-123',
      category: 'Electronics',
      stock: 5,
      warehouse: 'East',
      status: 'Low Stock',
      updated: '2025-04-12',
    },
    {
      name: 'Gaming Mouse',
      sku: 'GM-456',
      category: 'Electronics',
      stock: 0,
      warehouse: 'North',
      status: 'Out of Stock',
      updated: '2025-04-11',
    },
    {
        name: 'LED Monitor',
        sku: 'LM-321',
        category: 'Electronics',
        stock: 42,
        warehouse: 'West',
        status: 'In Stock',
        updated: '2025-04-16',
      },
      {
        name: 'Yoga Mat',
        sku: 'YM-876',
        category: 'Fitness',
        stock: 3,
        warehouse: 'South',
        status: 'Low Stock',
        updated: '2025-04-15',
      },
      {
        name: 'Water Bottle',
        sku: 'WB-654',
        category: 'Kitchen',
        stock: 0,
        warehouse: 'North',
        status: 'Out of Stock',
        updated: '2025-04-13',
      },
      {
        name: 'Desk Lamp',
        sku: 'DL-432',
        category: 'Home Decor',
        stock: 60,
        warehouse: 'East',
        status: 'In Stock',
        updated: '2025-04-16',
      },
      {
        name: 'Graphic T-Shirt',
        sku: 'GT-777',
        category: 'Apparel',
        stock: 20,
        warehouse: 'South',
        status: 'In Stock',
        updated: '2025-04-14',
      },
      {
        name: 'Portable Charger',
        sku: 'PC-999',
        category: 'Electronics',
        stock: 7,
        warehouse: 'West',
        status: 'Low Stock',
        updated: '2025-04-15',
      },
  ];

  useEffect(() => {
    const filtered = fullInventory.filter(
      (item) =>
        item.name.toLowerCase().includes(productSearch.toLowerCase()) &&
        item.sku.toLowerCase().includes(skuSearch.toLowerCase())
    );
    const paginated = filtered.slice(first, first + rows);
    setInventoryItems(paginated);
  }, [productSearch, skuSearch, first, rows]);

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

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
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

      <div className="overflow-hidden">
        {/* Desktop Table */}
        <table className="hidden md:table min-w-full text-sm text-left">
          <thead className="text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
            <tr>
              <th className="py-2">Product Name</th>
              <th className="py-2">SKU</th>
              <th className="py-2">Category</th>
              <th className="py-2">Warehouse</th>
              <th className="py-2">Stock Level</th>
              <th className="py-2">Status</th>
              <th className="py-2">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map((item, idx) => {
              const percent = getBarWidth(item.stock);
              const barColor = barColors[item.status as keyof typeof barColors];

              return (
                <tr key={idx} className="border-t dark:border-gray-700">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2">{item.sku}</td>
                  <td className="py-2">{item.category}</td>
                  <td className="py-2">{item.warehouse}</td>
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

        {/* Mobile View */}
        <div className="md:hidden flex flex-col gap-4">
          {inventoryItems.map((item, idx) => {
            const percent = getBarWidth(item.stock);
            const barColor = barColors[item.status as keyof typeof barColors];

            return (
              <div key={idx} className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow border dark:border-gray-600">
                <div className="text-base font-semibold text-gray-800 dark:text-white mb-2">{item.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300"><strong>SKU:</strong> {item.sku}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300"><strong>Category:</strong> {item.category}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300"><strong>Warehouse:</strong> {item.warehouse}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-2"><strong>Stock Level:</strong></div>
                <div className="h-1.5 w-full bg-gray-300 dark:bg-gray-600 rounded-full mb-2">
                  <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${percent}%` }}></div>
                </div>
                <div className={`text-sm font-medium ${statusColors[item.status as keyof typeof statusColors]}`}>
                  {item.status}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last Updated: {item.updated}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <Paginator
          first={first}
          rows={rows}
          totalRecords={
            fullInventory.filter(
              (item) =>
                item.name.toLowerCase().includes(productSearch.toLowerCase()) &&
                item.sku.toLowerCase().includes(skuSearch.toLowerCase())
            ).length
          }
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
