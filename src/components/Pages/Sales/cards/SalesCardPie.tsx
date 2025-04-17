import "primeicons/primeicons.css";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { BarChart } from "../charts/BarChart";
import { LineChart } from "../charts/LineChart";
import { PieChart } from "../charts/PieChart";
import { BrandInfo } from "./BrandInfo";

export const SalesCardPie = (props: any) => {
  const [chart, setChart] = useState("Bar Chart");
  const [selectedChart, setSelectedChart] = useState(null);

  const chartData = {
    labels: props.dataForBarChart[0].map((data: any) => data.datetime),
    datasets: [
      {
        label: "Call Center",
        data: props.dataForBarChart[0].map(
          (data: any) => data.original_order_total_amount
        ),
        backgroundColor: ["rgba(173, 99, 155, 0.65)"],
        borderWidth: 0,
      },
      {
        label: "Web",
        data: props.dataForBarChart[1].map(
          (data: any) => data.original_order_total_amount
        ),
        backgroundColor: ["rgba(253, 88, 173, 0.8)"],
        borderWidth: 0,
      },
      {
        label: "Store",
        data: props.dataForBarChart[2].map(
          (data: any) => data.original_order_total_amount
        ),
        backgroundColor: ["rgba(125, 221, 187, 0.68)"],
        borderWidth: 0,
      },
    ],
  };

  function onChange(e: any) {
    setSelectedChart(e.value);
    setChart(e.value.name);
  }

  const charts = [
    { name: "Line Chart" },
    { name: "Pie Chart" },
    { name: "Bar Chart" },
    { name: "Table View" },
  ];

  const formatAmount = (value: number) => {
    return `${Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)}`;
  };

  const orderTotalAmountTemplate = (rowData: any) => {
    return formatAmount(rowData.original_order_total_amount);
  };

  return (
    <div className="card border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg rounded-lg flex flex-wrap md:flex-nowrap py-2 px-3 m-2 gap-2">
      <div className="w-full md:w-[20%]">
        <BrandInfo
          brandName={props.brandName}
          logo={props.logo}
          progressbarValue={props.progressbarValue}
        />
      </div>

      <div className="w-full md:w-[62%] min-h-56">
        {chart === "Pie Chart" && (
          <PieChart data={props.dataForPieChart} />
        )}
        {chart === "Line Chart" && (
          <LineChart
            data={props.dataForLineChart}
            length={props.length}
            bottomLegend={props.bottomLegend}
            leftLegend={props.leftLegend}
          />
        )}
        {chart === "Bar Chart" && <BarChart chartData={chartData} />}
        {chart === "Table View" && (
          <DataTable
            showGridlines
            scrollable
            scrollHeight="200px"
            value={props.dataForTable}
            size="small"
            className="text-xs"
          >
            <Column
              field="datetime"
              header="Date and Time"
              pt={{ bodyCell: { className: "h-5 text-center dark:text-white" } }}
              headerClassName="bg-purple-100 dark:bg-purple-900 text-black dark:text-white"
            />
            <Column
              field="original_order_total_amount"
              header="Order Total Amount"
              body={orderTotalAmountTemplate}
              pt={{ bodyCell: { className: "h-5 text-center dark:text-white" } }}
              headerClassName="bg-purple-100 dark:bg-purple-900 text-black dark:text-white"
            />
            <Column
              field="order_capture_channel"
              header="Order Capture Channel"
              pt={{ bodyCell: { className: "h-5 text-center dark:text-white" } }}
              headerClassName="bg-purple-100 dark:bg-purple-900 text-black dark:text-white"
            />
          </DataTable>
        )}
      </div>

      <div className="w-full md:w-auto flex items-start md:items-end">
        <Dropdown
          value={selectedChart}
          onChange={onChange}
          options={charts}
          optionLabel="name"
          placeholder={chart}
          className="rounded-md ml-2 bg-white dark:bg-gray-800 text-xs border-gray-300 dark:border-gray-600"
          pt={{
            input: { className: "text-xs p-1 dark:text-white" },
            trigger: { className: "h-5 w-4" },
            root: { className: "p-1" },
          }}
        />
      </div>
    </div>
  );
};
