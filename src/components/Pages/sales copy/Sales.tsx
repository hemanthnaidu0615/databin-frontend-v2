
// import React, { useState, useRef } from 'react';
// import { useIsMobile } from '../../../hooks/use-mobile';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/ui/dropdown-menu';
// import SalesSummary from './SalesSummary';
// import SalesChart from './SalesChart';
// import { ChevronDown, BarChartIcon, LineChartIcon, PieChartIcon, TableIcon } from 'lucide-react';
// import { Button } from '../../ui/ui/button';
// import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '../../ui/ui/table';

// interface SalesData {
//   id: string;
//   name: string;
//   date: string;
//   amount: number;
//   channel: 'Call Center' | 'Web' | 'Store' | 'Other';
// }

// const channelData = [
//   { name: 'CallCenter', units: '975,264', total: '$860' },
//   { name: 'Web', units: '703,304', total: '$2,603' },
//   { name: 'Other', units: '846', total: '$3' }
// ];

// const fulfillmentData = [
//   { name: 'Ship to Customer', units: '1,679,414', total: '$3,466' },
//   { name: 'Pickup in store', units: '2,356,750', total: '$4,619' },
//   { name: 'Scheduled Delivery', units: '1,131,277', total: '$2,593' }
// ];

// const itemData = [
//   { name: 'Budget-Offer', units: '203,380', total: '$1,604' },
//   { name: 'Complimentary-Product', units: '2,833', total: '$1' },
//   { name: 'Guarantee-Protection', units: '15,127', total: '$22' }
// ];

// const volumeData = [
//   { itemId: 'A9324600000000', webCategory: 'Vault', brandName: 'Pass-through Folding Window', total: '421' },
//   { itemId: 'A7921800000000', webCategory: 'Donation', brandName: 'Pass-through Folding Window', total: '228' },
//   { itemId: 'A4543150000010000', webCategory: 'Microphone Stands', brandName: 'Hinged Patio A-Series Door', total: '146' }
// ];

// const valueData = [
//   { itemId: 'A7921800000000', webCategory: 'Donation', brandName: 'Pass-through Folding Window', total: '$105,987' },
//   { itemId: 'A5165800000000', webCategory: 'Powered PA Speakers', brandName: 'Baldwin L023 Window', total: '$94,775' },
//   { itemId: 'A8960400000000', webCategory: 'Powered PA Speakers', brandName: 'Andersen Aluminum Casement Window', total: '$75,593' }
// ];

// const chartViewOptions = [
//   { label: 'Bar Chart', value: 'bar', icon: <BarChartIcon size={16} /> },
//   { label: 'Line Chart', value: 'line', icon: <LineChartIcon size={16} /> },
//   { label: 'Pie Chart', value: 'pie', icon: <PieChartIcon size={16} /> },
//   { label: 'Table View', value: 'table', icon: <TableIcon size={16} /> },
// ];

// const Sales: React.FC = () => {
//   const [selectedChartTypes, setSelectedChartTypes] = useState({
//     AWD: 'bar',
//     AWW: 'bar'
//   });
//   const [chartTypeDropdownVisible, setChartTypeDropdownVisible] = useState({
//     AWD: false,
//     AWW: false
//   });
//   const [activeView, setActiveView] = useState<{ [key: string]: string }>({
//     AWD: 'Chart',
//     AWW: 'Chart'
//   });
  
//   const dropdownRefs = {
//     AWD: useRef<HTMLDivElement>(null),
//     AWW: useRef<HTMLDivElement>(null)
//   };
  
//   const isMobile = useIsMobile();

//   const salesData = [
//     { 
//       id: 'AWD',
//       name: 'AWD',
//       logo: '🔵🟠',
//       period: '15/03/2024 - 16/03/2024',
//       amount: '$1.7M',
//       data: generateSalesData('AWD')
//     },
//     { 
//       id: 'AWW', 
//       name: 'AWW',
//       logo: '⚫⚫⚫',
//       period: '15/03/2024 - 16/03/2024',
//       amount: '$6M',
//       data: generateSalesData('AWW')
//     }
//   ];

//   function generateSalesData(company: string): SalesData[] {
//     const channels = ['Call Center', 'Web', 'Store', 'Other'] as const;
//     const data: SalesData[] = [];
    
//     for (let i = 0; i < 15; i++) {
//       const date = new Date(2024, 2, 15 + (i % 15));
//       const dateString = `15-03`;
      
//       channels.forEach(channel => {
//         const randomFactor = company === 'AWD' ? 0.7 : 1.2;
//         const randomAmount = channel === 'Call Center' && i === 6 ? 
//           Math.random() * 400000 * randomFactor : 
//           Math.random() * 200000 * randomFactor;
          
//         data.push({
//           id: `${company}-${channel}-${i}`,
//           name: company,
//           date: dateString,
//           amount: randomAmount,
//           channel: channel
//         });
//       });
//     }
    
