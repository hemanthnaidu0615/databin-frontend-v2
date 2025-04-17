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
    <div className="w-full overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow-sm p-2">
      <DataTable
        value={data?.slice(sliceStart, sliceEnd)}
        size="small"
        showGridlines
        className="text-xs w-full"
      >
        {columns?.map((column, index) => (
          <Column
            key={index}
            field={column.field}
            header={column.header}
            headerStyle={{ textAlign: "center" }}
            headerClassName="bg-purple-100 dark:bg-purple-900 text-black dark:text-white text-xs font-semibold"
            pt={{ bodyCell: { className: "h-5 text-center dark:text-white" } }}
            body={(rowData) =>
              column.prependDollar
                ? `$${rowData[column.field]}`
                : rowData[column.field]
            }
          />
        ))}
      </DataTable>
    </div>
  );
}

export default CustomDataTable;
