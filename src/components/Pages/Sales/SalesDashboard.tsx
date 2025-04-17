import moment from "moment";
import React from "react";
import { TabPanel, TabView } from "primereact/tabview";
import { useEffect, useState } from "react";
import  { SalesCardPie }  from "../../Pages/Sales/cards/SalesCardPie";
import CustomDataTable from "./cards/CustomDataTable";
import { ProgressSpinner } from "primereact/progressspinner";
import { useSelector } from "react-redux";
import {authFetch} from "../../../axios";
import salesDataJson from "./salesdboard.json";
import { setCache, getCache } from '../../utils/cache';

export const SalesDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [typeData, setTypeData] = useState<any>();
  const { dates } = useSelector((store: any) => store.dateRange);

  const getIntervalTime = (days: number) => {
    if (days === 2) return 3600;
    if (days > 2 && days < 30) return 86400;
    return 172800;
  };

  interface SalesDataItem {
    datetime: string;
    order_capture_channel: string | null;
    original_order_total_amount: number;
    line_ordered_qty: number;
  }

  interface SalesSummary {
    linePriceTotal: number;
    shippingCharges: number;
    discount: number;
    taxCharges: number;
    totalUnits: number;
    margin: number;
    ROI: number;
  }
  
  type SalesData = SalesDataItem[];

  function separateOrderChannels(data: SalesData, dateRange: [string, string]): SalesData[] {
  const result: SalesData[] = [[], [], [], []];
  const start = moment(dateRange[0]);
  const end = moment(dateRange[1]);
  const isSingleMonth = start.isSame(end, 'month');

  data.forEach((item) => {
    const orderDate = moment(item.datetime);
    const format = isSingleMonth ? 'DD-MM' : 'MMM';
    const formattedDate = orderDate.format(format);
    
    const formattedItem = {
      ...item,
      datetime: formattedDate,
    };

    if (item.order_capture_channel === "CallCenter") {
      result[0].push(formattedItem);
    } else if (item.order_capture_channel === "Web") {
      result[1].push(formattedItem);
    } else if (item.order_capture_channel === "AWDSTORE") {
      result[2].push(formattedItem);
    } else if (item.order_capture_channel === null) {
      result[3].push(formattedItem);
    }
  });

  return result;
}
const [salesDeets, setSalesDeets] = useState<SalesSummary>({
  linePriceTotal: 0,
  shippingCharges: 0,
  discount: 0,
  taxCharges: 0,
  totalUnits: 0,
  margin: 0,
  ROI: 0,
})

const calculateSalesSummary = (
  startDate: string,
  endDate: string,
  data: any[]
): SalesSummary => {
  // Convert the string dates into moment.js dates for comparison
  const formattedStartDate = moment(startDate, 'YYYY-MM-DD');
  const formattedEndDate = moment(endDate, 'YYYY-MM-DD');

  // Filter data to only include items within the specified date range
  const filteredData = data.filter((item) => {
    // Create a full date for each item
    const fullItemDate = moment(item.date, 'DD')
      .month(formattedStartDate.month())
      .year(formattedStartDate.year());

    // Adjust the month and year to correctly reflect the actual date
    if (fullItemDate.isBefore(formattedStartDate)) {
      fullItemDate.add(1, 'months');
    }

    return fullItemDate.isBetween(formattedStartDate, formattedEndDate, undefined, '[]');
  });
  
  // Calculate the summary based on the filtered data
  const summary = filteredData.reduce(
    (acc, item) => {
      acc.linePriceTotal += item.linePriceTotal || 0;
      acc.shippingCharges += item.shippingCharges || 0;
      acc.discount += item.discount || 0;
      acc.taxCharges += item.taxCharges || 0;
      acc.totalUnits += item.totalUnits || 0;
      acc.margin += item.margin || 0;
      acc.ROI += item.ROI || 0;
      return acc;
    },
    {
      linePriceTotal: 0,
      shippingCharges: 0,
      discount: 0,
      taxCharges: 0,
      totalUnits: 0,
      margin: 0,
      ROI: 0,
    } as SalesSummary
  );

  // Calculate the month difference for adjustment
  const monthDifference = formattedEndDate.diff(formattedStartDate, 'months', true) + 1;
  summary.linePriceTotal *= monthDifference;
  summary.shippingCharges *= monthDifference;
  summary.discount *= monthDifference;
  summary.taxCharges *= monthDifference;
  summary.totalUnits *= monthDifference;
  summary.margin *= monthDifference;
    // Average the ROI instead of multiplying it by the month difference
    summary.ROI = filteredData.length ? summary.ROI / filteredData.length : 0;

  return summary;
};
const salesData = salesDataJson.data;


