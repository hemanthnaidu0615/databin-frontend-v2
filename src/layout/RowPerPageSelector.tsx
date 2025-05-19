// import { useEffect, useState } from "react";

// const RowPerPageSelector = ({ rows, setRows, setFirst }: any) => {
//   const [options, setOptions] = useState<number[]>([]);

//   useEffect(() => {
//     const calculateOptions = () => {
//       const availableHeight = window.innerHeight - 200; // subtract space for navbar, paddings, etc.
//       const rowHeight = 36; // approximate row height in px
//       const maxRows = Math.floor(availableHeight / rowHeight);

//       const computedOptions = [10, 20, 30, 50, 100].filter(
//         (val) => val <= maxRows
//       );

//       // fallback in case maxRows is very small
//       if (computedOptions.length === 0) {
//         computedOptions.push(5);
//       }

//       setOptions(computedOptions);
//     };

//     calculateOptions();
//     window.addEventListener("resize", calculateOptions);

//     return () => window.removeEventListener("resize", calculateOptions);
//   }, []);

//   return (
//     <div className="flex items-center gap-2">
//       <label htmlFor="mobileRows" className="whitespace-nowrap">
//         Rows per page:
//       </label>
//       <select
//         id="mobileRows"
//         value={rows}
//         onChange={(e) => {
//           setRows(Number(e.target.value));
//           setFirst(0); // reset to first page
//         }}
//         className="px-2 py-1 rounded dark:bg-gray-800 bg-gray-100 dark:text-white text-gray-800"
//       >
//         {options.map((option) => (
//           <option key={option} value={option}>
//             {option}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default RowPerPageSelector;
