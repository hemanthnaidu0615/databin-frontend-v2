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
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ${d
      .getHours()
      .toString()
      .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d
        .getSeconds()
        .toString()
        .padStart(2, "0")}.000`;
};

function convertToUSD(rupees: number): number {
  const exchangeRate = 0.012;
  return rupees * exchangeRate;
}

const formatValue = (value: number) => {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "m";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "k";
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
          {
            params: { startDate: formattedStart, endDate: formattedEnd },
          }
        );
        console.log(`${title}:`, response.data);
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

  const rowHeight = 36;

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {sections.map(({ title }) => (
        <div
          key={title}
          className="border rounded-xl shadow-sm overflow-hidden border-gray-200 dark:border-gray-700"
        >
          <div className="bg-violet-100 dark:bg-violet-950 px-4 py-2 app-table-heading">
            {title}
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-center bg-white dark:bg-gray-800">
                <th className="px-1 py-2 app-table-content">
                  Name
                </th>
                <th className="px-5 py-2 app-table-content">
                  Units
                </th>
                <th className="app-table-content  ">
                  Total Amount
                </th>
              </tr>
            </thead>
          </table>

          {/* Scrollable tbody wrapper only for "By Item" */}
          {title === "By Item" ? (
            <div
              style={{
                maxHeight: rowHeight * 3,
                overflowY: "auto",
              }}
            >
              <table className="w-full text-sm">
                <tbody>
                  {(dataBySection[title] || []).map((row, idx) => {
                    const name = `Product ${row.product_id}`;
                    const units = row.total_quantity || 0;
                    const amountInINR = row.total_amount || 0;
                    const amountInUSD = convertToUSD(amountInINR);

                    return (
                      <tr
                        key={idx}
                        className="border-t border-gray-100 dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-800"
                      >
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                          {name}
                        </td>
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                          {units.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                          ${formatValue(amountInUSD)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {(dataBySection[title] || []).map((row, idx) => {
                  const name =
                    row.channel ||
                    row.order_type ||
                    row.name ||
                    row.fulfilment_channel ||
                    "N/A";
                  const units = row.quantity || row.total_quantity || 0;
                  const amountInINR = row.amount || row.total_amount || 0;
                  const amountInUSD = convertToUSD(amountInINR);

                  return (
                    <tr
                      key={idx}
                      className="border-t border-gray-100 dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-800"
                    >
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                        {name}
                      </td>
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                        {units.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                        ${formatValue(amountInUSD)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
};

export default ByTypeSection;
