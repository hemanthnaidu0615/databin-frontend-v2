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

    const requests: Promise<{ title: string; data: any[] }>[] = sections.map(
      async ({ title, endpoint }) => {
        if (!endpoint) return { title, data: [] };
        try {
          const response = await axiosInstance.get(
            `/sales/${endpoint}/${formattedCompany}`,
            { params: { startDate: formattedStart, endDate: formattedEnd } }
          );
          return { title, data: response.data.data || [] };

        } catch (err) {
          console.error(`Error fetching data for ${title}:`, err);
          return { title, data: [] };
        }
      }
    );

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
          <div
            className="px-4 py-2 font-semibold text-sm sm:text-base truncate app-table-heading"
            style={{ backgroundColor: "#a855f7", color: "#fff" }}
          >
            {title}
          </div>

          {/* Scrollable container for all sections */}
          <div className="p-2 max-h-[205px] overflow-y-auto space-y-2 app-table-content">
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
                <div
                  key={idx}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-sm flex flex-col mb-2 last:mb-0"
                >
                  <div className="flex justify-between text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                    <span className="truncate">{name}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ${formatValue(amountInUSD)}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    Units: {units.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ByTypeSection;
