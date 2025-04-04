// import { useState, useEffect } from "react";
// import WidgetGrid from "./WidgetGrid";
// import WidgetSidebar from "./WidgetSidebar";

// export default function WidgetSetup() {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);

//   // Load saved widgets from localStorage on mount
//   useEffect(() => {
//     const savedWidgets = localStorage.getItem("selectedWidgets");
//     if (savedWidgets) {
//       setSelectedWidgets(JSON.parse(savedWidgets));
//     }
//   }, []);

//   // Function to handle adding widgets
//   const addWidget = (widgetName: string) => {
//     if (!selectedWidgets.includes(widgetName)) {
//       setSelectedWidgets([...selectedWidgets, widgetName]);
//     }
//   };

//   // Function to handle removing widgets
//   const removeWidget = (widgetName: string) => {
//     setSelectedWidgets(selectedWidgets.filter((widget) => widget !== widgetName));
//   };

//   // Function to save widgets and update UI immediately
//   const saveWidgets = () => {
//     localStorage.setItem("selectedWidgets", JSON.stringify(selectedWidgets));
//     setIsEditing(false); // Exit edit mode
//     setIsSidebarOpen(false); // Close sidebar
//   };

//   return (
//     <div className="relative p-4">
//       {/* Edit Button */}
//       {!isEditing && (
//         <button
//           onClick={() => {
//             setIsEditing(true);
//             setIsSidebarOpen(true); // Open sidebar on edit mode
//           }}
//           className="absolute top-4 right-4 bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition"
//         >
//           Edit
//         </button>
//       )}

//       {/* Save & Exit Button */}
//       {isEditing && (
//         <button
//           onClick={saveWidgets}
//           className="absolute top-4 left-4 bg-violet-500 text-white px-4 py-2 rounded hover:bg-violet-600 transition"
//         >
//           Save & Exit
//         </button>
//       )}

//       {/* Dashboard */}
//       <div className="mt-12">
//         <WidgetGrid selectedWidgets={selectedWidgets} removeWidget={removeWidget} />
//       </div>

//       {/* Widget Sidebar - Only Show When Editing */}
//       {isEditing && isSidebarOpen && (
//         <WidgetSidebar addWidget={addWidget} closeSidebar={() => setIsSidebarOpen(false)} />
//       )}
//     </div>
//   );
// }
