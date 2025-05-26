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

  return (
    <div className="border rounded-xl shadow-sm overflow-hidden border-gray-200 dark:border-gray-700">
      <div className="bg-violet-100 dark:bg-violet-900 px-4 py-2 font-semibold text-gray-800 dark:text-gray-100">
        Sales Data
      </div>
      <div className="max-h-[320px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-white dark:bg-gray-800 ">
              <th className="px-4 py-2 app-table-heading">
                Item ID
              </th>
              <th className="px-4 py-2 app-table-heading">
                Web Category
              </th>
              <th className="px-4 py-2 app-table-heading">
                Brand Name
              </th>
              <th className="px-4 py-2 app-table-heading">
                Quantity
              </th>
              <th className="px-4 py-2 app-table-heading">
                Total (USD)
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
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
                <td className="px-4 py-2 app-table-content">
                  {row.brand}
                </td>
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
  );
};

export default VolumeValueSection;
