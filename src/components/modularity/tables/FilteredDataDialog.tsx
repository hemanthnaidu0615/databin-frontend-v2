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
  width = "80%",
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

      style={{ width, maxWidth: "1440px" }}  
      contentStyle={{ overflow: "auto" }} 
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