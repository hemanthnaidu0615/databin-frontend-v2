import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface ColumnConfig {
  field: string;
  header: string;
  format?: boolean;
  prependDollar?: boolean;
}

interface DataTableProps {
  data: Array<any>;
  columns: Array<ColumnConfig>;
  sliceStart?: number;
  sliceEnd?: number;
}

function CustomDataTable({
  data,
  columns,
  sliceStart = 0,
  sliceEnd = 3,
}: DataTableProps) {
  return (
    <DataTable
      value={data?.slice(sliceStart, sliceEnd)}
      size="small"
      className="text-xs"
      showGridlines
    >
      {columns?.map((column, index) => (
        <Column
          key={index}
          field={column.field}
          header={column.header}
          headerStyle={{ textAlign: "center" }}
          headerClassName="bg-purple-100 text-black "
          pt={{ bodyCell: { className: "h-5 text-center" } }}
          body={(rowData) =>
            column.prependDollar
              ? `$${rowData[column.field]}`
              : rowData[column.field]
          }
          ></Column>
      ))}
    </DataTable>
  );
}

export default CustomDataTable;
