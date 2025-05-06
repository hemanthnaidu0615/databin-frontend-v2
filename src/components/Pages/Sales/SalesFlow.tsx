// import { useEffect, useState } from "react";
// import { TreeNode } from "primereact/treenode";
// import { Slider } from "primereact/slider";
// import { Button } from "primereact/button";
// import { ProgressSpinner } from "primereact/progressspinner";
// import OrgChart from "../Sales/charts/OrgChart"; // Adjust path if needed

// const dummyData = [
//   {
//     key: "Sales",
//     original_order_total_amount: 2700000,
//     fulfillment_rate: 95,
//     capture_channel: "Web",
//     children: [
//       {
//         key: "AWD",
//         original_order_total_amount: 780000,
//         fulfillment_rate: 90,
//         capture_channel: "Mobile",
//         children: [
//           { key: "Loyalty-Points", original_order_total_amount: 9000, fulfillment_rate: 85, capture_channel: "Web" },
//           { key: "Budget-Offer", original_order_total_amount: 59000, fulfillment_rate: 92, capture_channel: "InStore" },
//           { key: "Complimentary-Product", original_order_total_amount: 2400, fulfillment_rate: 88, capture_channel: "Web" },
//           { key: "Enrollment", original_order_total_amount: 14000, fulfillment_rate: 93, capture_channel: "Email" },
//           { key: "Guarantee-Protection", original_order_total_amount: 94500, fulfillment_rate: 90, capture_channel: "Mobile" },
//           { key: "Guidance-Sessions", original_order_total_amount: 18500, fulfillment_rate: 86, capture_channel: "Web" },
//           { key: "Online-Access", original_order_total_amount: 5900, fulfillment_rate: 89, capture_channel: "Mobile" },
//           { key: "Pre-Owned-Classics", original_order_total_amount: 57000, fulfillment_rate: 91, capture_channel: "InStore" },
//           { key: "Seller-Serviced", original_order_total_amount: 2800, fulfillment_rate: 80, capture_channel: "Web" },
//           { key: "Standard", original_order_total_amount: 420000, fulfillment_rate: 94, capture_channel: "Web" },
//         ],
//       },
//       {
//         key: "AWW",
//         original_order_total_amount: 1700000,
//         fulfillment_rate: 88,
//         capture_channel: "Web",
//         children: [
//           { key: "Budget-Offer", original_order_total_amount: 203000, fulfillment_rate: 89, capture_channel: "InStore" },
//           { key: "Complimentary-Product", original_order_total_amount: 2800, fulfillment_rate: 87, capture_channel: "Web" },
//           { key: "Guarantee-Protection", original_order_total_amount: 15000, fulfillment_rate: 92, capture_channel: "Email" },
//           { key: "Online-Access", original_order_total_amount: 1800, fulfillment_rate: 90, capture_channel: "Web" },
//           { key: "Pre-Owned-Classics", original_order_total_amount: 58500, fulfillment_rate: 93, capture_channel: "Mobile" },
//           { key: "Seller-Serviced", original_order_total_amount: 3300, fulfillment_rate: 80, capture_channel: "Web" },
//           { key: "Standard", original_order_total_amount: 1410000, fulfillment_rate: 96, capture_channel: "Web" },
//           { key: "Virtual-Recognition", original_order_total_amount: 100, fulfillment_rate: 70, capture_channel: "Web" },
//         ],
//       },
//     ],
//   },
// ];

// const SalesFlow = () => {
//   const [data, setData] = useState<TreeNode[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [type, setType] = useState("item-info");
//   const [activeType, setActiveType] = useState("item-info");
//   const [zoomValue, setZoomValue] = useState(50);
//   const [theme, setTheme] = useState<string>(document.documentElement.classList.contains("dark") ? "dark" : "light");

//   const numberFormatter = new Intl.NumberFormat("en-US", {
//     notation: "compact",
//     compactDisplay: "short",
//   });

//   const simulateFetchData = (selectedType: string) => {
//     setLoading(true);
//     setTimeout(() => {
//       const converted = convertData(dummyData);
//       setData(converted);
//       setLoading(false);
//     }, 500);
//   };

//   const convertData = (rawData: any[]): TreeNode[] => {
//     const total = rawData.reduce((acc, item) => acc + item.original_order_total_amount, 0);

