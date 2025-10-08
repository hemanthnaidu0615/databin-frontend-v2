'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../../../../axios';
import { formatDateTime } from '../../../utils/kpiUtils';
import USMap from './us-map/USMap';
import {
  BaseDataTable,
  TableColumn,
} from '../../../modularity/tables/BaseDataTable';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import * as XLSX from "xlsx";
import ExportIcon from '../../../../images/export.png';

interface StateData {
  state_name: string;
  state_revenue: number;
  state_quantity: number;
  revenue_percentage?: number;
  average_revenue_per_unit?: number;
}

const convertToUSD = (rupees: number): number => rupees * 0.012;
const formatValue = (val: number) =>
  val >= 1_000_000
    ? `${(val / 1_000_000).toFixed(1)}M`
    : val >= 1_000
    ? `${(val / 1_000).toFixed(1)}K`
    : val.toString();

export const SalesByRegion: React.FC = () => {
  const [topStates, setTopStates] = useState<
    { state_name: string; state_revenue: number }[]
  >([]);
  const [expandedState, setExpandedState] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange || [];
  
const exportToXLSX = (data: any[]) => {
  const renamedData = data.map((item) => ({
    "State": item.state_name,
    "Total Value (USD)": convertToUSD(item.state_revenue),
    "Quantity": item.state_quantity,
  }));

  const worksheet = XLSX.utils.json_to_sheet(renamedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sales by Region");
  XLSX.writeFile(workbook, "sales_by_region_export.xlsx");
};

const exportData = async () => {
  try {
    if (!startDate || !endDate) {
      alert("Date range not available. Please select a date range.");
      return;
    }

    const formattedStart = formatDateTime(startDate);
    const formattedEnd = formatDateTime(endDate);

    const params = {
      startDate: formattedStart,
      endDate: formattedEnd,
      enterpriseKey: enterpriseKey || undefined,
      
      size: "100000",
    };

    const response = await axiosInstance.get(
      `/sales-by-region`,
      { params }
    );
    const dataToExport = (response.data as { data?: any[] }).data || [];
    exportToXLSX(dataToExport);
  } catch (err) {
    console.error("Export failed:", err);
    alert("Failed to export data.");
  }
};

  useEffect(() => {
    const fetchTopStates = async () => {
      if (!startDate || !endDate) return;
      const params = new URLSearchParams({
        startDate: formatDateTime(startDate),
        endDate: formatDateTime(endDate),
        ...(enterpriseKey ? { enterpriseKey } : {}),
      });

      try {
        const topStatesResponse = await axiosInstance.get<
          { state_name: string; state_revenue: number }[]
        >(`/sales-by-region/top5?${params}`);
        setTopStates(topStatesResponse.data || []);
      } catch (error) {
        console.error('Error fetching top states:', error);
      }
    };

    fetchTopStates();
  }, [startDate, endDate, enterpriseKey]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  const fetchData = async (params: any) => {
    if (!startDate || !endDate) return { data: [], count: 0 };

    const queryParams = new URLSearchParams({
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      ...params,
    });

    if (enterpriseKey) queryParams.append('enterpriseKey', enterpriseKey);

    try {
      const response = await axiosInstance.get(
        `/sales-by-region?${queryParams.toString()}`
      );
      const responseData = response.data as {
        data: StateData[];
        count: number;
      };
      return {
        data: responseData.data,
        count: responseData.count,
      };
    } catch (err) {
      console.error('Error fetching sales data:', err);
      return { data: [], count: 0 };
    }
  };

  const columns: TableColumn<StateData>[] = [
    {
      field: 'state_name',
      header: 'State',
      sortable: true,
      filter: true,
    },
    {
      field: 'state_revenue',
      header: 'Total $ Value',
      sortable: true,
      body: (row) => `$ ${formatValue(convertToUSD(row.state_revenue))}`,
    },
    {
      field: 'revenue_percentage',
      header: 'Percentage',
      sortable: true,
      body: (row) => `${row.revenue_percentage?.toFixed(2) || 0}%`,
    },
    {
      field: 'state_quantity',
      header: 'Quantity',
      sortable: true,
      body: (row) => formatValue(row.state_quantity),
    },
  ];

  const colorScale = (stateName: string) => {
    const topStateNames = topStates.map((s) => s.state_name);
    const colors = ['#58ddf5', '#65f785', '#f5901d', '#f7656c', '#8518b8'];
    const index = topStateNames.indexOf(stateName);
    return index >= 0 ? colors[index] : theme === 'dark' ? '#444' : '#d6d4d0';
  };

  const markersList = topStates.slice(0, 5).map((state) => ({
    legend: state.state_name,
    color: colorScale(state.state_name),
    value: formatValue(convertToUSD(state.state_revenue)),
  }));

  const renderMobileCard = (row: StateData, index: number) => (
    <div
      key={index}
      className={`p-4 rounded-md border cursor-pointer ${
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}
      onClick={() =>
        setExpandedState(
          expandedState === row.state_name ? null : row.state_name
        )
      }
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold">{row.state_name}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            ${formatValue(convertToUSD(row.state_revenue))}
          </span>
          {expandedState === row.state_name ? (
            <FaChevronUp />
          ) : (
            <FaChevronDown />
          )}
        </div>
      </div>
      {expandedState === row.state_name && (
        <div className="mt-2 text-sm space-y-1 text-gray-600 dark:text-gray-300">
          <div>Percentage: {row.revenue_percentage?.toFixed(2) || 0}%</div>
          <div>Quantity: {formatValue(row.state_quantity)}</div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col m-2 rounded-lg bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-slate-700">
      <div className="flex justify-between px-3 py-2">
        <h1 className="text-2xl app-section-title">Sales by Region</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 py-4 items-center lg:items-start">
        {/* Map + Legend */}
        <div className="w-full lg:w-1/2 flex flex-col lg:flex-col items-center lg:items-start gap-4">
          <div className="relative w-full h-full min-h-[250px] sm:min-h-[300px] md:min-h-[335px] flex-1 aspect-[4/3] overflow-hidden p-4">
            <USMap />
          </div>
          <div className="flex flex-col ml-4 gap-4 max-w-xs w-full lg:w-auto">
            <div className="text-xs p-2 font-bold rounded-sm text-violet-900 dark:text-violet-100 bg-red-100 dark:bg-red-900">
              Top 5 revenues
            </div>
            <div className="flex flex-col gap-1">
              {markersList.map((item) => (
                <span key={item.color} className="flex items-center gap-2">
                  <div
                    className="rounded-full h-[9px] w-[9px]"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <p className="text-xs text-violet-900 dark:text-violet-100">
                    {item.legend} - ${item.value}
                  </p>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="w-full lg:w-1/2 mt-6 lg:mt-0 lg:mr-4 md:mr-4">
          
<div className="flex justify-between items-center mb-4">
  <h3 className="app-subheading">Revenues by State</h3>
  <button    
  onClick={exportData}
  >
  <img src={ExportIcon} alt="Export" className="w-6" />

  </button>
</div>
          <BaseDataTable<StateData>
            fetchData={fetchData}
            columns={columns}
            mobileCardRender={renderMobileCard}
            field={'state_name'}
            header={''}
          />
        </div>
      </div>
    </div>
  );
};
