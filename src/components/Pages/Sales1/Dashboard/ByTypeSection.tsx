import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../../axios";

const sections = [
  { title: "By Channel", endpoint: "by-channel" },
  { title: "By Fulfillment", endpoint: "by-fulfillment" },
  { title: "By Item", endpoint: "by-item" },
];

const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
    .getDate()
    .toString()
    .padStart(2, "0")} ${d.getHours().toString().padStart(2, "0")}:${d
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}.000`;
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

const ByTypeSection: React.FC<{ company: string }> = ({ company }) => {
  const [dataBySection, setDataBySection] = useState<Record<string, any[]>>({});
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;

  const fetchData = async () => {
    if (!startDate || !endDate) return;

    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(endDate);
    const formattedCompany = company.toLowerCase();

    const requests: Promise<{ title: string; data: any[] }>[] = sections.map(async ({ title, endpoint }) => {
      if (!endpoint) return { title, data: [] };
      try {
        const response = await axiosInstance.get(
          `/sales/${endpoint}/${formattedCompany}`,
          { params: { startDate: formattedStart, endDate: formattedEnd } }
        );
        return { title, data: response.data as any[] };
      } catch (err) {
        console.error(`Error fetching data for ${title}:`, err);
        return { title, data: [] };
      }
    });

    const results = await Promise.all(requests);
    const sectionData: Record<string, any[]> = {};
    results.forEach(({ title, data }) => {
      sectionData[title] = data;
    });
    setDataBySection(sectionData);
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, company]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sections.map(({ title }) => (
        <div
          key={title}
          className="border rounded-xl shadow-sm overflow-hidden border-gray-200 dark:border-gray-700 flex flex-col"
        >
          <div className="bg-violet-100 dark:bg-violet-950 px-4 py-2 font-semibold text-sm sm:text-base truncate">
            {title}
          </div>

          {/* Scroll vertically only for By Item */}
          <div className={`${title === "By Item" ? "max-h-[150px]" : ""} overflow-x-auto overflow-y-auto`}>
            <table className="min-w-max w-full text-xs sm:text-sm table-auto">

              <thead className="sticky top-0 bg-white dark:bg-gray-800 z-10">
                <tr className="text-left">
                  <th className="px-4 py-2 app-table-heading whitespace-nowrap">Name</th>
                  <th className="px-4 py-2 app-table-heading whitespace-nowrap">Units</th>
                  <th className="px-4 py-2 app-table-heading text-center whitespace-nowrap">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {(dataBySection[title] || []).map((row, idx) => {
                  const name =
                    title === "By Item"
                      ? `Product ${row.product_id}`
                      : row.channel ||
                      row.order_type ||
                      row.name ||
                      row.fulfilment_channel ||
                      "N/A";
                  const units = row.total_quantity || row.quantity || 0;
                  const amountInINR = row.total_amount || row.amount || 0;
                  const amountInUSD = convertToUSD(amountInINR);

                  return (
                    <tr
                      key={idx}
                      className="border-t border-gray-100 dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-800"
                    >
                      <td className="px-4 py-2 truncate whitespace-nowrap app-table-content text-gray-800 dark:text-gray-200">
                        {name}
                      </td>
                      <td className="px-4 py-2 app-table-content text-gray-800 dark:text-gray-200">
                        {units.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 app-table-content text-center text-gray-800 dark:text-gray-200 whitespace-nowrap">
                        ${formatValue(amountInUSD)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      ))}
    </div>
  );
};

export default ByTypeSection;