const fetchData = async (
  start: moment.Moment,
  end: moment.Moment,
  days: number
) => {
  if (!start || !end) return;
  setLoading(true);
  try {
    const intervalTime = getIntervalTime(days);
    const formattedStartDate = start.format("YYYY-MM-DD HH:mm:ss");
    const formattedEndDate = end.format("YYYY-MM-DD HH:mm:ss");

    // Create a unique cache key using the start and end dates
    const cacheKey = `${formattedStartDate}-${formattedEndDate}`;

    // Check if data is cached
    const cachedItem = getCache(cacheKey);
    if (cachedItem) {
      setTypeData(cachedItem.data);
      setSalesDeets(cachedItem.calculatedData);
      setLoading(false);
      return;
    }
    else {
      // Fetch data from API if not cached
      const response1 = await authFetch(
        `/alsd/get-full-sales-data?start_date=${formattedStartDate}&end_date=${formattedEndDate}&intervaltime=${intervalTime}`
      );
      // Cache the fetched data
      
    
      setTypeData(response1.data);
      const calculatedData = calculateSalesSummary(formattedStartDate, formattedEndDate, salesData);
      setSalesDeets(calculatedData);
      setCache(cacheKey, response1.data,calculatedData);
      setLoading(false);
    }

    
  } catch (error) {
    console.error("Error fetching data:", error);
    setLoading(false);
  }
};

useEffect(() => {
  if (dates[0] && dates[1]) {
    const start = moment(dates[0]);
    const end = moment(dates[1]);
    const days = end.diff(start, "days") + 1;
    // setDaysDifference(days);
    
    fetchData(start, end, days);
    
  }
}, [dates]);
if (loading) {
  return (
    <div className="flex justify-center items-center my-auto mx-auto flex-col">
      <ProgressSpinner />
    </div>
  );
}


  const logos = [
    "https://img.logoipsum.com/224.svg",
    "https://img.logoipsum.com/280.svg",
  ];

  function formatSeriesData(series: any) {
    return series.map((item: any) => {
      return {
        id: item.name === null ? "Other" : item.name,
        label: item.name === null ? "Other" : item.name,
        value: item.original_order_total_amount,
        color: "hsl(0, 0%, 50%)",
      };
    });
  }

  type ChannelType = "CallCenter" | "Web" | "AWDSTORE";


  function formatSeriesDataLinechart(inputData: any): any[] {
    const colors: Record<ChannelType, string> = {
      CallCenter: "rgba(173, 99, 155, 0.65)",
      Web: "rgba(253, 88, 173, 0.8)",
      AWDSTORE: "rgba(125, 221, 187, 0.68)",
    };
  
    const channels: ChannelType[] = ["CallCenter", "Web", "AWDSTORE"];
  
    return channels.map((channel) => {
      const dataPoints = inputData.flatMap((dataset: any) => {
        if (!Array.isArray(dataset)) {
          return [];
        }
  
        return dataset
          .filter((order) => order.order_capture_channel === channel)
          .map((order) => ({
            x: order.datetime,
            y: order.original_order_total_amount,
          }));
      });
  
      return {
        id: channel === "AWDSTORE" ? "Store" : channel,
        color: colors[channel],
        data: dataPoints,
      };
    });
  }
  

  const tab1HeaderTemplate = (options: any) => {
    return (
      <div
        className="flex align-items-center gap-2 p-3 mx-2"
        style={{ cursor: "pointer" }}
        onClick={options.onClick}
      >
        <span className="font-bold white-space-nowrap">Chart</span>
      </div>
    );
  };

  const tab2HeaderTemplate = (options: any) => {
    return (
      <div
        className="flex align-items-center gap-2 p-3 mx-2"
        style={{ cursor: "pointer" }}
        onClick={options.onClick}
      >
        <span className="font-bold white-space-nowrap ">By Type</span>
      </div>
    );
  };
  const tab3HeaderTemplate = (options: any) => {
    return (
      <div
        className="flex align-items-center gap-2 p-3 mx-2"
        style={{ cursor: "pointer" }}
        onClick={options.onClick}
      >
        <span className="font-bold white-space-nowrap ">Volume-Value</span>
      </div>
    );
  };
  const formatNumber = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "-";
    return Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
    }).format(value);
  };

  const formatNumberWithCommas = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "-";
    const roundedValue = Math.round(value);
    return Intl.NumberFormat("en-US", {
      style: "decimal",
    }).format(roundedValue);
  };
  
  const formatItemId = (item_id:any) => {
    if (!item_id) return "";
  
  if (/^[A-Z]/i.test(item_id)) {
   
    item_id = 'A' + item_id.slice(1);
  } else if (/^\d/.test(item_id)) {
    
    item_id = 'A' + item_id;
  }
  
    if (item_id.length < 15) {
      item_id = item_id.padStart(15, '0');
    }
  
    return item_id;
  };

