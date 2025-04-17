import moment from "moment";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { ProgressSpinner } from "primereact/progressspinner";
import React, { useEffect, useState,useRef } from "react";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { Dialog } from 'primereact/dialog';
import {authFetch} from "../../../axios";
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { setCache,getCache } from "../../utils/analysiscache";

interface SchedulerData {
  startDate: Date | null;
  recurrencePattern: string;
  emailAddress: string;
  tableSelection: string;
  columnSelection: string[];
  timeFrame: string;
}

export const Analysis = () => {
  const [tableName, setTableName] = useState<string>("order_book_header");
  const [data, setData] = useState<any[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBarChart, setShowBarChart] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const toast = useRef<Toast>(null);

  const { dates } = useSelector((store: any) => store.dateRange);

  const [showSchedulerDialog, setShowSchedulerDialog] = useState(false);
  const [schedulerData, setSchedulerData] = useState<SchedulerData>({
    startDate: null,
    recurrencePattern: '',
    emailAddress: '',
    tableSelection: '',
    columnSelection: [],
    timeFrame: '',
  });


  const fetchData = async (tablename: string) => {
    const formattedStartDate = moment(dates[0]).format("YYYY-MM-DD HH:mm:ss");
    const formattedEndDate = moment(dates[1]).format("YYYY-MM-DD HH:mm:ss");
    const cacheKey = `${tablename}_${formattedStartDate}_${formattedEndDate}`;
  
    const cachedData = getCache(cacheKey);
    if (cachedData) {
      setData(cachedData.data);
      initializeFilters(cachedData.filters);
      setLoading(false);
      return;
    }
  
    setLoading(true);
    try {
      const response = await authFetch(
        `/tables?table=${tablename}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );
  
      setData(response.data);
      initializeFilters(response.data);
  
      setCache(cacheKey, response.data, response.data); 
  
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleSaveScheduler = async () => {
    try {
      const { tableSelection, columnSelection, startDate, recurrencePattern, emailAddress, timeFrame } = schedulerData;
  
      const formattedStartDate = moment.utc(startDate).format('YYYY-MM-DD HH:mm:ss');

  
      if (!schedulerData.startDate || !schedulerData.recurrencePattern || !schedulerData.emailAddress || !schedulerData.columnSelection.length || !schedulerData.timeFrame) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Please fill all required fields.',
          life: 3000,
        });
        return;
      }

      const payload = {
        email: emailAddress,
        recurrencePattern,
        startDate: formattedStartDate,
        tableSelection,
        columnSelection,
        timeFrame,
      };
  
      const response = await authFetch('/tables/scheduler', {
        method: 'POST',
        data: payload, 
        headers: {
          'Content-Type': 'application/json', 
        }
      });
  
      // console.log('Response object:', response);
      // console.log('Response status:', response.status);
  
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${response.statusText}`);
      }
  
      console.log('Scheduler data saved and email sent successfully:', response.data.message);
  
      setSchedulerData({
        tableSelection: '',
        columnSelection: [],
        startDate: null,
        recurrencePattern: '',
        emailAddress: '',
        timeFrame: '',
      });
      setShowSchedulerDialog(false);
  
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Scheduler saved successfully!', 
        life: 3000 
      });
  
    } catch (error) {
      console.error('Error saving scheduler data:', error);
    }
  };
  
  
  function getTimeFrames(recurrencePattern: string): { label: string; value: string }[] {
    const timeFrames: Record<string, { label: string; value: string }[]> = {
      daily: [
        { label: 'Today', value: 'Today' },
        { label: 'Past Week Data', value: 'Past Week' },
        { label: 'Past Month Data', value: 'Past Month' },
        { label: 'Past 3 Months Data', value: 'Past 3 Months' },
        { label: 'Past 6 Months Data', value: 'Past 6 Months' },
        { label: 'Past Year Data', value: 'Past Year' },
      ],
      weekly: [
        { label: 'Past Week Data', value: 'Past Week' },
        { label: 'Past Month Data', value: 'Past Month' },
        { label: 'Past 3 Months Data', value: 'Past 3 Months' },
        { label: 'Past 6 Months Data', value: 'Past 6 Months' },
        { label: 'Past Year Data', value: 'Past Year' },
      ],
      monthly: [
        { label: 'Past Month Data', value: 'Past Month' },
        { label: 'Past 3 Months Data', value: 'Past 3 Months' },
        { label: 'Past 6 Months Data', value: 'Past 6 Months' },
        { label: 'Past Year Data', value: 'Past Year' },
        { label: 'Past 2 Years Data', value: 'Past 2 Years' },
        { label: 'Past 5 Years Data', value: 'Past 5 Years' },
        { label: 'Past 10 Years Data', value: 'Past 10 Years' },
      ],
      yearly: [
        { label: 'Past Year Data', value: 'Past Year' },
        { label: 'Past 2 Years Data', value: 'Past 2 Years' },
        { label: 'Past 5 Years Data', value: 'Past 5 Years' },
        { label: 'Past 10 Years Data', value: 'Past 10 Years' },
      ],
    };
    return timeFrames[recurrencePattern] || [];
  }
    
  
  const initializeFilters = (data: any[]) => {
    const initialFilters: DataTableFilterMeta = {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };
    if (data.length > 0) {
      Object.keys(data[0]).forEach((key) => {
        initialFilters[key] = {
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
        };
      });
    }
    setFilters(initialFilters);
  };

  useEffect(() => {
    fetchData(tableName);
  }, [dates[1]]);

  const handleSelectingTable = (newTableName: string) => {
    setTableName(newTableName);
    fetchData(newTableName);
    setSelectedColumns([]);
  };

  const formatHeaderKey = (key: string) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatValue = (field: string, value: any) => {
    if (field.toLowerCase().includes("date")) {
      return typeof value === "string" ? value.slice(0, 10) : value;
    }
    if (
      field.toLowerCase().includes("amount") ||
      field.toLowerCase().includes("_tax") ||
      field.toLowerCase().includes("margin") ||
      field.toLowerCase().includes("_charge") ||
      field.toLowerCase().includes("cost") ||
      field.toLowerCase().includes("intl") ||
      field.toLowerCase().includes("line_other") ||
      field.toLowerCase().includes("line_tax") ||
      field.toLowerCase().includes("line_total") ||
      field.toLowerCase().includes("list_price") ||
      field.toLowerCase().includes("unit")
    ) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    }
    return value;
  };

  const getTableColumns = (data: any[]) => {
    if (tableName === "order_book_line" || tableName === "order_book_taxes") {
      return Object.keys(data[0] || {}).slice(1).map((key) => ({
        field: key,
        header: formatHeaderKey(key),
      }));
    }
    return Object.keys(data[0] || {}).map((key) => ({
      field: key,
      header: formatHeaderKey(key),
    }));
  };
  

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters: any = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const onColumnFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = e.target.value;
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      [field]: { value, matchMode: FilterMatchMode.CONTAINS },
    }));
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center my-auto mx-auto">
        <ProgressSpinner />
      </div>
    );
  }

  const formatDateColumns = (data: any[]) => {
    return data.map(item => {
        const newItem = { ...item };
        Object.keys(newItem).forEach(key => {
            if (key.toLowerCase().includes('date')) {
                const originalDate = newItem[key];
                const formattedDate = moment(originalDate, "DD-MMM-YY HH.mm.ss.SSSSSS a").isValid()
                    ? moment(originalDate, "DD-MMM-YY HH.mm.ss.SSSSSS a").format("DD-MMM-YY")
                    : moment(originalDate).isValid() 
                        ? moment(originalDate).format("DD-MMM-YY")
                        : originalDate;
                newItem[key] = formattedDate;
            }
        });
        return newItem;
    });
};