//     return data;
//   }

//   // Function to handle clicks outside dropdown for each company
//   React.useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         (dropdownRefs.AWD.current && !dropdownRefs.AWD.current.contains(event.target as Node)) &&
//         (dropdownRefs.AWW.current && !dropdownRefs.AWW.current.contains(event.target as Node))
//       ) {
//         setChartTypeDropdownVisible({
//           AWD: false,
//           AWW: false
//         });
//       } else if (dropdownRefs.AWD.current && !dropdownRefs.AWD.current.contains(event.target as Node)) {
//         setChartTypeDropdownVisible(prev => ({
//           ...prev,
//           AWD: false
//         }));
//       } else if (dropdownRefs.AWW.current && !dropdownRefs.AWW.current.contains(event.target as Node)) {
//         setChartTypeDropdownVisible(prev => ({
//           ...prev,
//           AWW: false
//         }));
//       }
//     }
    
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [dropdownRefs]);

//   // Get the current selected chart type label for a company
//   const getSelectedChartLabel = (companyId: string) => {
//     const selectedOption = chartViewOptions.find(option => option.value === selectedChartTypes[companyId as keyof typeof selectedChartTypes]);
//     return selectedOption ? selectedOption.label : 'Bar Chart';
//   };

//   // Get the selected chart icon for a company
//   const getSelectedChartIcon = (companyId: string) => {
//     const selectedOption = chartViewOptions.find(option => option.value === selectedChartTypes[companyId as keyof typeof selectedChartTypes]);
//     return selectedOption ? selectedOption.icon : <BarChartIcon size={16} />;
//   };

//   const toggleDropdown = (companyId: string) => {
//     setChartTypeDropdownVisible(prev => ({
//       ...prev,
//       [companyId]: !prev[companyId as keyof typeof prev]
//     }));
//   };

//   const changeChartType = (companyId: string, chartType: string) => {
//     setSelectedChartTypes(prev => ({
//       ...prev,
//       [companyId]: chartType
//     }));
//     toggleDropdown(companyId);
//   };

//   const handleViewChange = (companyId: string, view: string) => {
//     setActiveView(prev => ({
//       ...prev,
//       [companyId]: view
//     }));
//   };

//   const renderViewContent = (companyId: string, view: string) => {
//     if (view === 'Chart') {
//       return (
//         <div className="lg:w-4/5 relative">
//           <div className="absolute top-0 right-0 z-10">
//             <div className="relative" ref={dropdownRefs[companyId as keyof typeof dropdownRefs]}>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => toggleDropdown(companyId)}
//                 className="flex items-center gap-2"
//               >
//                 {getSelectedChartIcon(companyId)}
//                 {getSelectedChartLabel(companyId)}
//                 <ChevronDown size={16} />
//               </Button>
              
//               {chartTypeDropdownVisible[companyId as keyof typeof chartTypeDropdownVisible] && (
//                 <div className="absolute top-full right-0 mt-1 w-40 bg-card border border-border shadow-lg rounded-md z-20">
//                   {chartViewOptions.map(option => (
//                     <div 
//                       key={option.value} 
//                       className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center gap-2"
//                       onClick={() => changeChartType(companyId, option.value)}
//                     >
//                       {option.icon}
//                       {option.label}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
          
//           <SalesChart 
//             data={salesData.find(item => item.id === companyId)?.data || []} 
//             chartType={selectedChartTypes[companyId as keyof typeof selectedChartTypes]} 
//             height={isMobile ? 250 : 350}
//           />
//         </div>
//       );
//     } else if (view === 'By Type') {
//       return (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
//           <div className="bg-card rounded-lg p-4 shadow-md">
//             <h3 className="text-lg font-medium mb-4">By Channel</h3>
//             <Table>
//               <TableHeader className="bg-purple-100/10">
//                 <TableRow>
//                   <TableHead className="w-1/3">Name</TableHead>
//                   <TableHead className="w-1/3 text-center">Units</TableHead>
//                   <TableHead className="w-1/3 text-right">Total</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {channelData.map((item, i) => (
//                   <TableRow key={i} className="hover:bg-muted/30">
//                     <TableCell>{item.name}</TableCell>
//                     <TableCell className="text-center">{item.units}</TableCell>
//                     <TableCell className="text-right">{item.total}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
          
//           <div className="bg-card rounded-lg p-4 shadow-md">
//             <h3 className="text-lg font-medium mb-4">By Fulfillment</h3>
//             <Table>
//               <TableHeader className="bg-purple-100/10">
//                 <TableRow>
//                   <TableHead className="w-1/3">Name</TableHead>
//                   <TableHead className="w-1/3 text-center">Units</TableHead>
//                   <TableHead className="w-1/3 text-right">Total</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {fulfillmentData.map((item, i) => (
//                   <TableRow key={i} className="hover:bg-muted/30">
//                     <TableCell>{item.name}</TableCell>
//                     <TableCell className="text-center">{item.units}</TableCell>
//                     <TableCell className="text-right">{item.total}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
          
