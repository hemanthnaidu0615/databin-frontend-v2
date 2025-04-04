import React, { useState } from "react";
import ApexCharts from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

type RevenuePerCustomerProps = {
  size?: "small" | "full";
  hasTableRow?: boolean;
};

const data = [
  { customer: "C1", revenue: 500 },
  { customer: "C2", revenue: 450 },
  { customer: "C3", revenue: 400 },
  { customer: "C4", revenue: 350 },
  { customer: "C5", revenue: 300 },
  { customer: "C6", revenue: 250 },
  { customer: "C7", revenue: 200 },
];

const RevenuePerCustomer: React.FC<RevenuePerCustomerProps> = ({ size = "full", hasTableRow = false }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const apexOptions: ApexOptions = {
    chart: { 
      type: "bar",
      toolbar: { 
        show: true, 
        tools: { download: true, selection: false, zoom: false, zoomin: false, zoomout: false, pan: false, reset: false }
      }
    },
    xaxis: { categories: data.map((d) => d.customer) },
    series: [{ name: "Revenue", data: data.map((d) => d.revenue) }],
  };

  return (
    <div className="relative border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-md bg-white dark:bg-gray-900 rounded-xl">
      {size === "full" && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Revenue Per Customer</h2>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10"
              aria-label="More options"
            >
              <MoreDotIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>

            {isDropdownOpen && (
              <Dropdown isOpen={isDropdownOpen} onClose={() => setDropdownOpen(false)} className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50">
                <DropdownItem onItemClick={() => setDropdownOpen(false)}>View More</DropdownItem>
                <DropdownItem onItemClick={() => setDropdownOpen(false)}>Remove</DropdownItem>
              </Dropdown>
            )}
          </div>
        </div>
      )}

      <ApexCharts options={apexOptions} series={apexOptions.series} type="bar" height={size === "small" ? 150 : 300} />

      {hasTableRow && (
        <DataTable value={data} className="mt-4">
          <Column field="customer" header="Customer" />
          <Column field="revenue" header="Revenue" />
        </DataTable>
      )}
    </div>
  );
};

export default RevenuePerCustomer;
