import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../axios';
import CommonButton from '../modularity/buttons/Button';
import Badge from '../ui/badge/Badge';
import {
  DataTable,
  DataTablePageEvent,
  DataTableSortEvent,
  DataTableFilterEvent,
} from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { FaTable } from 'react-icons/fa';
import { useIsMobile } from '../modularity/tables/useIsMobile';
// Import the shared dialog and table components
import FilteredDataDialog from '../modularity/tables/FilteredDataDialog';
import { TableColumn } from '../modularity/tables/BaseDataTable';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import * as XLSX from "xlsx";

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
  const isMobile = useIsMobile();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const exportToXLSX = (data: any[]) => {
    const renamedData = data.map(item => ({
      "Product Name": item.product_name,
      "Category": item.category_name,
      "Price (USD)": convertToUSD(item.unit_price),
      "Shipment Status": item.shipment_status,
      "Order Type": item.order_type,
    }));
    const worksheet = XLSX.utils.json_to_sheet(renamedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Recent Orders");
    XLSX.writeFile(workbook, "recent_orders_export.xlsx");
  };

  const exportData = async () => {
    if (!dateRange?.[0] || !dateRange?.[1]) {
      alert('Date range not available. Please select a date range.');
      return;
    }
    try {
      const [start, end] = [formatDate(dateRange[0]), formatDate(dateRange[1])];
      const params = new URLSearchParams({
        startDate: start,
        endDate: end,
        sortField: 'order_date',
        sortOrder: 'desc',
        size: '100000',
      });
      if (enterpriseKey && enterpriseKey !== 'All') {
        params.append('enterpriseKey', enterpriseKey);
      }

      const currentFilters = showDialog ? dialogFilters : filters;
      Object.keys(currentFilters).forEach((key) => {
        const f = currentFilters[key];
        if (key !== 'global' && f?.value) {
          params.append(`${key}.value`, f.value);
          params.append(`${key}.matchMode`, f.matchMode);
        }
      });

      const res = await axiosInstance.get(`/orders/recent-orders?${params}`);
      const dataToExport = res.data.data || [];
      exportToXLSX(dataToExport);
    } catch (err) {
      console.error('Export failed', err);
      alert('Failed to export data.');
    }
  };

  const [filters, setFilters] = useState<any>({
    global: { value: null, matchMode: 'contains' },
    product_name: { value: null, matchMode: 'contains' },
    category_name: { value: null, matchMode: 'contains' },
    shipment_status: { value: null, matchMode: 'contains' },
    order_type: { value: null, matchMode: 'contains' },
  });
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortField, setSortField] = useState('order_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Dialog-specific states:
  const [showDialog, setShowDialog] = useState(false);
  const [dialogPage, setDialogPage] = useState(0);
  const [dialogRows, setDialogRows] = useState(10);
  const [dialogOrders, setDialogOrders] = useState<any[]>([]);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogFilters, setDialogFilters] = useState(filters);
  const [dialogSortField, setDialogSortField] = useState(sortField);
  const [dialogSortOrder, setDialogSortOrder] = useState(sortOrder);
  const [dialogTotalRecords, setDialogTotalRecords] = useState(0);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const navigate = useNavigate();

  //fix for the background scrolling issue.
  useEffect(() => {
    if (showDialog) {
      document.documentElement.classList.add('modal-open');
    } else {
      document.documentElement.classList.remove('modal-open');
    }
    return () => {
      document.documentElement.classList.remove('modal-open');
    };
  }, [showDialog]);

  // Main table fetch
  const fetchOrders = async ({
    page,
    size,
    sortField,
    sortOrder,
    filters,
  }: {
    page: number;
    size: number;
    sortField: string;
    sortOrder: string;
    filters: any;
  }) => {
    if (!dateRange?.[0] || !dateRange?.[1]) return;
    const [start, end] = [formatDate(dateRange[0]), formatDate(dateRange[1])];
    const params = new URLSearchParams({
      startDate: start,
      endDate: end,
      page: page.toString(),
      size: size.toString(),
      sortField,
      sortOrder,
    });
    if (enterpriseKey && enterpriseKey !== 'All') {
      params.append('enterpriseKey', enterpriseKey);
    }
    Object.keys(filters).forEach((key) => {
      const f = filters[key];
      if (key !== 'global' && f?.value) {
        params.append(`${key}.value`, f.value);
        params.append(`${key}.matchMode`, f.matchMode);
      }
    });

    setLoading(true);
    try {
      const res = await axiosInstance.get(`/orders/recent-orders?${params}`);
      setOrders(res.data.data || []);
      setTotalRecords(res.data.count || 0);
    } catch (err) {
      console.error('Failed loading orders', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Dialog fetch (separate)
  const fetchDialogOrders = async ({
    page,
    size,
    sortField,
    sortOrder,
    filters,
  }: {
    page: number;
    size: number;
    sortField: string;
    sortOrder: string;
    filters: any;
  }) => {
    if (!dateRange?.[0] || !dateRange?.[1]) return;
    const [start, end] = [formatDate(dateRange[0]), formatDate(dateRange[1])];
    const params = new URLSearchParams({
      startDate: start,
      endDate: end,
      page: page.toString(),
      size: size.toString(),
      sortField,
      sortOrder,
    });
    if (enterpriseKey && enterpriseKey !== 'All') {
      params.append('enterpriseKey', enterpriseKey);
    }
    Object.keys(filters).forEach((key) => {
      const f = filters[key];
      if (key !== 'global' && f?.value) {
        params.append(`${key}.value`, f.value);
        params.append(`${key}.matchMode`, f.matchMode);
      }
    });

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

  // initial & filter/sort fetch for main table
  useEffect(() => {
    fetchOrders({ page, size: rows, sortField, sortOrder, filters });
  }, [
    dateRange,
    enterpriseKey,
    page,
    rows,
    sortField,
    sortOrder,
    JSON.stringify(filters),
  ]);

  // fetch dialog data when dialog is shown or dialog params change
  useEffect(() => {
    if (showDialog) {
      fetchDialogOrders({
        page: dialogPage,
        size: dialogRows,
        sortField: dialogSortField,
        sortOrder: dialogSortOrder,
        filters: dialogFilters,
      });
    }
  }, [
    showDialog,
    dialogPage,
    dialogRows,
    dialogSortField,
    dialogSortOrder,
    JSON.stringify(dialogFilters),
    dateRange,
    enterpriseKey,
  ]);

  const renderFilterInput = (placeholder = 'Search') => {
    return (options: any) => (
      <InputText
        value={options.value || ''}
        onChange={(e) => options.filterCallback(e.target.value)}
        placeholder={placeholder}
        className="p-column-filter"
      />
    );
  };

  const shipmentStatusBody = (row: any) => (
    <Badge
      color={
        row.shipment_status === 'Delivered'
          ? 'success'
          : row.shipment_status === 'Pending'
          ? 'warning'
          : 'error'
      }
    >
      {row.shipment_status}
    </Badge>
  );

  const handleViewMore = () => {
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    navigate('/orders');
  };

  const mobileCardRender = (item: any, idx: number) => (
    <div
      key={idx}
      className="p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-md shadow-sm"
    >
      <div className="text-sm font-semibold">{item.product_name}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <div>Category: {item.category_name}</div>
        <div>Price: {formatUSD(item.unit_price)}</div>
        <div>Status: {shipmentStatusBody(item)}</div>
        <div>Type: {item.order_type}</div>
      </div>
    </div>
  );

  // Main Table pagination helpers
  const getFirstRecord = () => (totalRecords === 0 ? 0 : page * rows + 1);
  const getLastRecord = () => Math.min(totalRecords, (page + 1) * rows);

  // Dialog pagination helpers
  const getDialogFirstRecord = () =>
    dialogTotalRecords === 0 ? 0 : dialogPage * dialogRows + 1;
  const getDialogLastRecord = () =>
    Math.min(dialogTotalRecords, (dialogPage + 1) * dialogRows);

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden rounded-xl border border-gray-200 bg-white px-3 pb-3 pt-3 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex justify-between items-start sm:items-center flex-wrap gap-2 mb-4">
        <h2 className="app-subheading flex-1">Recent Orders</h2>
        <div className="flex gap-2 items-center">
  {/* The 'Export' button */}
  <button
    className="px-4 py-2 text-sm border rounded-md dark:border-white/20 dark:hover:bg-white/10 dark:text-white/90"
    onClick={exportData}
  >
    Export
  </button>
  {/* The full table icon */}
  <button
    onClick={() => setShowDialog(true)}
    title="Open full table"
    className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-600 px-2 py-1 text-xl"
  >
    <FaTable />
  </button>
  {/* 'View More' button for desktop */}
  <CommonButton
    variant="responsive"
    onClick={handleViewMore}
    showMobile={false}
    text="View more"
  />
</div>
      </div>

      {/* Main Table or Mobile Cards */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <ProgressSpinner />
        </div>
      ) : isMobile ? (
        <>{mobileCardRender && orders.map(mobileCardRender)}</>
      ) : (
        <DataTable
          value={orders}
          rows={5}
          paginator={false}
          sortField={sortField}
          sortOrder={sortOrder === 'asc' ? 1 : -1}
          onSort={(e: DataTableSortEvent) => {
            setSortField(e.sortField || sortField);
            setSortOrder(e.sortOrder === 1 ? 'asc' : 'desc');
          }}
          filters={filters}
          filterDisplay="menu"
          onFilter={(e: DataTableFilterEvent) => setFilters(e.filters)}
          emptyMessage="No orders found."
          responsiveLayout="scroll"
          size="small"
          className="text-xs [&_.p-datatable-tbody_td]:py-0.5 [&_.p-datatable-thead_th]:py-1"
          key={`main-datatable-${sortField}-${sortOrder}-${JSON.stringify(
            filters
          )}`}
        >
          <Column
            field="product_name"
            header="Product Name"
            sortable
            filter
            filterElement={renderFilterInput('Search Product')}
            style={{ minWidth: '10rem' }}
          />
          <Column
            field="category_name"
            header="Category"
            sortable
            filter
            filterElement={renderFilterInput('Search Category')}
            style={{ minWidth: '8rem' }}
          />
          <Column
            field="unit_price"
            header="Price (USD)"
            body={(row) => formatUSD(row.unit_price)}
            sortable
            style={{ minWidth: '7rem' }}
          />
          <Column
            field="shipment_status"
            header="Shipment Status"
            sortable
            filter
            filterElement={renderFilterInput('Search Status')}
            body={shipmentStatusBody}
            style={{ minWidth: '9rem' }}
          />
          <Column
            field="order_type"
            header="Order Type"
            sortable
            filter
            filterElement={renderFilterInput('Search Type')}
            style={{ minWidth: '8rem' }}
          />
        </DataTable>
      )}

      {/* Dialog for full table */}
      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        style={{ width: '90vw', maxWidth: '1100px' }}
        header="All Recent Orders"
        modal
      >
        {dialogLoading ? (
          <div className="flex justify-center items-center py-8">
            <ProgressSpinner />
          </div>
        ) : (
          <>
            <DataTable
              key={`dialog-datatable-${dialogSortField}-${dialogSortOrder}-${JSON.stringify(
                dialogFilters
              )}`}
              value={dialogOrders}
              paginator={false}
              rows={dialogRows}
              sortField={dialogSortField}
              sortOrder={dialogSortOrder === 'asc' ? 1 : -1}
              onSort={(e: DataTableSortEvent) => {
                setDialogSortField(e.sortField || dialogSortField);
                setDialogSortOrder(e.sortOrder === 1 ? 'asc' : 'desc');
              }}
              filters={dialogFilters}
              filterDisplay="menu"
              onFilter={(e: DataTableFilterEvent) =>
                setDialogFilters(e.filters)
              }
              emptyMessage="No orders found."
              responsiveLayout="scroll"
              size="small"
              className="w-full"
            >
              <Column
                field="product_name"
                header="Product Name"
                sortable
                filter
                filterElement={renderFilterInput('Search Product')}
                style={{ minWidth: '10rem' }}
              />
              <Column
                field="category_name"
                header="Category"
                sortable
                filter
                filterElement={renderFilterInput('Search Category')}
                style={{ minWidth: '8rem' }}
              />
              <Column
                field="unit_price"
                header="Price (USD)"
                body={(row) => formatUSD(row.unit_price)}
                sortable
                style={{ minWidth: '7rem' }}
              />
              <Column
                field="shipment_status"
                header="Shipment Status"
                sortable
                filter
                filterElement={renderFilterInput('Search Status')}
                body={shipmentStatusBody}
                style={{ minWidth: '9rem' }}
              />
              <Column
                field="order_type"
                header="Order Type"
                sortable
                filter
                filterElement={renderFilterInput('Search Type')}
                style={{ minWidth: '8rem' }}
              />
            </DataTable>

            {/* Dialog Pagination */}
            <div className="flex justify-between items-center text-sm mt-3 text-gray-600 dark:text-gray-400">
              <div>
                Showing {getDialogFirstRecord()} - {getDialogLastRecord()} of{' '}
                {dialogTotalRecords}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setDialogPage(0)}
                  disabled={dialogPage === 0}
                  className="px-2 py-1 bg-gray-200 disabled:opacity-50"
                >
                  ⏮
                </button>
                <button
                  onClick={() => setDialogPage(Math.max(0, dialogPage - 1))}
                  disabled={dialogPage === 0}
                  className="px-2 py-1 bg-gray-200 disabled:opacity-50"
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
                  className="px-2 py-1 bg-gray-200 disabled:opacity-50"
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
                  className="px-2 py-1 bg-gray-200 disabled:opacity-50"
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