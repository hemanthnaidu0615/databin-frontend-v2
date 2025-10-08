import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Button } from "primereact/button";
import { TableColumn } from "../modularity/tables/BaseDataTable";
import { axiosInstance } from "../../axios";
import { formatDateTime, formatValue, formatDateMDY } from "../utils/kpiUtils";
import { useDateRangeEnterprise } from "../utils/useGlobalFilters";
import CommonButton from "../modularity/buttons/Button";
import { FaTable } from "react-icons/fa";
import FilteredDataDialog from "../modularity/tables/FilteredDataDialog";
import * as XLSX from "xlsx";
import ExportIcon from './../../images/export.png';

const ShipmentPerformance: React.FC<{
  size?: "small" | "full";
}> = ({ size = "full" }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [data, setData] = useState<{
    carriers: string[];
    standard: number[];
    expedited: number[];
    sameDay: number[];
  }>({ carriers: [], standard: [], expedited: [], sameDay: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(() => localStorage.getItem("shipmentPerformanceVisible") !== "false");

  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange;
  const navigate = useNavigate();
  
const exportToXLSX = (data: any[]) => {
  const renamedData = data.map(item => ({
    "Shipment ID": item.shipment_id,
    "Order ID": item.order_id,
    "Carrier": item.carrier,
    "Method": item.shipping_method,
    "Ship Date": item.actual_shipment_date,
    "Status": item.shipment_status,
  }));
  const worksheet = XLSX.utils.json_to_sheet(renamedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Shipment Performance");
  XLSX.writeFile(workbook, "shipment_performance_export.xlsx");
};

const exportData = async () => {
  try {
    const params = {
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      enterpriseKey: enterpriseKey && enterpriseKey !== "All" ? enterpriseKey : undefined,
      size: 100000
    };
    
    const res = await axiosInstance.get("/shipment-performance/details-grid", { params });
    const dataToExport = res.data.data || [];
    exportToXLSX(dataToExport);
  } catch (err) {
    console.error("Export failed:", err);
    alert("Failed to export data.");
  }
};
  const [showAllDialog, setShowAllDialog] = useState(false);
  const [showFilteredDialog, setShowFilteredDialog] = useState(false);
  const [filterParams, setFilterParams] = useState<{ carrier?: string; method?: string }>({});
  const shippingMethodMap: Record<string, string> = {
    standard: "Standard",
    expedited: "Expedited",
    same_day: "Same-Day"
  };

  useEffect(() => { localStorage.setItem("shipmentPerformanceVisible", String(isVisible)); }, [isVisible]);
  useEffect(() => {
    const scrollY = sessionStorage.getItem("scrollPosition");
    if (scrollY) {
      window.scrollTo({ top: parseInt(scrollY, 10), behavior: "auto" });
      sessionStorage.removeItem("scrollPosition");
    }
  }, []);

  // Remove this useEffect hook
  // useEffect(() => {
  //   if (filterParams.carrier && filterParams.method) {
  //     setShowFilteredDialog(true);
  //   }
  // }, [filterParams]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          startDate: formatDateTime(startDate),
          endDate: formatDateTime(endDate),
        });
        if (enterpriseKey) params.append("enterpriseKey", enterpriseKey);

        const res = await axiosInstance.get("/shipment-performance", { params });
        const data = res.data as { shipment_performance?: any[] };
        const perf = (data.shipment_performance || []) as any[];

        setData({
          carriers: perf.map(item => item.carrier),
          standard: perf.map(item => item.standard),
          expedited: perf.map(item => item.expedited),
          sameDay: perf.map(item => item.same_day),
        });
      } catch (e: any) {
        setError(e.message || "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };
    if (startDate && endDate) fetchData();
  }, [startDate, endDate, enterpriseKey]);

  const barOptions: ApexOptions = {
    chart: {
      type: "bar", stacked: true, toolbar: { show: false },
      foreColor: isDark ? "#d1d5db" : "#a855f7", background: isDark ? "#1f2937" : "transparent",
      events: {
        dataPointSelection: (_evt, _ctx, config) => {
          const carrier = data.carriers[config.dataPointIndex];
          const key = ["standard", "expedited", "same_day"][config.seriesIndex];
          const method = shippingMethodMap[key];
          
          // Set filter params and show dialog directly
          setFilterParams({ carrier, method });
          setShowFilteredDialog(true);
        }
      }
    },
    colors: ["#4CAF50", "#FF9800", isDark ? "#c084fc" : "#a855f7"],
    plotOptions: { bar: { columnWidth: "70%" } },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => formatValue(val),
      style: { colors: ["#fff"], fontSize: "12px" }
    },
    xaxis: {
      categories: data.carriers,
      title: { text: "Carriers", style: { fontWeight: "400", fontSize: "14px", color: isDark ? "#c084fc" : "#a855f7" } },
      labels: { style: { fontSize: "12px", colors: isDark ? "#c084fc" : "#a855f7" } },
      crosshairs: { show: false },
    },
    yaxis: {
      title: { text: "Number of Shipments", style: { fontWeight: "400", fontSize: "14px", color: isDark ? "#c084fc" : "#a855f7" } },
      labels: { formatter: val => formatValue(val), style: { fontSize: "12px", colors: isDark ? "#c084fc" : "#a855f7" } }
    },
    tooltip: { theme: isDark ? "dark" : "light", y: { formatter: val => formatValue(val) } },
    legend: { position: "bottom", labels: { colors: isDark ? "#c084fc" : "#a855f7" } }
  };

  const barSeries = [
    { name: "Standard", data: data.standard },
    { name: "Expedited", data: data.expedited },
    { name: "Same-Day", data: data.sameDay }
  ];

  const handleViewMore = () => {
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    navigate("/shipment");
  };
  const restoreChart = () => setIsVisible(true);

  const tableColumns: TableColumn<any>[] = [
    { field: "shipment_id", header: "Shipment ID", sortable: true, filter: true },
    { field: "order_id", header: "Order ID", sortable: true, filter: true },
    { field: "carrier", header: "Carrier", sortable: true, filter: true },
    { field: "shipping_method", header: "Method", sortable: true, filter: true },
    { 
      field: "actual_shipment_date", 
      header: "Ship Date", 
      sortable: true, 
      filter: true, 
      body: (rowData: any) => formatDateMDY(rowData.actual_shipment_date) 
    },    
    { field: "shipment_status", header: "Status", sortable: true, filter: true }
  ];

  const fetchGridData = (customFilters: any = {}) => async (params: any) => {
    const p: any = {
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      enterpriseKey: enterpriseKey || undefined,
      ...customFilters,
      ...params
    };

    const res = await axiosInstance.get("/shipment-performance/details-grid", { params: p });
    const responseData = res.data as { data: any[]; count: number };
    return { data: responseData.data, count: responseData.count };
  };

  const renderShipmentCard = (item: any, index: number) => (
    <div key={index} className="p-4 mb-3 rounded shadow-md bg-white dark:bg-gray-800 border dark:border-gray-700">
      <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">Shipment ID: <span className="font-semibold">{item.shipment_id}</span></div>
      <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">Order ID: <span className="font-semibold">{item.order_id}</span></div>
      <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">Carrier: <span className="font-semibold">{item.carrier}</span></div>
      <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">Method: <span className="font-semibold">{item.shipping_method}</span></div>
      <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">Ship Date: <span className="font-semibold">{formatDateTime(item.actual_shipment_date)}</span></div>
      <div className="text-sm text-gray-500 dark:text-gray-300">Status: <span className="font-semibold">{item.shipment_status}</span></div>
    </div>
  );

  return (
    <div className="border dark:border-gray-800 p-4 shadow-md bg-white dark:bg-gray-900 rounded-xl">
      {!isVisible ? (
        <div className="flex justify-center py-4">
          <Button label="Restore Chart" className="p-button-primary" onClick={restoreChart} />
        </div>
      ) : (
        <>
          {/* Headers */}
          <div className="app-subheading flex justify-between items-center">
  <h2>Shipment Performance</h2>
  <div className="flex gap-2 items-center">
    {/* The new Export button */}
    <button 
      onClick={exportData}
    >

                          <img src={ExportIcon} alt="Export" className="w-6" />

    </button>
    <button onClick={() => setShowAllDialog(true)} className="text-purple-500">
      <FaTable size={18} />
    </button>
    <CommonButton variant="responsive" onClick={handleViewMore} text="View More" showMobile={true} showDesktop={true} />
  </div>
</div>

          {/* Chart */}
          {isLoading ? (
            <p>Loading data...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <Chart options={barOptions} series={barSeries} type="bar" height={size === "small" ? 250 : 385} />
          )}

          {/* Totals */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {["Standard", "Expedited", "Same-Day"].map((label, idx) => {
              const cnt = [data.standard, data.expedited, data.sameDay][idx].reduce((a, b) => a + b, 0);
              return (
                <div key={label} className="text-center">
                  <div className="text-xs text-gray-500">{label}</div>
                  <div className="font-semibold">{formatValue(cnt)}</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <FilteredDataDialog
        visible={showAllDialog}
        onHide={() => setShowAllDialog(false)}
        header="All Shipments"
        columns={tableColumns}
        fetchData={fetchGridData}
        mobileCardRender={renderShipmentCard}
      />
      <FilteredDataDialog
        visible={showFilteredDialog}
        onHide={() => {
          setShowFilteredDialog(false);
          setFilterParams({});
        }}
        header={`Filtered: ${filterParams.carrier} • ${filterParams.method}`}
        columns={tableColumns}
        fetchData={fetchGridData}
        filterParams={filterParams}
        mobileCardRender={renderShipmentCard}
      />
    </div>
  );
};

export default ShipmentPerformance;