//     return rawData.map((item) => {
//       const dollarValue = numberFormatter.format(item.original_order_total_amount);
//       const percentage =
//         total > 0 ? ((item.original_order_total_amount / total) * 100).toFixed(2) + "%" : "0%";

//       let nodeLabel = "";
//       if (type === "item-info") {
//         nodeLabel = `$${dollarValue} ${percentage}`;
//       } else if (type === "fulfillment") {
//         nodeLabel = item.fulfillment_rate !== undefined ? `${item.fulfillment_rate}% Fulfillment` : "N/A";
//       } else if (type === "order_capture_channel") {
//         nodeLabel = item.capture_channel || "Unknown Channel";
//       }

//       // Add theme-based classes for light and dark themes
//       const isDark = theme === "dark";
//       return {
//         label: item.key || "Others",
//         expanded: !!item.children,
//         data: nodeLabel,
//         children: item.children ? convertData(item.children) : [],
//         className: `text-sm rounded-md shadow-md px-2 py-1 
//           ${isDark ? "bg-white text-gray-900 border border-gray-600" : "bg-blue-100 text-gray-700"}`,
//       };
//     });
//   };

//   const handleSelectingType = (newType: string) => {
//     setActiveType(newType);
//     setType(newType);
//     localStorage.setItem("selectedType", newType);
//     simulateFetchData(newType);
//   };

//   const handleZoomChange = (e: any) => setZoomValue(e.value);
//   const incrementZoom = () => setZoomValue((prev) => Math.min(prev + 10, 100));
//   const decrementZoom = () => setZoomValue((prev) => Math.max(prev - 10, 0));

//   useEffect(() => {
//     const savedType = localStorage.getItem("selectedType");
//     if (savedType) {
//       setActiveType(savedType);
//       setType(savedType);
//       simulateFetchData(savedType);
//     } else {
//       simulateFetchData(type);
//     }

//     // Add theme change listener
//     const themeChangeListener = () => {
//       setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
//     };

//     document.documentElement.addEventListener("themechange", themeChangeListener);

//     return () => {
//       document.documentElement.removeEventListener("themechange", themeChangeListener);
//     };
//   }, []);

//   const buttonData = [
//     { name: "Item Info", value: "item-info" },
//     { name: "Fulfillment", value: "fulfillment" },
//     { name: "Order Channel", value: "order_capture_channel" },
//   ];

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-full dark:bg-gray-900">
//         <ProgressSpinner />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col flex-1 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-xl p-4 m-4 border border-gray-200 dark:border-gray-700">
//       <div className="w-full h-1 bg-blue-300 dark:bg-blue-600 rounded-full mb-4"></div>
//       <h1 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4">Sales Flow (Dummy)</h1>

//       <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
//         <div className="flex gap-2">
//           {buttonData.map((btn) => (
//             <Button
//               key={btn.value}
//               className={`text-sm px-4 py-2 rounded-lg shadow transition-all duration-200 w-full sm:w-auto ${
//                 activeType === btn.value
//                   ? "bg-blue-600 text-white"
//                   : "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200"
//               }`}
//               onClick={() => handleSelectingType(btn.value)}
//             >
//               {btn.name}
//             </Button>
//           ))}
//         </div>

//         <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
//           <i className="pi pi-search-minus cursor-pointer hidden sm:block" onClick={decrementZoom}></i>
//           <Slider
//             value={zoomValue}
//             onChange={handleZoomChange}
//             className="w-24 sm:w-32"
//             step={10}
//             min={0}
//             max={100}
//           />
//           <i className="pi pi-search-plus cursor-pointer hidden sm:block" onClick={incrementZoom}></i>
//         </div>
//       </div>

//       <div
//         className="overflow-auto border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 p-4"
//         style={{ height: "calc(100vh - 250px)" }}
//       >
//         <OrgChart data={data} zoom={zoomValue} />
//       </div>
//     </div>
//   );
// };

// export default SalesFlow;





// import { TreeNode } from "primereact/treenode";
// import { authFetch } from "../../../axios";
// import OrgChart from "../Sales/charts/OrgChart";
// import { useEffect, useState } from "react";
// import { ProgressSpinner } from "primereact/progressspinner";
// import { Button } from "primereact/button";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { setCache, getCache } from "../../utils/salesflowcache";
// import { Slider } from "primereact/slider";

