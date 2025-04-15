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
    <div className="card border border-gray-200 shadow-lg rounded-lg flex py-1 px-2 m-2">
      <div className="w-[20%] h-full">
        <BrandInfo
          brandName={props.brandName}
          logo={props.logo}
          progressbarValue={props.progressbarValue}
        />
      </div>
      {chart === "Pie Chart" && (
        <div className="w-[62%] min-h-56">
          <PieChart data={props.dataForPieChart} logo={props.logo} />
        </div>
      )}
      {chart === "Line Chart" && (
        <div className="w-[62%] min-h-56">
          <LineChart
            data={props.dataForLineChart}
            length={props.length}
            bottomLegend={props.bottomLegend}
            leftLegend={props.leftLegend}
          />
        </div>
      )}
      {chart === "Bar Chart" && (
        <div className="w-[62%] min-h-56">
          <BarChart chartData={chartData} />
        </div>
      )}
      {chart === "Table View" && (
        <div className="w-[62%] min-h-56">
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
              pt={{ bodyCell: { className: "h-5 text-center" } }}
              headerClassName="bg-purple-100"
            />
            <Column
              field="original_order_total_amount"
              header="Order Total Amount"
              body={orderTotalAmountTemplate}
              pt={{ bodyCell: { className: "h-5 text-center" } }}
              headerClassName="bg-purple-100"
            />
            <Column
              field="order_capture_channel"
              header="Order Capture Channel"
              pt={{ bodyCell: { className: "h-5 text-center" } }}
              headerClassName="bg-purple-100 text-left"
            />
          </DataTable>
        </div>
      )}
      <div className="flex">
        <Dropdown
          value={selectedChart}
          onChange={onChange}
          options={charts}
          optionLabel="name"
          placeholder={chart}
          className="rounded-none ml-2 bg-transparent border-transparent h-6"
          pt={{
            input: { className: "text-xs p-0 pr-2" },
            trigger: { className: "h-2 w-3 mt-1" },
            root: { className: "p-1" },
          }}
        />
      </div>
    </div>
  );
};
