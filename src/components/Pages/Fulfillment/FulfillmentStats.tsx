import { useEffect, useState } from "react";
import { PrimeIcons } from "primereact/api";
import { useSelector } from "react-redux";
import "primeicons/primeicons.css";

const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
};

const FulfillmentStats = () => {
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);

  const [stats, setStats] = useState([
    {
      title: "Orders in Pipeline",
      value: 0,
      icon: PrimeIcons.INBOX,
      iconColor: "text-purple-400",
      glowColor: "#8B5CF6",
    },
    {
      title: "Avg Fulfillment Time",
      value: "-",
      icon: PrimeIcons.CLOCK,
      iconColor: "text-green-400",
      glowColor: "#22C55E",
    },
    {
      title: "On-Time Rate",
      value: "-",
      icon: PrimeIcons.CHECK_CIRCLE,
      iconColor: "text-yellow-400",
      glowColor: "#FACC15",
    },
    {
      title: "Top Channel",
      value: "-",
      icon: PrimeIcons.SEND,
      iconColor: "text-blue-400",
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

        const response = await fetch(
          `http://localhost:8080/api/fulfillment/kpi?${params.toString()}`
        );
        const data = await response.json();

        setStats([
          {
            title: "Orders in Pipeline",
            value: data.orders_in_pipeline ?? 0,
            icon: PrimeIcons.INBOX,
            iconColor: "text-purple-400",
            glowColor: "#8B5CF6",
          },
          {
            title: "Avg Fulfillment Time",
            value: data.avg_fulfillment_time ?? "-",
            icon: PrimeIcons.CLOCK,
            iconColor: "text-green-400",
            glowColor: "#22C55E",
          },
          {
            title: "On-Time Rate",
            value: data.on_time_rate ?? "-",
            icon: PrimeIcons.CHECK_CIRCLE,
            iconColor: "text-yellow-400",
            glowColor: "#FACC15",
          },
          {
            title: "Top Channel",
            value: data.top_channel ?? "-",
            icon: PrimeIcons.SEND,
            iconColor: "text-blue-400",
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full mb-6 font-sans">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group relative flex flex-col gap-2 px-5 py-4 rounded-2xl bg-[#1C2333] text-white shadow-sm border-l-[6px] transition-transform transform hover:scale-[1.015]"
          style={{ borderColor: stat.glowColor }}
        >
          {/* Glow Effect */}
          <div
            className="absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-60 transition duration-300 pointer-events-none"
            style={{
              borderColor: stat.glowColor,
              boxShadow: `0 0 15px ${stat.glowColor}`,
            }}
          ></div>

          <div className="flex items-center gap-2 relative z-10 text-white/80">
            <i className={`pi ${stat.icon} ${stat.iconColor} text-lg`} />
            <span className="text-sm font-medium">{stat.title}</span>
          </div>

          <div className="text-2xl font-extrabold relative z-10">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

export default FulfillmentStats;
