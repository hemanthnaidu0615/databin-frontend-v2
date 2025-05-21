import { useEffect, useState } from "react";
import { PrimeIcons } from "primereact/api";
import { useSelector } from "react-redux";
import "primeicons/primeicons.css";
import { axiosInstance } from "../../../axios";

const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
};

const FulfillmentStats = () => {
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);

  type Stat = {
    title: string;
    value: string | number;
    icon: string;
    iconColor: string;
    glowColor: string;
  };

  const [stats, setStats] = useState<Stat[]>([
    {
      title: "Orders in Pipeline",
      value: 0,
      icon: PrimeIcons.INBOX,
      iconColor: "text-purple-500",
      glowColor: "#8B5CF6",
    },
    {
      title: "Avg Fulfillment Time",
      value: "-",
      icon: PrimeIcons.CLOCK,
      iconColor: "text-green-500",
      glowColor: "#22C55E",
    },
    {
      title: "On-Time Rate",
      value: "-",
      icon: PrimeIcons.CHECK_CIRCLE,
      iconColor: "text-yellow-500",
      glowColor: "#FACC15",
    },
    {
      title: "Top Channel",
      value: "-",
      icon: PrimeIcons.SEND,
      iconColor: "text-blue-500",
      glowColor: "#3B82F6",
    },
  ]);

  useEffect(() => {
    const [startDate, endDate] = dateRange;
    if (!startDate || !endDate) return;

    const fetchStats = async () => {
      try {
        const formattedStart = formatDate(startDate);
        const formattedEnd = formatDate(endDate);

        const params = new URLSearchParams({
          startDate: formattedStart,
          endDate: formattedEnd,
        });

        if (enterpriseKey) {
          params.append("enterpriseKey", enterpriseKey);
        }

        const response = await axiosInstance.get("/fulfillment/kpi", {
          params: {
            startDate: formattedStart,
            endDate: formattedEnd,
            ...(enterpriseKey ? { enterpriseKey } : {}),
          },
        });
        const data = response.data as {
          orders_in_pipeline?: number;
          avg_fulfillment_time?: string | number;
          on_time_rate?: string | number;
          top_channel?: string;
        };


        setStats([
          {
            title: "Orders in Pipeline",
            value: data.orders_in_pipeline ?? 0,
            icon: PrimeIcons.INBOX,
            iconColor: "text-purple-500",
            glowColor: "#8B5CF6",
          },
          {
            title: "Avg Fulfillment Time",
            value: data.avg_fulfillment_time ?? "-",
            icon: PrimeIcons.CLOCK,
            iconColor: "text-green-500",
            glowColor: "#22C55E",
          },
          {
            title: "On-Time Rate",
            value: data.on_time_rate ?? "-",
            icon: PrimeIcons.CHECK_CIRCLE,
            iconColor: "text-yellow-500",
            glowColor: "#FACC15",
          },
          {
            title: "Top Channel",
            value: data.top_channel ?? "-",
            icon: PrimeIcons.SEND,
            iconColor: "text-blue-500",
            glowColor: "#3B82F6",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch fulfillment stats:", error);
      }
    };

    fetchStats();
  }, [dateRange, enterpriseKey]);

  return (
    <div className="font-sans">
      {/* existing return block below */}
      <div className="w-full overflow-x-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative flex flex-col gap-2 px-5 py-4 rounded-2xl bg-white dark:bg-[#1C2333] text-black dark:text-white shadow-sm border-l-[6px] transition-transform transform hover:scale-[1.015]"
              style={{ borderColor: stat.glowColor }}
            >
              <div
                className="absolute inset-0 rounded-xl border-2 opacity-0 group-hover:opacity-50 transition duration-300 pointer-events-none overflow-hidden"
                style={{
                  borderColor: stat.glowColor,
                  boxShadow: `0 0 8px ${stat.glowColor}`,
                }}
              ></div>

              <div className="flex items-center gap-2 relative z-10 text-black/60 dark:text-white/80">
                <i className={`pi ${stat.icon} ${stat.iconColor} text-base`} />
                <span className="text-sm font-medium">{stat.title}</span>
              </div>

              <div className="text-xl font-bold relative z-10 truncate">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FulfillmentStats;