// const SalesFlow = () => {
//   const [data, setData] = useState<TreeNode[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [type, setType] = useState("item-info");
//   const [zoomValue, setZoomValue] = useState(20);
//   const [activeType, setActiveType] = useState(type);
//   const [theme, setTheme] = useState<string>(document.documentElement.classList.contains("dark") ? "dark" : "light");

//   const { dates } = useSelector((store: any) => store.dateRange);

//   const numberFormatter = new Intl.NumberFormat("en-US", {
//     notation: "compact",
//     compactDisplay: "short",
//   });

//   const fetchData = async (type: string) => {
//     setLoading(true);

//     const formattedStartDate = moment(dates[0]).format("YYYY-MM-DD");
//     const formattedEndDate = moment(dates[1]).format("YYYY-MM-DD");
//     const cacheKey = `${formattedStartDate}_${formattedEndDate}_${type}`;

//     const cachedData = getCache(cacheKey);
//     if (cachedData) {
//       setData(cachedData.data);
//       setLoading(false);
//       return;
//     }

//     const response = await authFetch(
//       `/sales/getOrgChartData?start_date=${formattedStartDate}&end_date=${formattedEndDate}&type=${type}`
//     );

//     setData(response.data);
//     setCache(cacheKey, response.data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchData(type);
//   }, [dates, type]);

//   useEffect(() => {
//     const savedType = localStorage.getItem("selectedType");
//     const initialType = savedType || type;
//     setActiveType(initialType);
//     setType(initialType);
//     fetchData(initialType);

//     const themeChangeListener = () => {
//       setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
//     };

//     document.documentElement.addEventListener("themechange", themeChangeListener);
//     return () => {
//       document.documentElement.removeEventListener("themechange", themeChangeListener);
//     };
//   }, [dates]);

//   function handleSelectingType(newType: string) {
//     setActiveType(newType);
//     setType(newType);
//     localStorage.setItem("selectedType", newType);
//     fetchData(newType);
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center my-auto mx-auto">
//         <ProgressSpinner />
//       </div>
//     );
//   }

//   const convertData = (data: any[]): TreeNode[] => {
//     const total = data.reduce((acc: number, item: any) => acc + item.original_order_total_amount, 0);

//     return data.map((item: any) => {
//       const dollarValue = numberFormatter.format(item.original_order_total_amount);
//       const percentage = total > 0 ? ((item.original_order_total_amount / total) * 100).toFixed(2) + "%" : "0%";
//       const label = item.key || "Others";

//       return {
//         label,
//         expanded: item.children ? true : false,
//         data: `$${dollarValue} ${percentage}`,
//         children: item.children ? convertData(item.children) : [],
//         className: `text-sm rounded-md shadow-md px-2 py-1 
//           ${theme === "dark" ? "bg-white text-gray-900 border border-gray-600" : "bg-purple-200 text-gray-800"}`
//       };
//     });
//   };

//   const handleZoomChange = (e: any) => setZoomValue(e.value);
//   const incrementZoom = () => setZoomValue((prev) => Math.min(prev + 10, 100));
//   const decrementZoom = () => setZoomValue((prev) => Math.max(prev - 10, 0));

//   const buttonData = [
//     { name: "Item Info", value: "item-info" },
//     { name: "Order Capture Channel", value: "order_capture_channel" },
//     { name: "Fulfillment", value: "fulfillment" },
//   ];

//   return (
//     <div className="flex-1 flex flex-col gap-6 rounded-lg">
//       <div className="flex flex-wrap justify-between items-center">
//         {/* Button group */}
//         <div className="flex flex-wrap gap-2 m-2 w-full sm:w-auto">
//           {buttonData.map((btn, index) => (
//             <Button
//               key={index}
//               className={`p-2 text-sm border-0 ${
//                 activeType === btn.value ? "bg-purple-600" : "bg-purple-500"
//               } w-full sm:w-auto`}
//               onClick={() => handleSelectingType(btn.value)}
//               style={{ transition: "background-color 0.3s" }}
//             >
//               {btn.name}
//             </Button>
//           ))}
//         </div>

//         {/* Zoom controls */}
//         <div className="flex items-center gap-2 mr-6 mt-4 sm:mt-0">
//           <i className="pi pi-search-minus" onClick={decrementZoom}></i>
//           <Slider
//             value={zoomValue}
//             onChange={handleZoomChange}
//             className="w-32"
//             step={10}
//             min={0}
//             max={100}
//           />
//           <i className="pi pi-search-plus" onClick={incrementZoom}></i>
//         </div>
//       </div>