const groupedData: any = {};
if (tableName === "order_book_line") {
    const formattedData = formatDateColumns(data);
    formattedData.forEach((item: any) => {
        const formattedDate = item.order_date; 
        const key = `${item.enterprise_key}-${formattedDate}`;

        if (!groupedData[key]) {
            groupedData[key] = [item];
        } else {
            groupedData[key].push(item);
        }
    });
}




  const separateOrdersByEnterpriseKey = (data: any) => {
    const AWDOrders: any[] = [];
    const AWWOrders: any[] = [];
    const nivoData: any[] = [];

    for (const key in data) {
      const subArray = data[key];

      let sum = 0;

      for (const order of subArray) {
        sum += parseFloat(order.order_total_amount);
      }

      if (key.startsWith("AWD")) {
        AWDOrders.push({ key, sum });
      } else if (key.startsWith("AWW")) {
        AWWOrders.push({ key, sum });
      }
    }

    nivoData.push(AWWOrders);
    nivoData.push(AWDOrders);

    return { nivoData, AWDOrders, AWWOrders };
  };

  const { AWDOrders, AWWOrders } = separateOrdersByEnterpriseKey(groupedData);

  const barChartData = {
    labels: Array.from(new Set([...Object.keys(groupedData)])),
    datasets: [
      {
        label: "AWD",
        data: AWWOrders?.map((data: any) => data.sum),
        backgroundColor: ["rgba(193, 21, 21, 0.65)"],
        borderWidth: 0,
      },
      {
        label: "AWW",
        data: AWDOrders?.map((data: any) => data.sum),
        backgroundColor: ["rgba(31, 55, 193, 0.65)"],
        borderWidth: 0,
      },
    ],
  };

  const handleBarChart = () => {
    fetchData("order_book_line");
    setShowBarChart(true);
    // console.log(groupedData);
  };

  const handleTableView = () => {
    setShowBarChart(false);
  };