//           <div className="bg-card rounded-lg p-4 shadow-md">
//             <h3 className="text-lg font-medium mb-4">By Item</h3>
//             <Table>
//               <TableHeader className="bg-purple-100/10">
//                 <TableRow>
//                   <TableHead className="w-1/3">Name</TableHead>
//                   <TableHead className="w-1/3 text-center">Units</TableHead>
//                   <TableHead className="w-1/3 text-right">Total</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {itemData.map((item, i) => (
//                   <TableRow key={i} className="hover:bg-muted/30">
//                     <TableCell>{item.name}</TableCell>
//                     <TableCell className="text-center">{item.units}</TableCell>
//                     <TableCell className="text-right">{item.total}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </div>
//       );
//     } else if (view === 'Volume-Value') {
//       return (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
//           <div className="bg-card rounded-lg p-4 shadow-md">
//             <h3 className="text-lg font-medium mb-4">By Volume</h3>
//             <Table>
//               <TableHeader className="bg-purple-100/10">
//                 <TableRow>
//                   <TableHead className="w-1/4">Item Id</TableHead>
//                   <TableHead className="w-1/4">Web Category</TableHead>
//                   <TableHead className="w-1/4">Brand Name</TableHead>
//                   <TableHead className="w-1/4 text-right">Total</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {volumeData.map((item, i) => (
//                   <TableRow key={i} className="hover:bg-muted/30">
//                     <TableCell>{item.itemId}</TableCell>
//                     <TableCell>{item.webCategory}</TableCell>
//                     <TableCell>{item.brandName}</TableCell>
//                     <TableCell className="text-right">{item.total}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
          
//           <div className="bg-card rounded-lg p-4 shadow-md">
//             <h3 className="text-lg font-medium mb-4">By Value</h3>
//             <Table>
//               <TableHeader className="bg-purple-100/10">
//                 <TableRow>
//                   <TableHead className="w-1/4">Item Id</TableHead>
//                   <TableHead className="w-1/4">Web Category</TableHead>
//                   <TableHead className="w-1/4">Brand Name</TableHead>
//                   <TableHead className="w-1/4 text-right">Total</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {valueData.map((item, i) => (
//                   <TableRow key={i} className="hover:bg-muted/30">
//                     <TableCell>{item.itemId}</TableCell>
//                     <TableCell>{item.webCategory}</TableCell>
//                     <TableCell>{item.brandName}</TableCell>
//                     <TableCell className="text-right">{item.total}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </div>
//       );
//     }
    
//     return null;
//   };

//   return (
//     <div className="p-4 md:p-6 lg:p-8">
//       <h1 className="text-2xl md:text-3xl font-bold text-purple-600 mb-6 md:mb-8">Sales</h1>
      
//       {/* Sales Summary Metrics */}
//       <SalesSummary />
      
//       {/* Sales Charts Section */}
//       {salesData.map((company, index) => (
//         <div key={company.id} className="mb-8 md:mb-10 bg-card rounded-lg p-4 md:p-6 shadow-lg">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4">
//             <div className="flex items-center gap-2">
//               <span className="text-xl font-semibold">{company.name}</span>
//               <span>{company.logo}</span>
//             </div>
            
//             <div className="flex flex-wrap gap-2 md:gap-4">
//               <Button 
//                 variant={activeView[company.id] === 'Chart' ? 'default' : 'outline'} 
//                 size="sm"
//                 onClick={() => handleViewChange(company.id, 'Chart')}
//               >
//                 Chart
//               </Button>
//               <Button 
//                 variant={activeView[company.id] === 'By Type' ? 'default' : 'outline'} 
//                 size="sm"
//                 onClick={() => handleViewChange(company.id, 'By Type')}
//               >
//                 By Type
//               </Button>
//               <Button 
//                 variant={activeView[company.id] === 'Volume-Value' ? 'default' : 'outline'} 
//                 size="sm"
//                 onClick={() => handleViewChange(company.id, 'Volume-Value')}
//               >
//                 Volume-Value
//               </Button>
//             </div>
//           </div>
          
//           <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
//             <div className="bg-primary/5 text-foreground p-4 rounded-lg lg:w-1/5">
//               <div className="text-sm">{company.period}</div>
//               <div className="text-2xl font-bold mt-2">{company.amount}</div>
//               <div className="h-2 w-full bg-muted rounded mt-4">
//                 <div className="h-full rounded bg-purple-600" style={{ width: '60%' }}></div>
//               </div>
//             </div>
            
//             {renderViewContent(company.id, activeView[company.id])}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Sales;