//       {/* OrgChart container */}
//       <div
//         className={`overflow-auto flex-1 p-4 border rounded-lg ${
//           theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
//         }`}
//         style={{ height: "calc(100vh - 250px)" }}
//       >
//         <OrgChart data={convertData(data)} zoom={zoomValue} />
//       </div>
//     </div>
//   );
// };

// export default SalesFlow;








// import { useState } from "react";
// import { Button } from "primereact/button";
// import classNames from "classnames";

// const dummyData = [
//   {
//     key: "AWD",
//     original_order_total_amount: 780000,
//     fulfillment_rate: 90,
//     capture_channel: "Mobile",
//     children: [
//       { key: "Loyalty-Points", original_order_total_amount: 9000, fulfillment_rate: 85, capture_channel: "Web" },
//       { key: "Budget-Offer", original_order_total_amount: 59000, fulfillment_rate: 92, capture_channel: "InStore" },
//       { key: "Complimentary-Product", original_order_total_amount: 2400, fulfillment_rate: 88, capture_channel: "Web" },
//       { key: "Enrollment", original_order_total_amount: 14000, fulfillment_rate: 93, capture_channel: "Email" },
//       { key: "Guarantee-Protection", original_order_total_amount: 94500, fulfillment_rate: 90, capture_channel: "Mobile" },
//       { key: "Guidance-Sessions", original_order_total_amount: 18500, fulfillment_rate: 86, capture_channel: "Web" },
//       { key: "Online-Access", original_order_total_amount: 5900, fulfillment_rate: 89, capture_channel: "Mobile" },
//       { key: "Pre-Owned-Classics", original_order_total_amount: 57000, fulfillment_rate: 91, capture_channel: "InStore" },
//       { key: "Seller-Serviced", original_order_total_amount: 2800, fulfillment_rate: 80, capture_channel: "Web" },
//       { key: "Standard", original_order_total_amount: 420000, fulfillment_rate: 94, capture_channel: "Web" },
//     ],
//   },
//   {
//     key: "AWW",
//     original_order_total_amount: 1700000,
//     fulfillment_rate: 88,
//     capture_channel: "Web",
//     children: [
//       { key: "Budget-Offer", original_order_total_amount: 203000, fulfillment_rate: 89, capture_channel: "InStore" },
//       { key: "Complimentary-Product", original_order_total_amount: 2800, fulfillment_rate: 87, capture_channel: "Web" },
//       { key: "Guarantee-Protection", original_order_total_amount: 15000, fulfillment_rate: 92, capture_channel: "Email" },
//       { key: "Online-Access", original_order_total_amount: 1800, fulfillment_rate: 90, capture_channel: "Web" },
//       { key: "Pre-Owned-Classics", original_order_total_amount: 58500, fulfillment_rate: 93, capture_channel: "Mobile" },
//       { key: "Seller-Serviced", original_order_total_amount: 3300, fulfillment_rate: 80, capture_channel: "Web" },
//       { key: "Standard", original_order_total_amount: 1410000, fulfillment_rate: 96, capture_channel: "Web" },
//       { key: "Virtual-Recognition", original_order_total_amount: 100, fulfillment_rate: 70, capture_channel: "Web" },
//     ],
//   },
// ];

// const numberFormatter = new Intl.NumberFormat("en-US", {
//   notation: "compact",
//   compactDisplay: "short",
// });

// const FILTER_BUTTONS = [
//   { name: "Item Info", value: "item-info" },
//   { name: "Fulfillment", value: "fulfillment" },
//   { name: "Order Channel", value: "order_capture_channel" },
// ];

// const fulfillmentKeys = ["Guarantee-Protection", "Guidance-Sessions", "Online-Access"];

// const SalesFlowCards = () => {
//   const [expandedKey, setExpandedKey] = useState<string | null>(null);
//   const [activeFilter, setActiveFilter] = useState<string | null>(null);

//   const totalSales = dummyData.reduce((acc, div) => {
//     return acc + div.original_order_total_amount;
//   }, 0);

