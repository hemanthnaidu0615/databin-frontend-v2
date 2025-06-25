import React from "react";
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