const exportExcel = () => {
  if (selectedColumns.length === 0) {
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Select all fields',
      life: 3000
    });
    return;
  }
  import("xlsx").then((xlsx) => {
    const selectedColumnsData: Record<string, any>[] = data.map((row: any) => {
      const newRow: Record<string, any> = {};
      if (selectedColumns.length > 0) {
        selectedColumns.forEach((column: any) => {
          newRow[formatHeaderKey(column.field)] = formatValue(
            column.field,
            row[column.field]
          );
        });
      } else {
        Object.keys(row).forEach((key) => {
          newRow[formatHeaderKey(key)] = formatValue(key, row[key]);
        });
      }
      return newRow;
    });

    const worksheet = xlsx.utils.json_to_sheet(selectedColumnsData);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // saveAsExcelFile(excelBuffer, "data");
    saveAsExcelFile(excelBuffer, tableName);
  });
};


  const saveAsExcelFile = (buffer: any, fileName: any) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };

  const tables = [
    { name: "order_book_header", code: "OBH" },
    { name: "order_book_line", code: "OBL" },
    { name: "order_book_taxes", code: "OBT" },
    { name: "return_order_header", code: "ROH" },
    { name: "return_order_line", code: "ROL" },
  ];

  const balanceFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <InputNumber
        className="max-w-40 text-xs p-1 h-4"
        placeholder="Enter figure"
        value={options.value || null}
        onChange={(e: InputNumberChangeEvent) => {
          options.filterCallback(e.value, options.index);
          // console.log(e.value);
        }}
        mode="currency"
        currency="USD"
        locale="en-US"
      />
    );
  };

  const header = (
    <div className="flex place-content-end align-items-center gap-2 items-center">
      <IconField iconPosition="right">
        <InputIcon className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
          className="h-[34px] w-52 text-xs p-1 "
        />
      </IconField>
      <Dropdown
        value={tableName}
        onChange={(e) => handleSelectingTable(e.value.name)}
        options={tables.map((table) => ({
          name: table.name,
          code: table.code,
        }))}
        optionLabel="name"
        placeholder={tableName}
        className="h-[34px] w-52 text-xs p-1 "
        pt={{
          input: { className: "text-xs p-0 " },
          trigger: { className: "h-2 w-3 ml-2 " },
          root: { className: " items-center justify-center" },
        }}
      />
      <MultiSelect
    value={selectedColumns}
    options={getTableColumns(data).slice(1)}
    onChange={(e) => setSelectedColumns(e.value)}
    optionLabel="header"
    display="chip"
    placeholder="Select Columns"
    selectAll={true}
    selectAllLabel={selectedColumns.length === getTableColumns(data).slice(1).length ? "Deselect All" : "Select All"}
    className="p-multiselect-sm p-multiselect-panel h-[34px] text-xs p-1 border-2"
    pt={{
        label: { className: "text-xs p-0" },
        trigger: { className: "h-2 w-3 ml-2" },
        root: { className: "items-center justify-center" },
    }}
    style={{ width: "15rem" }}
/>
      {tableName === "order_book_line" && (
        <Button
          type="button"
          icon="pi pi-chart-bar"
          rounded
          onClick={handleBarChart}
          className="bg-purple-500 border-0 h-10 w-10"
          tooltipOptions={{ position: "top" }}
          tooltip="Show Bar Chart"
        />
      )}

      <Button
        type="button"
        icon="pi pi-file-excel"
        rounded
        onClick={exportExcel}
        data-pr-tooltip="xls"
        className="bg-purple-500 border-0 h-10 w-10"
        tooltipOptions={{ position: "top" }}
        tooltip="xls"
      />

      {/* <Button
        type="button"
        icon="pi pi-calendar"
        rounded
        onClick={() => setShowSchedulerDialog(true)}
        data-pr-tooltip="Schedule"
        className="bg-purple-500 border-0 h-10 w-10"
        tooltipOptions={{ position: "top", className:"text-xs" }}
        tooltip="Schedule"
      /> */}

    </div>
  );

  return (
    <div className="rounded-lg bg-white border-2 w-auto overflow-y-auto">
      <div className="w-full h-2 bg-purple-300 rounded-t-lg"></div>
      <div className="flex gap-4 items-center px-3 py-2">
        <h1 className="text-2xl font-semibold text-md text-violet-800">
          Sales Analysis
        </h1>
      </div>

      <div className="flex flex-col">
        {showBarChart ? (
          <div className="h-96 translate-y-20">
            <div className="flex justify-end px-8">
              <Button
                type="button"
                icon="pi pi-table"
                data-pr-tooltip="Show Table"
                onClick={handleTableView}
                className="bg-purple-500 border-0 h-10 m-2"
                tooltipOptions={{ position: "top" }}
                tooltip="Show Table"
              />
            </div>
            <Bar
              data={barChartData}
              width={750}
              options={{
                plugins: {
                  title: {
                    display: true,
                  },
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      display: true,
                    },
                  },
                },
              }}
            />
          </div>
        ) : (
          <DataTable
            className="m-1 w-[99%]"
            showGridlines
            size="small"
            paginator
            rows={10}
            value={data}
            header={header}
            filters={filters}
            filterDisplay="row"
            globalFilterFields={Object.keys(filters)}
            >
            {getTableColumns(data).slice(1).map((col, index) => { 
            if (
              col.header.toLowerCase().includes("amount") ||
              col.header.toLowerCase().includes("charges")
            ) {
            return (
                <Column
                    sortable
                    key={index}
                    field={col.field}
                    header={col.header}
                    style={{ minWidth: "350px" }}
                    dataType="numeric"
                    filterField={col.field}
                    filter
                    filterElement={balanceFilterTemplate}
                    body={(rowData) => formatValue(col.field, rowData[col.field])}
                />
            );
        }
        return (
            <Column
                sortable
                key={index}
                field={col.field}
                style={{ minWidth: "350px" }}
                header={col.header}
                filter
                filterElement={
                    <InputText
                        value={filters[col.field]?.value || ""}
                        onChange={(e) => onColumnFilterChange(e, col.field)}
                        placeholder={`Search ${col.header}`}
                        className="max-w-auto text-sm p-1"
                    />
                }
                filterPlaceholder={`Search by ${col.header}`}
                body={(rowData) => {
                    if (col.header.toLowerCase().includes("date")) {
                        const formattedDate = moment(rowData[col.field], "DD-MMM-YY HH.mm.ss.SSSSSS a").isValid()
                            ? moment(rowData[col.field], "DD-MMM-YY HH.mm.ss.SSSSSS a").format("DD-MMM-YY")
                            : moment(rowData[col.field]).isValid() 
                                ? moment(rowData[col.field]).format("DD-MMM-YY")
                                : rowData[col.field];
                        return formattedDate;
                    }
                    return formatValue(col.field, rowData[col.field]);
                }}
            />
        );
    })}
</DataTable>
        )}
      </div>
      <Toast ref={toast} className="custom-toast" />
      <Dialog
        visible={showSchedulerDialog}
        onHide={() => setShowSchedulerDialog(false)}
        header={
          <div style={{ fontSize: '1.5rem' }}>
            Scheduler
          </div>
        }
        footer={
          <div className="flex justify-end">
            <Button className="bg-purple-500 border-none" label="Schedule" icon="pi pi-check" onClick={handleSaveScheduler} />
            <Button className="text-purple-700 bg-white border-none" label="Cancel" icon="pi pi-times" onClick={() => setShowSchedulerDialog(false)}  />
          </div>
        }
        style={{ width: '50vw' }}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label className="text-base font-semibold" htmlFor="startDate">Start Date<span className="text-red-500">*</span></label>
            <Calendar
              id="startDate"
              value={schedulerData.startDate}
              minDate={new Date()}
              placeholder="Select scheduler start date"
              onChange={(e) => setSchedulerData({ ...schedulerData, startDate: e.value || null })}
              showTime
            />
          </div>
          <div className="p-field">
            <label className="text-base font-semibold" htmlFor="recurrencePattern">Email Recurrence Pattern<span className="text-red-500">*</span></label>
            <Dropdown
              id="recurrencePattern"
              value={schedulerData.recurrencePattern}
              placeholder="Select recurrence pattern"
              options={[
                { label: 'Get emails Daily', value: 'daily' },
                { label: 'Get emails Weekly', value: 'weekly' },
                { label: 'Get emails Monthly', value: 'monthly' },
                { label: 'Get emails Yearly', value: 'yearly' }
              ]}
              onChange={(e) => {
                setSchedulerData({
                  ...schedulerData,
                  recurrencePattern: e.value,
                  timeFrame: getTimeFrames(e.value)[0]?.value || ''
                });
              }}
            />
          </div>
          <div className="p-field">
            <label className="text-base font-semibold" htmlFor="emailAddress">Email Address<span className="text-red-500">*</span></label>
            <InputText
              id="emailAddress"
              value={schedulerData.emailAddress}
              placeholder="Enter Email Address"
              onChange={(e) => setSchedulerData({ ...schedulerData, emailAddress: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label className="text-base font-semibold" htmlFor="tableSelection">Table Selection<span className="text-red-500">*</span></label>
            <Dropdown
              id="tableSelection"
              value={schedulerData.tableSelection}
              placeholder="Select Table"
              options={[
                { label: 'Order Book Header', value: 'order_book_header' },
                { label: 'Order Book Line', value: 'order_book_line' },
                { label: 'Order Book Taxes', value: 'order_book_taxes' },
                { label: 'Return Order Header', value: 'return_order_header' },
                // { label: 'Return order line', value: 'return_order_line' }
              ]}
              onChange={(e) => setSchedulerData({ ...schedulerData, tableSelection: e.value })}
            />
          </div>
          <div className="p-field">
            <label className="text-base font-semibold" htmlFor="columnSelection">Column Selection<span className="text-red-500">*</span></label>
            <MultiSelect
              id="columnSelection"
              value={schedulerData.columnSelection}
              options={getTableColumns(data).slice(1)}
              selectAll={true}
              selectAllLabel={selectedColumns.length === getTableColumns(data).slice(1).length ? "Deselect All" : "Select All"}
              onChange={(e) => setSchedulerData({ ...schedulerData, columnSelection: e.value })}
              optionLabel="header"
              display="chip"
              placeholder="Select Columns"
            />
          </div>
          <div className="p-field">
            <label className="text-base font-semibold" htmlFor="timeFrame">Data Range<span className="text-red-500">*</span></label>
            <Dropdown
              id="timeFrame"
              value={schedulerData.timeFrame}
              placeholder="Select data range"
              options={getTimeFrames(schedulerData.recurrencePattern)}
              onChange={(e) => setSchedulerData({ ...schedulerData, timeFrame: e.value })}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};