//   const getDisplayText = (item: any) => {
//     const amount = `💰 $${numberFormatter.format(item.original_order_total_amount)}`;
//     const fulfillment = `📈 ${item.fulfillment_rate}% Fulfillment`;
//     const channel = `📡 ${item.capture_channel}`;
//     return `${amount} | ${fulfillment} | ${channel}`;
//   };

//   const filteredChildren = (children: any[]) => {
//     if (!activeFilter) return children;
//     if (activeFilter === "fulfillment") {
//       return children.filter((child) => fulfillmentKeys.includes(child.key));
//     }
//     // Extend this for other filters like item-info or order_capture_channel
//     return children;
//   };

//   return (
//     <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
//       <h1 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4">
//         Sales Flow (Dummy)
//       </h1>

//       {/* Filter Buttons */}
//       <div className="flex gap-4 mb-6">
//         {FILTER_BUTTONS.map((btn) => (
//           <Button
//             key={btn.value}
//             label={btn.name}
//             onClick={() =>
//               setActiveFilter((prev) => (prev === btn.value ? null : btn.value))
//             }
//             className={classNames("px-4 py-2 text-white font-medium rounded-md", {
//               "bg-[#9614d0] hover:bg-[#8417b2]": activeFilter === btn.value,
//               "bg-blue-600 hover:bg-blue-700": activeFilter !== btn.value,
//             })}
//           />
//         ))}
//       </div>

//       {/* Total Sales Node */}
//       <div className="text-center mb-10">
//         <div className="inline-block bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 rounded-xl shadow">
//           <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200">Sales</h2>
//           <p className="text-sm text-gray-700 dark:text-gray-300">
//             💰 ${numberFormatter.format(totalSales)} | 100% Total
//           </p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {dummyData.map((division) => (
//           <div
//             key={division.key}
//             className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-300 dark:border-gray-700"
//           >
//             <div className="flex justify-between items-center">
//               <div>
//                 <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200">
//                   {division.key}
//                 </h2>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">{getDisplayText(division)}</p>
//               </div>
//               <Button
//                 label={expandedKey === division.key ? "Hide Details" : "View Details"}
//                 className="text-sm"
//                 onClick={() =>
//                   setExpandedKey((prev) => (prev === division.key ? null : division.key))
//                 }
//               />
//             </div>

//             {expandedKey === division.key && (
//               <div className="mt-4 border-t pt-3 overflow-x-auto">
//                 <h3 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-300">
//                   Sub-categories:
//                 </h3>
//                 <div className="flex gap-4 flex-wrap">
//                   {filteredChildren(division.children).map((child) => (
//                     <div
//                       key={child.key}
//                       className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm text-gray-700 dark:text-gray-200 min-w-[200px] shadow"
//                     >
//                       <strong>{child.key}</strong>
//                       <p>{getDisplayText(child)}</p>
//                     </div>
//                   ))}
//                   {filteredChildren(division.children).length === 0 && (
//                     <p className="text-gray-500 text-sm italic">No results for this filter.</p>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SalesFlowCards;










// import React, { useEffect, useRef, useState } from "react";
// import * as d3 from "d3";
// import { HierarchyLink } from "d3-hierarchy";
// import { Button } from "primereact/button";

// // Make sure these styles are globally included
// import 'primereact/resources/themes/lara-light-indigo/theme.css';
// import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';

// const SalesFlowChart = () => {
//   const svgRef = useRef(null);
//   const [layout, setLayout] = useState<"vertical" | "horizontal">("vertical");

//   const data = {
//     key: "Sales",
//     amount: 2700000,
//     children: [
//       {
//         key: "AWD",
//         amount: 800000,
//         children: [
//           { key: "Standard", amount: 420000 },
//           { key: "Budget-Offer", amount: 59000 },
//           { key: "Complimentary-Product", amount: 3400 },
//           { key: "Enrollment", amount: 31000 },
//           { key: "Customer-Protection", amount: 95000 },
//           { key: "Guidance-Session", amount: 5700 },
//           { key: "Online-Access", amount: 5600 },
//           { key: "Pre-Owned-Classick", amount: 55700 },
//           { key: "Seller-Serviced", amount: 2700 },
//         ],
//       },
//       {
//         key: "AWW",
//         amount: 1900000,
//         children: [
//           { key: "Standard", amount: 1410000 },
//           { key: "Budget-Offer", amount: 103000 },
//           { key: "Complimentary-Product", amount: 2500 },
//           { key: "Customer-Protection", amount: 75000 },
//           { key: "Online-Access", amount: 5800 },
//           { key: "Pre-Owned-Classick", amount: 58500 },
//           { key: "Seller-Serviced", amount: 1300 },
//           { key: "Virtual-Recognition", amount: 500 },
//         ],
//       },
//     ],
//   };

