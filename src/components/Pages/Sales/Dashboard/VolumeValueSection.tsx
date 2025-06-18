import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../../axios";
import { formatDateTime, formatValue } from "../../../utils/kpiUtils";
import { TableView, usePagination, TableColumn } from "../../../modularity/tables/Table";

type ApiRow = {
  productId: string;
  category: string;
  brand: string;
  totalQuantity: number;
  totalAmountUSD: number;
};

function convertToUSD(rupees: number): number {
  const exchangeRate = 0.012;
  return rupees * exchangeRate;
}

const VolumeValueSection: React.FC<{ company: string }> = ({ company }) => {
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange || [];

  const [data, setData] = useState<ApiRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { page, rows, onPageChange } = usePagination();
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define table columns
  const columns: TableColumn[] = [
    { field: "productId", header: "Item ID", mobilePriority: true },
    { field: "category", header: "Web Category", mobilePriority: true },
    { field: "brand", header: "Brand Name", mobilePriority: true },
    { 
      field: "totalQuantity", 
      header: "Quantity",
      customBody: (row: ApiRow) => row.totalQuantity.toLocaleString()
    },
    { 
      field: "totalAmountUSD", 
      header: "Total Amount",
      customBody: (row: ApiRow) => `$${formatValue(row.totalAmountUSD)}`
    },
  ];

  // Table configuration
  const config = {
    columns,
    mobileCardFields: ["productId", "category", "brand", "totalQuantity", "totalAmountUSD"],
    expandable: true
  };

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchData = async () => {
      setLoading(true);
      const formattedStartDate = formatDateTime(startDate);
      const formattedEndDate = formatDateTime(endDate);
      const companyKey = company.toLowerCase();

      try {
        const response = await axiosInstance.get(`sales/volume-value/${companyKey}`, {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            page: page / rows,
            size: rows,
            search: searchTerm
          },
        });

        const resp = response.data as {
          data: {
            product_id: number;
            product_name: string;
            category: string;
            total_amount: number;
            total_quantity: number;
          }[];
          count?: number;
        };

        const apiData = resp.data;

        const formattedData: ApiRow[] = apiData.map((item) => ({
          productId: item.product_id.toString(),
          category: item.category,
          brand: item.product_name,
          totalQuantity: item.total_quantity,
          totalAmountUSD: convertToUSD(item.total_amount),
        }));

        setData(formattedData);
        const respData = response.data as { count?: number };
        setTotalRecords(respData.count || 0);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load sales data");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, company, page, rows, searchTerm]);

  return (
    <div className="border rounded-xl shadow-sm overflow-hidden border-gray-200 dark:border-gray-700">
      <div
        className="px-4 py-2 font-semibold"
        style={{ backgroundColor: "#a855f7", color: "#fff" }}
      >
        <span className="font-semibold text-sm sm:text-base truncate rounded-xl shadow-sm overflow-hidden flex flex-col">
          Sales Data
        </span>
      </div>

      <TableView
        data={data}
        config={config}
        pagination={{
          page,
          rows,
          totalRecords,
          onPageChange,
          rowsPerPageOptions: [5, 10, 20, 50]
        }}
        loading={loading}
        error={error}
        globalFilter={searchTerm}
        onGlobalFilterChange={setSearchTerm}
        searchPlaceholder="Search by brand or ID"
        className="p-4"
      />
    </div>
  );
};

export default VolumeValueSection;