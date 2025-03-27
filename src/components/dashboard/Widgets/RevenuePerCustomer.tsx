import React, { useState } from "react";
import ApexCharts from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../../ui/dropdown/Dropdown";
import { DropdownItem } from "../../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../../icons";
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
  { customer: "C8", revenue: 150 },
  { customer: "C9", revenue: 100 },
  { customer: "C10", revenue: 50 },
];
// this is helpful for the user to view more details about the chart the small hamburger icon will be displayed on the top right corner of the chart
const apexOptions: ApexOptions = {
  chart: { 
    type: "bar",
    toolbar: { 
      show: true, // Keep the three-dot menu
      tools: { 
        download: true, // Keep the download feature
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false
      }
    }
  },
  xaxis: { categories: data.map((d) => d.customer) },
  series: [{ name: "Revenue", data: data.map((d) => d.revenue) }],
};


const RevenuePerCustomer: React.FC<RevenuePerCustomerProps> = ({ size = "full", hasTableRow = false }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-default bg-white dark:bg-gray-900 rounded-xl">
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
              <Dropdown isOpen={isDropdownOpen} onClose={() => setDropdownOpen(false)} className="w-40 p-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
              <DropdownItem 
                onItemClick={() => setDropdownOpen(false)} 
                className="flex w-full font-normal text-left text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                View More
              </DropdownItem>
              <DropdownItem 
                onItemClick={() => setDropdownOpen(false)} 
                className="flex w-full font-normal text-left text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Remove
              </DropdownItem>
            </Dropdown>
            
            )}
          </div>
        </div>
      )}

      <div className="mt-4">
        <ApexCharts options={apexOptions} series={apexOptions.series} type="bar" height={300} />
      </div>

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