//   useEffect(() => {
//     if (!svgRef.current) return;

//     const margin = { top: 50, right: 100, bottom: 50, left: 100 };
//     const width = 1400 - margin.left - margin.right;
//     const height = 600 - margin.top - margin.bottom;

//     d3.select(svgRef.current).selectAll("*").remove(); // Clear previous

//     const svg = d3
//       .select(svgRef.current)
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//       .append("g")
//       .attr("transform", `translate(${margin.left},${margin.top})`);

//     const root = d3.hierarchy(data);
//     const treeLayout = d3.tree();

//     if (layout === "horizontal") {
//       treeLayout.size([height, width]);
//     } else {
//       treeLayout.size([width, height]);
//     }

//     treeLayout(root);

//     // Links
//     svg
//       .selectAll(".link")
//       .data(root.links())
//       .join("path")
//       .attr("fill", "none")
//       .attr("stroke", "#cbd5e0")
//       .attr("stroke-width", 2)
//       .attr("d", d3.linkHorizontal<HierarchyLink<any>, any>()
//         .x((d) => layout === "horizontal" ? d.y : d.x)
//         .y((d) => layout === "horizontal" ? d.x : d.y)
//       );

//     // Nodes
//     const node = svg
//       .selectAll(".node")
//       .data(root.descendants())
//       .join("g")
//       .attr("class", "node")
//       .attr("transform", (d: any) =>
//         layout === "horizontal"
//           ? `translate(${d.y},${d.x})`
//           : `translate(${d.x},${d.y})`
//       );

//     node
//       .append("rect")
//       .attr("width", 160)
//       .attr("height", 60)
//       .attr("x", -80)
//       .attr("y", -30)
//       .attr("rx", 12)
//       .attr("class", "fill-white shadow-md stroke-1 stroke-gray-300");

//     node
//       .append("text")
//       .attr("text-anchor", "middle")
//       .attr("dy", "-0.2em")
//       .attr("class", "text-sm font-semibold text-gray-700")
//       .text((d: any) => d.data.key);

//     node
//       .append("text")
//       .attr("text-anchor", "middle")
//       .attr("dy", "1.2em")
//       .attr("class", "text-xs text-gray-500")
//       .text((d: any) => `$${(d.data.amount / 1000).toFixed(0)}K`);

//   }, [layout]);

//   return (
//     <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-md shadow-md">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-2xl font-bold text-blue-700">Sales Flow (D3 + Tailwind + PrimeReact)</h2>
//         <div className="flex gap-2">
//           <Button
//             label="Vertical"
//             icon="pi pi-arrow-down"
//             onClick={() => setLayout("vertical")}
//             className={layout === "vertical" ? "p-button-info" : "p-button-outlined"}
//           />
//           <Button
//             label="Horizontal"
//             icon="pi pi-arrow-right"
//             onClick={() => setLayout("horizontal")}
//             className={layout === "horizontal" ? "p-button-info" : "p-button-outlined"}
//           />
//         </div>
//       </div>
//       <div className="overflow-auto border rounded-md">
//         <svg ref={svgRef}></svg>
//       </div>
//     </div>
//   );
// };

// export default SalesFlowChart;



































// import { useEffect, useState } from "react";

// type Node = {
//   key: string;
//   amount: number;
//   percentage?: string;
//   children?: Node[];
// };

// const data: Node = {
//   key: "Sales",
//   amount: 2700000,
//   children: [
//     {
//       key: "AWD",
//       amount: 800000,
//       children: [
//         { key: "Standard", amount: 420000 },
//         { key: "Budget-Offer", amount: 59000 },
//         { key: "Complimentary-Product", amount: 3400 },
//         { key: "Enrollment", amount: 31000 },
//         { key: "Customer-Protection", amount: 95000 },
//         { key: "Guidance-Session", amount: 5700 },
//         { key: "Online-Access", amount: 5600 },
//         { key: "Pre-Owned-Classick", amount: 55700 },
//         { key: "Seller-Serviced", amount: 2700 },
//       ],
//     },
//     {
//       key: "AWW",
//       amount: 1900000,
//       children: [
//         { key: "Standard", amount: 1410000 },
//         { key: "Budget-Offer", amount: 103000 },
//         { key: "Complimentary-Product", amount: 2500 },
//         { key: "Customer-Protection", amount: 75000 },
//         { key: "Online-Access", amount: 5800 },
//         { key: "Pre-Owned-Classick", amount: 58500 },
//         { key: "Seller-Serviced", amount: 1300 },
//         { key: "Virtual-Recognition", amount: 500 },
//       ],
//     },
//   ],
// };