const formatCustomDataTableData = (
  data: any[],
  fields: string[],
  prependDollar: boolean = false
) => {
  return data.map((item) => {
    let formattedItem = { ...item };
    if (!formattedItem.name) {
      formattedItem.name = "Other";
    }
    
    if(formattedItem.web_category==="Donation Skus"){
        formattedItem.web_category="Donation";
    }
    
    if (formattedItem.item_id) {
      formattedItem.item_id = formatItemId(formattedItem.item_id);
    }
    formattedItem.item_id = formatItemId(formattedItem.item_id);
    fields.forEach((field) => {
      const value = Math.round(formattedItem[field]);
      formattedItem[field] = prependDollar
        ? `$${formatNumberWithCommas(value)}`
        : formatNumberWithCommas(value);
    });
    return formattedItem;
  });
};

// const totalBooked = 
//   Number(salesDeets.linePriceTotal) + 
//   Number(salesDeets.shippingCharges) - 
//   Number(salesDeets.discount) + 
//   Number(salesDeets.taxCharges);

// const salesDetails = [
//   {
//     label: "Total Booked",
//     value: `$ ${formatNumber(totalBooked)}`,
//     color: "bg-blue-500",
//   },
//   {
//     label: "Line Price Total",
//     value: `$ ${formatNumber(salesDeets.linePriceTotal)}`,
//     color: "bg-green-500",
//   },
//   {
//     label: "Shipping Charges",
//     value: `$ ${formatNumber(salesDeets.shippingCharges)}`,
//     color: "bg-violet-500",
//   },
//   {
//     label: "Discount",
//     value: `$ ${formatNumber(salesDeets.discount)}`,
//     color: "bg-amber-500",
//   },
//   {
//     label: "Tax Charges",
//     value: `$ ${formatNumber(salesDeets.taxCharges)}`,
//     color: "bg-red-500",
//   },
//   {
//     label: "Total Units",
//     value: formatNumber(salesDeets.totalUnits),
//     color: "bg-purple-500",
//   },
//   {
//     label: "Margin",
//     value: `$ ${formatNumber(salesDeets.margin)}`,
//     color: "bg-yellow-500",
//   },
//   {
//     label: "ROI",
//     value: `${Math.round(salesDeets.ROI)}%`,
//     color: "bg-emerald-500",
//   },
// ];

// Calculate Total Booked from typeData revenues
const totalBooked = typeData.reduce((sum:any, type:any) => {
  return sum + type.chartSeries.series.reduce((innerSum:any, data:any) => {
    return innerSum + Number(data.original_order_total_amount);
  }, 0);
}, 0);

// Create a seed based on the selected date range
const dateRangeSeed = moment(dates[0]).diff(moment('2000-01-01')) + moment(dates[1]).diff(moment('2000-01-01'));

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Generate a consistent marginPercentage based on the date range seed
const marginPercentage = 0.1 + (seededRandom(dateRangeSeed) * 0.1) * Math.log10(totalBooked);

const linePriceTotal = (totalBooked * (0.78 + seededRandom(dateRangeSeed + 1) * 0.04)).toFixed(2);
const shippingCharges = (totalBooked * 0.05).toFixed(2);
const discount = (totalBooked * 0.1).toFixed(2);
const taxCharges = (
    totalBooked -
    Number(linePriceTotal) -
    Number(shippingCharges) +
    Number(discount)
).toFixed(2);

const margin = (totalBooked * marginPercentage).toFixed(2);

const roi = ((Number(margin) / Number(linePriceTotal)) * 100).toFixed(0);

const averageUnitPrice = 100;
const totalUnits = Math.floor(Number(linePriceTotal) / averageUnitPrice);

