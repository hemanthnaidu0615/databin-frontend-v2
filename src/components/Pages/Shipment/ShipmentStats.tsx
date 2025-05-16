import React, { useEffect, useState } from 'react';
import { PrimeIcons } from 'primereact/api';
import 'primeicons/primeicons.css';
import { useSelector } from 'react-redux';

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')}`;

interface ShipmentStatsProps {
  selectedCarrier: string | null;
  selectedMethod: string | null;
}

const ShipmentStats: React.FC<ShipmentStatsProps> = ({ selectedCarrier, selectedMethod }) => {
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);

  const [totalShipments, setTotalShipments] = useState<number | null>(null);
  const [onTimeShipments, setOnTimeShipments] = useState<number | null>(null);
  const [delayedShipments, setDelayedShipments] = useState<number | null>(null);
  const [avgDeliveryTime, setAvgDeliveryTime] = useState<string | null>(null);

  const [startDate, endDate] = dateRange || [];

  useEffect(() => {
    if (!startDate || !endDate) return;

    const formattedStart = formatDate(new Date(startDate));
    const formattedEnd = formatDate(new Date(endDate));

    const params = new URLSearchParams({
      startDate: formattedStart,
      endDate: formattedEnd,
    });

    if (enterpriseKey) params.append('enterpriseKey', enterpriseKey);
    if (selectedCarrier) params.append('carrier', selectedCarrier);
    if (selectedMethod) params.append('shippingMethod', selectedMethod);

    const fetchStats = async () => {
      try {
        const [totalRes, onTimeRes, delayedRes, avgTimeRes] = await Promise.all([
          fetch(`http://localhost:8080/api/shipment-dashboard-kpi/total-shipments?${params}`),
          fetch(`http://localhost:8080/api/shipment-dashboard-kpi/on-time-shipments?${params}`),
          fetch(`http://localhost:8080/api/shipment-dashboard-kpi/delayed-shipments?${params}`),
          fetch(`http://localhost:8080/api/shipment-dashboard-kpi/average-delivery-time?${params}`),
        ]);

        const totalData = await totalRes.json();
        const onTimeData = await onTimeRes.json();
        const delayedData = await delayedRes.json();
        const avgTimeData = await avgTimeRes.json();

        setTotalShipments(totalData.total_shipments);
        setOnTimeShipments(onTimeData.on_time_shipments);
        setDelayedShipments(delayedData.delayed_shipments);
        setAvgDeliveryTime(avgTimeData.average_delivery_time);
      } catch (error) {
        console.error('Error fetching shipment stats:', error);
      }
    };

    fetchStats();
  }, [startDate, endDate, enterpriseKey, selectedCarrier, selectedMethod]);

  const stats = [
    {
      title: 'Total Shipments',
      value: totalShipments !== null ? totalShipments.toLocaleString() : '--',
      icon: PrimeIcons.BOX,
      iconColor: 'text-violet-400',
      glowColor: '#8b5cf6',
    },
    {
      title: 'On-Time Delivery',
      value:
        totalShipments && onTimeShipments !== null
          ? `${((onTimeShipments / totalShipments) * 100).toFixed(1)}%`
          : '--',
      icon: PrimeIcons.CLOCK,
      iconColor: 'text-green-400',
      glowColor: '#22C55E',
    },
    {
      title: 'Avg Delivery Time',
      value: avgDeliveryTime ? `${avgDeliveryTime} days` : '--',
      icon: PrimeIcons.SPINNER,
      iconColor: 'text-yellow-400',
      glowColor: '#ffc400',
    },
    {
      title: 'Delayed Shipments',
      value: delayedShipments !== null ? delayedShipments.toLocaleString() : '--',
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      iconColor: 'text-red-400',
      glowColor: '#EF4444',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 font-sans">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group relative flex flex-col gap-2 px-5 py-4 rounded-2xl bg-[#1C2333] text-white shadow-sm border-l-[6px] transition-transform transform hover:scale-[1.015]"
          style={{ borderColor: stat.glowColor }}
        >
          {/* Glowing border layer */}
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

export default ShipmentStats;