// const formatDataWithPercentages = (node: Node, total: number): Node => {
//   const percentage = ((node.amount / total) * 100).toFixed(2) + "%";
//   return {
//     ...node,
//     percentage,
//     children: node.children?.map((child) =>
//       formatDataWithPercentages(child, total)
//     ),
//   };
// };

// const SalesFlowTimeline = () => {
//   const [formattedData, setFormattedData] = useState<Node | null>(null);

//   useEffect(() => {
//     const formatted = formatDataWithPercentages(data, data.amount);
//     setFormattedData(formatted);
//   }, []);

//   const renderNode = (node: Node, level = 0) => (
//     <div
//       key={node.key}
//       className="relative border-l border-gray-300 dark:border-gray-600 pl-4 ml-2"
//       style={{ marginLeft: level === 0 ? 0 : 12, paddingLeft: level * 16 }}
//     >
//       <div className="flex flex-col gap-1 pb-2">
//         <div className="text-base font-semibold text-gray-800 dark:text-white">
//           {node.key}
//         </div>
//         <div className="text-sm text-gray-600 dark:text-gray-300">
//           ${node.amount.toLocaleString()} ({node.percentage})
//         </div>
//       </div>
//       {node.children && (
//         <div className="mt-2">
//           {node.children.map((child) => renderNode(child, level + 1))}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md w-full">
//       <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-4">
//         Sales Flow Timeline
//       </h2>
//       {formattedData ? renderNode(formattedData) : <p>Loading...</p>}
//     </div>
//   );
// };

// export default SalesFlowTimeline;




import { useEffect, useState } from "react";
import { Tree } from 'primereact/tree';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';

type NodeData = {
  key: string;
  amount: number;
  percentage?: string;
  children?: NodeData[];
};

const rawData: NodeData = {
  key: "Sales",
  amount: 2700000,
  children: [
    {
      key: "AWD",
      amount: 800000,
      children: [
        { key: "Standard", amount: 420000 },
        { key: "Budget-Offer", amount: 59000 },
        { key: "Complimentary-Product", amount: 3400 },
        { key: "Enrollment", amount: 31000 },
        { key: "Customer-Protection", amount: 95000 },
        { key: "Guidance-Session", amount: 5700 },
        { key: "Online-Access", amount: 5600 },
        { key: "Pre-Owned-Classick", amount: 55700 },
        { key: "Seller-Serviced", amount: 2700 },
      ],
    },
    {
      key: "AWW",
      amount: 1900000,
      children: [
        { key: "Standard", amount: 1410000 },
        { key: "Budget-Offer", amount: 103000 },
        { key: "Complimentary-Product", amount: 2500 },
        { key: "Customer-Protection", amount: 75000 },
        { key: "Online-Access", amount: 5800 },
        { key: "Pre-Owned-Classick", amount: 58500 },
        { key: "Seller-Serviced", amount: 1300 },
        { key: "Virtual-Recognition", amount: 500 },
      ],
    },
  ],
};

// Format tree data for PrimeReact Tree component
const formatForTree = (node: NodeData, total: number): any => {
  const percentage = ((node.amount / total) * 100).toFixed(2) + "%";
  const label = `${node.key} - $${node.amount.toLocaleString()} (${percentage})`;
  return {
    key: node.key,
    label,
    children: node.children?.map(child => formatForTree(child, total))
  };
};

const SalesTreeFlow = () => {
  const [treeData, setTreeData] = useState<any[]>([]);

  useEffect(() => {
    const formattedTree = formatForTree(rawData, rawData.amount);
    setTreeData([formattedTree]);
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded shadow-md">
      <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-3">Sales Tree Flow</h2>
      <Tree value={treeData} />
    </div>
  );
};

export default SalesTreeFlow;






