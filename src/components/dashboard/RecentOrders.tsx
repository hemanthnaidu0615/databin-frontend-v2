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

const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
};

const convertToUSD = (rupees) => rupees * 0.012;
const formatUSD = (amount) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(convertToUSD(amount));

export default function RecentOrders() {
    const isMobile = useIsMobile();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
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
    const [sortOrder, setSortOrder] = useState('desc');

    // Dialog-specific state
    const [showAllOrdersDialog, setShowAllOrdersDialog] = useState(false);

    const dateRange = useSelector((state) => state.dateRange.dates);
    const enterpriseKey = useSelector((state) => state.enterpriseKey.key);
    const navigate = useNavigate();

    // Main table fetch
    const fetchOrders = async ({
        page,
        size,
        sortField,
        sortOrder,
        filters,
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

    // Define columns for the dialog table
    const ordersTableColumns = [
        { field: 'product_name', header: 'Product Name', sortable: true, filter: true },
        { field: 'category_name', header: 'Category', sortable: true, filter: true },
        { field: 'unit_price', header: 'Price (USD)', body: (row) => formatUSD(row.unit_price), sortable: true },
        { field: 'shipment_status', header: 'Shipment Status', body: (row) => shipmentStatusBody(row), sortable: true, filter: true },
        { field: 'order_type', header: 'Order Type', sortable: true, filter: true },
    ];
    
    // Define the data fetcher for the dialog, aligned with BaseDataTable
    const fetchOrdersForDialog = () => async (tableParams) => {
        const p = new URLSearchParams({
            startDate: formatDate(dateRange[0]),
            endDate: formatDate(dateRange[1]),
            ...tableParams,
        });
        if (enterpriseKey && enterpriseKey !== 'All') {
            p.append('enterpriseKey', enterpriseKey);
        }

        const res = await axiosInstance.get(`/orders/recent-orders?${p}`);
        return { data: res.data.data, count: res.data.count };
    };

    // initial fetch for main table
    useEffect(() => {
        fetchOrders({ page, size: rows, sortField, sortOrder, filters });
    }, [dateRange, enterpriseKey, page, rows, sortField, sortOrder, JSON.stringify(filters)]);

    const shipmentStatusBody = (row) => (
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

    const mobileCardRender = (item, idx) => (
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

    const renderFilterInput = (placeholder = 'Search') => {
        return (options) => (
            <InputText
                value={options.value || ''}
                onChange={(e) => options.filterCallback(e.target.value)}
                placeholder={placeholder}
                className="p-column-filter"
            />
        );
    };

    return (
        <div className="flex flex-col flex-1 h-full overflow-hidden rounded-xl border border-gray-200 bg-white px-3 pb-3 pt-3 dark:border-gray-800 dark:bg-white/[0.03]">
            {/* Header */}
            <div className="flex justify-between items-start sm:items-center flex-wrap gap-2 mb-4">
                <h2 className="app-subheading flex-1">Recent Orders</h2>
                <div className="flex gap-2 items-center">
                    <CommonButton
                        variant="responsive"
                        onClick={handleViewMore}
                        showMobile={false}
                        text="View more"
                    />
                    <CommonButton
                        variant="responsive"
                        onClick={handleViewMore}
                        showDesktop={false}
                    />
                    <button
                        onClick={() => setShowAllOrdersDialog(true)}
                        title="Open full table"
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-600 px-2 py-1 text-xl"
                    >
                        <FaTable />
                    </button>
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
                    onSort={(e) => {
                        setSortField(e.sortField || sortField);
                        setSortOrder(e.sortOrder === 1 ? 'asc' : 'desc');
                    }}
                    filters={filters}
                    filterDisplay="menu" // Use "menu" for filters beside the column name
                    onFilter={(e) => setFilters(e.filters)}
                    emptyMessage="No orders found."
                    responsiveLayout="scroll"
                    size="small"
                    className="my-recent-orders-table text-xs [&_.p-datatable-tbody_td]:py-0.5 [&_.p-datatable-thead_th]:py-1"
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
                        body={shipmentStatusBody}
                        filterElement={renderFilterInput('Search Status')}
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

            {/* Use the shared FilteredDataDialog component */}
            <FilteredDataDialog
                visible={showAllOrdersDialog}
                onHide={() => setShowAllOrdersDialog(false)}
                header="All Recent Orders"
                columns={ordersTableColumns}
                fetchData={fetchOrdersForDialog}
                mobileCardRender={mobileCardRender}
            />
        </div>
    );
}