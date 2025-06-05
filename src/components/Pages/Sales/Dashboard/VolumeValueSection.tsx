import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../../axios";

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

const formatValue = (value: number) => {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
  return value.toFixed(0);
};

const VolumeValueSection: React.FC<{ company: string }> = ({ company }) => {
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange || [];

  const [data, setData] = useState<ApiRow[]>([]);
  const [viewMode, setViewMode] = useState<"card" | "grid">("card");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!startDate || !endDate) return;

    const formattedStartDate = new Date(startDate).toISOString();
    const formattedEndDate = new Date(endDate).toISOString();

    const companyKey = company.toLowerCase();

    axiosInstance
      .get(`sales/volume-value/${companyKey}`, {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
      })
      .then((res) => {
        const apiData = res.data as {
          product_id: number;
          product_name: string;
          category: string;
          total_amount: number;
          total_quantity: number;
        }[];

        const formattedData: ApiRow[] = apiData.map((item) => ({
          productId: item.product_id.toString(),
          category: item.category,
          brand: item.product_name,
          totalQuantity: item.total_quantity,
          totalAmountUSD: convertToUSD(item.total_amount),
        }));

        setData(formattedData);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setData([]);
      });
  }, [startDate, endDate, company]);

  const filteredData = data.filter(
    (item) =>
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="border rounded-xl shadow-sm overflow-hidden border-gray-200 dark:border-gray-700">
      <div
        className="px-4 py-2 font-semibold flex justify-between items-center"
        style={{ backgroundColor: "#a855f7", color: "#fff" }}
      >
        <span className="font-semibold text-sm sm:text-base truncate  rounded-xl shadow-sm overflow-hidden  flex flex-col">
          Sales Data
        </span>
        {/* View toggle only on mobile */}
        <button
          onClick={() => setViewMode(viewMode === "card" ? "grid" : "card")}
          className="sm:hidden bg-violet-500 text-white px-3 py-1 text-xs rounded hover:bg-violet-600"
        >
          {viewMode === "card" ? "Grid View" : "Card View"}
        </button>
      </div>

      {/* Mobile View: Card/Grid layout */}
      <div className="sm:hidden">
        {/* Search bar */}
        <div className="px-4 py-2">
          <input
            type="text"
            placeholder="Search by brand or ID."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm"
          />
        </div>

        {filteredData.length === 0 ? (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 p-4">
            No data found for the selected dates or search term.
          </p>
        ) : viewMode === "card" ? (
          <div className="max-h-[320px] overflow-y-auto p-2 space-y-2">
            {filteredData.map((row, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 space-y-1 border border-gray-200 dark:border-gray-700"
              >
                <p>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Item ID:
                  </span>{" "}
                  {row.productId}
                </p>
                <p>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Category:
                  </span>{" "}
                  {row.category}
                </p>
                <p>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Brand:
                  </span>{" "}
                  {row.brand}
                </p>
                <p>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Quantity:
                  </span>{" "}
                  {row.totalQuantity.toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Total Amount:
                  </span>{" "}
                  ${formatValue(row.totalAmountUSD)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-h-[320px] overflow-y-auto p-2 grid grid-cols-2 gap-2">
            {filteredData.map((row, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-2 border border-gray-200 dark:border-gray-700 text-xs"
              >
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    ID:
                  </span>{" "}
                  {row.productId}
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Cat:
                  </span>{" "}
                  {row.category}
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Brand:
                  </span>{" "}
                  {row.brand}
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Qty:
                  </span>{" "}
                  {row.totalQuantity.toLocaleString()}
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Amount:
                  </span>{" "}
                  ${formatValue(row.totalAmountUSD)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tablet/Laptop View */}
      <div className="hidden sm:block">
        {/* Search bar */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search by brand or ID."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3 px-3 py-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm"
          />
        </div>

        {/* Table */}
        <div className="max-h-[320px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-white dark:bg-gray-800 sticky top-0">
                <th className="px-4 py-2 app-table-heading">Item ID</th>
                <th className="px-4 py-2 app-table-heading">Web Category</th>
                <th className="px-4 py-2 app-table-heading">Brand Name</th>
                <th className="px-4 py-2 app-table-heading">Quantity</th>
                <th className="px-4 py-2 app-table-heading">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-100 dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-800"
                >
                  <td className="px-4 py-2 app-table-content">
                    {row.productId}
                  </td>
                  <td className="px-4 py-2 app-table-content">
                    {row.category}
                  </td>
                  <td className="px-4 py-2 app-table-content">{row.brand}</td>
                  <td className="px-4 py-2 app-table-content">
                    {row.totalQuantity.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 app-table-content">
                    ${formatValue(row.totalAmountUSD)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VolumeValueSection;
