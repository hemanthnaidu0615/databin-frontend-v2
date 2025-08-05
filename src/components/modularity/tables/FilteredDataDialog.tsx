// import React, { useEffect } from "react";
// import { Dialog } from "primereact/dialog";
// import { BaseDataTable, TableColumn } from "../tables/BaseDataTable";

// interface FilteredDataDialogProps {
//   visible: boolean;
//   onHide: () => void;
//   header?: string;
//   columns: TableColumn<any>[];
//   fetchData: (params?: any) => (tableParams: any) => Promise<{ data: any[]; count: number }>;
//   filterParams?: Record<string, any>;
//   mobileCardRender?: (item: any, index: number) => React.ReactNode;
//   width?: string;
// }

// const FilteredDataDialog: React.FC<FilteredDataDialogProps> = ({
//   visible,
//   onHide,
//   header = "Filtered Data",
//   columns,
//   fetchData,
//   filterParams = {},
//   mobileCardRender,
//   width = "90vw" // Using a more reasonable width
// }) => {

//   useEffect(() => {
//     // Check if the dialog is visible
//     if (visible) {
//       // Add the class to disable scrolling
//       document.body.classList.add("modal-open");
//     } else {
//       // Remove the class to re-enable scrolling
//       document.body.classList.remove("modal-open");
//     }
    
//     // Cleanup function to ensure the class is removed when the component unmounts
//     return () => {
//       document.body.classList.remove("modal-open");
//     };
//   }, [visible]);

//   return (
//     <Dialog
//       header={header}
//       visible={visible}
//       onHide={onHide}
//       style={{ width }}
//       dismissableMask
//     >
//       <BaseDataTable
//         field="id"
//         header={header}
//         columns={columns}
//         fetchData={fetchData(filterParams)}
//         globalFilterFields={columns.map(col => String(col.field))}
//         mobileCardRender={mobileCardRender}
//       />
//     </Dialog>
//   );
// };

// export default FilteredDataDialog;


// import React, { useEffect } from "react";
// import { Dialog } from "primereact/dialog";
// import { BaseDataTable, TableColumn } from "../tables/BaseDataTable";

// interface FilteredDataDialogProps {
//   visible: boolean;
//   onHide: () => void;
//   header?: string;
//   columns: TableColumn<any>[];
//   fetchData: (params?: any) => (tableParams: any) => Promise<{ data: any[]; count: number }>;
//   filterParams?: Record<string, any>;
//   mobileCardRender?: (item: any, index: number) => React.ReactNode;
//   // Change the default width to a more appropriate value.
//   // We'll also remove maxWidth to simplify.
//   width?: string;
// }

// const FilteredDataDialog: React.FC<FilteredDataDialogProps> = ({
//   visible,
//   onHide,
//   header = "Filtered Data",
//   columns,
//   fetchData,
//   filterParams = {},
//   mobileCardRender,
//   // Let's use a default width of 90vw for better responsiveness
//   // or a fixed pixel value that's reasonable.
//   width = "90vw"
// }) => {

//   useEffect(() => {
//     // The background scrolling fix. You can keep this as it is correct.
//     const scrollingContainer = document.body;
    
//     if (visible) {
//       if (scrollingContainer) {
//         scrollingContainer.style.overflow = "hidden";
//       }
//     } else {
//       if (scrollingContainer) {
//         scrollingContainer.style.overflow = "";
//       }
//     }
    
//     return () => {
//       if (scrollingContainer) {
//         scrollingContainer.style.overflow = "";
//       }
//     };
//   }, [visible]);

//   return (
//     <Dialog
//       header={header}
//       visible={visible}
//       onHide={onHide}
//       // Pass the updated width prop. Removing maxWidth can help responsiveness.
//       style={{ width }}
//       dismissableMask
//     >
//       <BaseDataTable
//         field="id"
//         header={header}
//         columns={columns}
//         fetchData={fetchData(filterParams)}
//         globalFilterFields={columns.map(col => String(col.field))}
//         mobileCardRender={mobileCardRender}
//       />
//     </Dialog>
//   );
// };

// export default FilteredDataDialog;




import React, { useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { BaseDataTable, TableColumn } from "../tables/BaseDataTable";

interface FilteredDataDialogProps {
  visible: boolean;
  onHide: () => void;
  header?: string;
  columns: TableColumn<any>[];
  fetchData: (params?: any) => (tableParams: any) => Promise<{ data: any[]; count: number }>;
  filterParams?: Record<string, any>;
  mobileCardRender?: (item: any, index: number) => React.ReactNode;
  width?: string;
}

const FilteredDataDialog: React.FC<FilteredDataDialogProps> = ({
  visible,
  onHide,
  header = "Filtered Data",
  columns,
  fetchData,
  filterParams = {},
  mobileCardRender,
  width = "1000vw"
}) => {

  useEffect(() => {
    
    if (visible) {
      document.body.style.overflow = "hidden";  // Disable page scroll on open
    } else {
      document.body.style.overflow = "";        // Enable page scroll on close
    }
    return () => {
      document.body.style.overflow = "";        // Clean up
    };
  }, [visible]);

  return (
    <Dialog
      header={header}
      visible={visible}
      onHide={onHide}
      style={{ width, maxWidth: "1300px" }}
      dismissableMask
    >
      <BaseDataTable
        field="id"
        header={header}
        columns={columns}
        fetchData={fetchData(filterParams)}
        globalFilterFields={columns.map(col => String(col.field))}
        mobileCardRender={mobileCardRender}
      />
    </Dialog>
  );
};

export default FilteredDataDialog;