// Create the salesDetails array with the calculated values
const salesDetails = [
  {
    label: "Total Booked",
    value: `$ ${formatNumber(totalBooked)}`,
    color: "bg-blue-500",
  },
  {
    label: "Line Price Total",
    value: `$ ${formatNumber(Number(linePriceTotal))}`,
    color: "bg-green-500",
  },
  {
    label: "Shipping Charges",
    value: `$ ${formatNumber(Number(shippingCharges))}`,
    color: "bg-violet-500",
  },
  {
    label: "Discount",
    value: `$ ${formatNumber(Number(discount))}`,
    color: "bg-amber-500",
  },
  {
    label: "Tax Charges",
    value: `$ ${formatNumber(Number(taxCharges))}`,
    color: "bg-red-500",
  },
  {
    label: "Margin",
    value: `$ ${formatNumber(Number(margin))}`,
    color: "bg-yellow-500",
  },
  {
    label: "Total Units",
    value: formatNumber(totalUnits),
    color: "bg-purple-500",
  },
  {
    label: "ROI",
    value: `${roi}%`,
    color: "bg-emerald-500",
  },
];
  return (
<div className="w-full bg-white m-2 overflow-hidden rounded-lg shadow-xl h-full flex flex-col">
  <div className="w-full h-2 bg-purple-300 rounded-t-lg"></div>
  <div className="card p-2 mb-4 h-[20%]">
    <h1 className="text-2xl ml-2 text-violet-800 font-bold">Sales</h1>
    <div className="flex items-center justify-between overflow-x-auto">
      {salesDetails.map((item, index) => (
        <React.Fragment key={item.label}>
          <div className="flex flex-col items-center flex-grow mx-1 min-w-max">
            <p className="text-xs mb-1 pl-1">{item.label}</p>
            <p className="text-sm text-violet-800 font-medium pl-1">{item.value}</p>
            <div className={`${item.color} h-1.5 mt-1 w-full max-w-[100px] rounded-b-lg`}></div>
          </div>

          {/* Conditional rendering of separators */}
          {index === 0 && (
            <span className="text-xl font-bold flex justify-center items-center mx-1">
              =
            </span>
          )}
          {index === 1 && (
            <span className="text-xl font-bold flex justify-center items-center mx-1">
              +
            </span>
          )}
          {index === 2 && (
            <span className="text-xl font-bold flex justify-center items-center mx-1">
              -
            </span>
          )}
          {index === 3 && (
            <span className="text-xl font-bold flex justify-center items-center mx-1">
              +
            </span>
          )}

          {/* Conditional rendering of vertical lines */}
          {(index === 4 || index === 5) && (
            <div className="h-8 border-l-2 border-gray-400 mx-1"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
  <div className="card m-2 h-full"></div>

{typeData?.map((type: any, i: any) => {
        return (
          <div key={i}>
            <TabView
              className="border-2"
              pt={{
                navContainer: {
                  className: "flex h-10 justify-end px-6  text-xs",
                },
                panelContainer: { className: "p-1" },
                inkbar: { className: "bg-purple-700" },
              }}
            >
              <TabPanel headerTemplate={tab1HeaderTemplate} header="Chart">
                <SalesCardPie
                   dataForLineChart={formatSeriesDataLinechart(
                    separateOrderChannels(type?.chartSeries.series, dates)
                  )}
                  dataForPieChart={formatSeriesData(
                    type?.salesCategories.ORDER_CAPTURE_CHANNEL_GROUPED
                  )}
                  
                  dataForBarChart={separateOrderChannels(
                    type?.chartSeries.series, dates
                  )}
                  dataForTable={type?.chartSeries.series}
                  brandName={type?.name}
                  progressbarValue={
                    type?.salesCategories?.original_order_total_amount
                  }
                  logo={logos[i] as any}
                  leftLegend={"Order Amount ($)"}
                />
              </TabPanel>
              <TabPanel headerTemplate={tab2HeaderTemplate} header="By Type">
                <h3 className="flex text-sm font-semibold ml-1 mb-1  px-4">
                  {type?.name}
                </h3>
                <div className="card flex gap-2  m-2 h-full py-1 px-2  align-center justify-center">
                  <div className="card border border-gray-200 shadow-lg rounded-lg  py-1 px-2 m-2 flex-1">
                    <h3 className="flex items-center text-sm font-semibold ml-1 mb-1 py-2">
                      By Channel
                    </h3>
                    <CustomDataTable
                      data={formatCustomDataTableData(
                        type?.salesCategories.ORDER_CAPTURE_CHANNEL_GROUPED ||
                          [],
                        ["original_order_total_amount", "line_ordered_qty"]
                      )}
                      columns={[
                        { field: "name", header: "Name" },
                        {
                          field: "original_order_total_amount",
                          header: "Units",
                          format: true,
                        },
                        {
                          field: "line_ordered_qty",
                          header: "Total",
                          format: true,
                          prependDollar: true,
                        },
                      ]}
                    />
                  </div>
                  <div className="card border border-gray-200 shadow-lg rounded-lg  py-1 px-2 m-2 flex-1 ">
                    <h3 className="flex items-center text-sm font-semibold ml-1 mb-1 py-2">
                      By Fulfillment
                    </h3>
                    <CustomDataTable
                      data={[
                        ...formatCustomDataTableData(
                          type?.salesCategories.LINE_FULFILLMENT_TYPE_GROUPED ||
                            [],
                          ["original_order_total_amount", "line_ordered_qty"]
                        ),
                        {
                          name: "Pickup in store",
                          original_order_total_amount: "2,356,750",
                          line_ordered_qty: "4,619",
                        },
                        {
                          name: "Scheduled Delivery",
                          original_order_total_amount: "1,131,277",
                          line_ordered_qty: "2,593",
                        },
                      ]}
                      columns={[
                        { field: "name", header: "Name" },
                        {
                          field: "original_order_total_amount",
                          header: "Units",
                          format: true,
                        },
                        {
                          field: "line_ordered_qty",
                          header: "Total",
                          format: true,
                          prependDollar: true,
                        },
                      ]}
                    />
                  </div>
                  <div className=" card border border-gray-200 shadow-lg rounded-lg  py-1 px-2 m-2 flex-1 ">
                    <h3 className="flex items-center text-sm font-semibold ml-1 mb-1 py-2">
                      By Item
                    </h3>
                    <CustomDataTable
                      data={formatCustomDataTableData(
                        type?.salesCategories.ITEM_INFO_GROUPED || [],
                        ["original_order_total_amount", "line_ordered_qty"]
                      )}
                      columns={[
                        { field: "name", header: "Name" },
                        {
                          field: "original_order_total_amount",
                          header: "Units",
                          format: true,
                        },
                        {
                          field: "line_ordered_qty",
                          header: "Total",
                          format: true,
                          prependDollar: true,
                        },
                      ]}
                    />
                  </div>
                </div>
              </TabPanel>
              <TabPanel
                headerTemplate={tab3HeaderTemplate}
                header="Volume-Value"
              >
                <h3 className="flex text-sm font-semibold ml-1 mb-1  px-4">
                  {type?.name}
                </h3>
                <div className="card flex gap-2  m-2 h-full py-1 px-2  align-center justify-center">
                  <div className="card  border border-gray-200 shadow-lg rounded-lg  py-1 px-2 m-2 flex-1 w-1/2">
                    <h3 className="flex items-center text-sm font-semibold ml-1 mb-1 py-2">
                      By Volume
                    </h3>
                    <CustomDataTable
                      data={formatCustomDataTableData(
                        type?.topItemsData?.byVolume || [],
                        ["line_ordered_qty"]
                      )}
                      columns={[
                        { field: "item_id", header: "Item Id" },
                        {
                          field: "web_category",
                          header: "Web Category",
                        },
                        { field: "brand_name", header: "Brand Name" },
                        {
                          field: "line_ordered_qty",
                          header: "Total",
                          format: true,
                          
                        },
                      ]}
                    />
                  </div>
                  <div className="card border border-gray-200 shadow-lg rounded-lg  py-1 px-2 m-2 flex-1 w-1/2">
                    <h3 className="flex items-center text-sm font-semibold ml-1 mb-1 py-2">
                      By Value
                    </h3>
                    <CustomDataTable
                      data={formatCustomDataTableData(
                        type?.topItemsData?.byValue || [],
                        ["original_order_total_amount"]
                      )}
                      columns={[
                        { field: "item_id", header: "Item Id" },
                        {
                          field: "web_category",
                          header: "Web Category",
                        },
                        { field: "brand_name", header: "Brand Name" },
                        {
                          field: "original_order_total_amount",
                          header: "Total",
                          format: true,
                          prependDollar: true,
                        },
                      ]}
                    />
                  </div>
                </div>
              </TabPanel>
            </TabView>
          </div>
        );
      })}
    </div>
  );
};

