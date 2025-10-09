import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../axios';
import CommonButton from '../modularity/buttons/Button';
import Badge from '../ui/badge/Badge';
import { ProgressSpinner } from 'primereact/progressspinner';
import { FaTable } from 'react-icons/fa';
import { Dialog } from 'primereact/dialog';
import { useIsMobile } from '../modularity/tables/useIsMobile';
import ExportIcon from './../../images/export.png';
// Assuming useTheme is available via a similar import path or globally
import { useTheme } from 'next-themes'; 

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
};

const convertToUSD = (rupees: number) => rupees * 0.012;
const formatUSD = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convertToUSD(amount));

export default function RecentOrders() {
  const { theme } = useTheme(); // 💡 Import and use theme
  const isDark = theme === 'dark'; // 💡 Determine dark mode
    
  const isMobile = useIsMobile();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showDialog, setShowDialog] = useState(false);
  const [dialogPage, setDialogPage] = useState(0);
  const [dialogRows] = useState(10);
  const [dialogOrders, setDialogOrders] = useState<any[]>([]);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogTotalRecords, setDialogTotalRecords] = useState(0);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const navigate = useNavigate();

  useEffect(() => {
    if (showDialog) document.documentElement.classList.add('modal-open');
    else document.documentElement.classList.remove('modal-open');
    return () => document.documentElement.classList.remove('modal-open');
  }, [showDialog]);

  const fetchOrders = async ({
    page,
    size,
  }: {
    page: number;
    size: number;
  }) => {
    if (!dateRange?.[0] || !dateRange?.[1]) return;
    const [start, end] = [formatDate(dateRange[0]), formatDate(dateRange[1])];
    const params = new URLSearchParams({
      startDate: start,
      endDate: end,
      page: page.toString(),
      size: size.toString(),
      sortField: 'order_date',
      sortOrder: 'desc',
    });
    if (enterpriseKey && enterpriseKey !== 'All') {
      params.append('enterpriseKey', enterpriseKey);
    }

    setLoading(true);
    try {
      const res = await axiosInstance.get(`/orders/recent-orders?${params}`);
      setOrders(res.data.data || []);
    } catch (err) {
      console.error('Failed loading orders', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDialogOrders = async ({
    page,
    size,
  }: {
    page: number;
    size: number;
  }) => {
    if (!dateRange?.[0] || !dateRange?.[1]) return;
    const [start, end] = [formatDate(dateRange[0]), formatDate(dateRange[1])];
    const params = new URLSearchParams({
      startDate: start,
      endDate: end,
      page: page.toString(),
      size: size.toString(),
      sortField: 'order_date',
      sortOrder: 'desc',
    });
    if (enterpriseKey && enterpriseKey !== 'All') {
      params.append('enterpriseKey', enterpriseKey);
    }

    setDialogLoading(true);
    try {
      const res = await axiosInstance.get(`/orders/recent-orders?${params}`);
      setDialogOrders(res.data.data || []);
      setDialogTotalRecords(res.data.count || 0);
    } catch (err) {
      console.error('Failed loading dialog orders', err);
      setDialogOrders([]);
    } finally {
      setDialogLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders({ page: 0, size: 5 });
  }, [dateRange, enterpriseKey]);

  useEffect(() => {
    if (showDialog) {
      fetchDialogOrders({
        page: dialogPage,
        size: dialogRows,
      });
    }
  }, [showDialog, dialogPage, dateRange, enterpriseKey]);

  const shipmentStatusBody = (status: string) => (
    <Badge
      color={
        status === 'Delivered'
          ? 'success'
          : status === 'Pending'
          ? 'warning'
          : 'error'
      }
    >
      {status}
    </Badge>
  );

  const handleViewMore = () => {
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    navigate('/orders');
  };

  const renderTable = (data: any[]) => (
    <div className="overflow-x-auto border rounded-md border-gray-200 dark:border-gray-700"> {/* 💡 Updated border color */}
      <table className="min-w-full text-sm text-left border-collapse border border-gray-200 dark:border-gray-700"> {/* 💡 Updated border color */}
        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"> {/* 💡 Updated header background and text color */}
          <tr>
            <th className="border border-gray-200 dark:border-gray-700 px-3 py-2">Product Name</th> {/* 💡 Updated border color */}
            <th className="border border-gray-200 dark:border-gray-700 px-3 py-2">Category</th> {/* 💡 Updated border color */}
            <th className="border border-gray-200 dark:border-gray-700 px-3 py-2">Price (USD)</th> {/* 💡 Updated border color */}
            <th className="border border-gray-200 dark:border-gray-700 px-3 py-2">Shipment Status</th> {/* 💡 Updated border color */}
            <th className="border border-gray-200 dark:border-gray-700 px-3 py-2">Order Type</th> {/* 💡 Updated border color */}
          </tr>
        </thead>
        <tbody className="text-gray-900 dark:text-gray-300 bg-white dark:bg-gray-900"> {/* 💡 Set default/dark body background and text color */}
          {data.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4 border border-gray-200 dark:border-gray-700"> {/* 💡 Updated border color */}
                No orders found.
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"> {/* 💡 Updated border/hover colors */}
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">{row.product_name}</td> {/* 💡 Updated border color */}
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">{row.category_name}</td> {/* 💡 Updated border color */}
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">{formatUSD(row.unit_price)}</td> {/* 💡 Updated border color */}
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2"> {/* 💡 Updated border color */}
                  {shipmentStatusBody(row.shipment_status)}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">{row.order_type}</td> {/* 💡 Updated border color */}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden rounded-xl border border-gray-200 bg-white px-3 pb-3 pt-3 dark:border-gray-800 dark:bg-gray-900"> {/* 💡 Changed dark:bg-white/[0.03] to dark:bg-gray-900 for solid dark background */}
      {/* Header */}
      <div className="flex justify-between items-start sm:items-center flex-wrap gap-2 mb-4">
        <h2 className="app-subheading flex-1">Recent Orders</h2>
        <div className="flex gap-2 items-center">
          <button onClick={() => alert('Exporting...')}>
            <img src={ExportIcon} alt="Export" className="w-6" />
          </button>
          <button
            onClick={() => setShowDialog(true)}
            title="Open full table"
            className="text-purple-600 px-2 py-1 text-xl"
          >
            <FaTable />
          </button>
          <CommonButton
            variant="responsive"
            onClick={handleViewMore}
            showMobile={false}
            text="View more"
          />
        </div>
      </div>

      {/* Table or Mobile View */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <ProgressSpinner />
        </div>
      ) : isMobile ? (
       
        <>
<div className='flex flex-col gap-3 pb-3'> {/* 👈 ADDED flex-col and gap-3 here */}
          {orders.map((item, idx) => (
            <div
              key={idx}
              className="p-3 border-b border-gray-200 bg-white rounded-md shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300" // 💡 Updated dark mode classes for mobile card
            >
              <div className="text-sm font-semibold">{item.product_name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400"> {/* 💡 Updated dark mode text color */}
                <div>Category: {item.category_name}</div>
                <div>Price: {formatUSD(item.unit_price)}</div>
                <div>Status: {shipmentStatusBody(item.shipment_status)}</div>
                <div>Type: {item.order_type}</div>
              </div>
            </div>
          ))}
       </div>
        </>
      ) : (
        renderTable(orders)
      )}

      {/* Dialog - Note: PrimeReact Dialog styling may require specific theming */}
      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        style={{ width: '90vw', maxWidth: '1100px' }}
        header="All Recent Orders"
        modal
        contentClassName={isDark ? 'dark:bg-gray-900 dark:text-gray-300' : ''} // 💡 Apply dark mode styles to dialog content
      >
        {dialogLoading ? (
          <div className="flex justify-center items-center py-8">
            <ProgressSpinner />
          </div>
        ) : (
          <>
            {renderTable(dialogOrders)}
            <div className="flex justify-between items-center text-sm mt-3 text-gray-600 dark:text-gray-400"> {/* 💡 Updated dark mode text color */}
              <div>
                Showing {dialogPage * dialogRows + 1} -{' '}
                {Math.min(dialogTotalRecords, (dialogPage + 1) * dialogRows)} of{' '}
                {dialogTotalRecords}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setDialogPage(0)}
                  disabled={dialogPage === 0}
                  className="px-2 py-1 bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600" // 💡 Updated dark mode button colors
                >
                  ⏮
                </button>
                <button
                  onClick={() => setDialogPage(Math.max(0, dialogPage - 1))}
                  disabled={dialogPage === 0}
                  className="px-2 py-1 bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600" // 💡 Updated dark mode button colors
                >
                  Prev
                </button>
                <button
                  onClick={() =>
                    setDialogPage((prev) =>
                      prev + 1 < Math.ceil(dialogTotalRecords / dialogRows)
                        ? prev + 1
                        : prev
                    )
                  }
                  disabled={
                    dialogPage + 1 >= Math.ceil(dialogTotalRecords / dialogRows)
                  }
                  className="px-2 py-1 bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600" // 💡 Updated dark mode button colors
                >
                  Next
                </button>
                <button
                  onClick={() =>
                    setDialogPage(
                      Math.ceil(dialogTotalRecords / dialogRows) - 1
                    )
                  }
                  disabled={
                    dialogPage + 1 >= Math.ceil(dialogTotalRecords / dialogRows)
                  }
                  className="px-2 py-1 bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600" // 💡 Updated dark mode button colors
                >
                  ⏭
                </button>
              </div>
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}