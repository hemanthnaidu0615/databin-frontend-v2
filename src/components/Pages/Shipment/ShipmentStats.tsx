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
        console.error("Error fetching shipment stats:", error);
      }
    };

    fetchStats();
  }, [startDate, endDate, enterpriseKey, selectedCarrier, selectedMethod]);

  const stats = [
    {
      title: 'Total Shipments',
      value: totalShipments !== null ? totalShipments.toLocaleString() : '--',
      icon: PrimeIcons.BOX,
      accent: 'border-blue-500',
      iconColor: 'text-blue-500',
      glowColor: '#3B82F6',
    },
    {
      title: 'On-Time Delivery',
      value:
        totalShipments && onTimeShipments !== null
          ? `${((onTimeShipments / totalShipments) * 100).toFixed(1)}%`
          : '--',
      icon: PrimeIcons.CLOCK,
      accent: 'border-green-500',
      iconColor: 'text-green-500',
      glowColor: '#22C55E',
    },
    {
      title: 'Avg Delivery Time',
      value: avgDeliveryTime ? `${avgDeliveryTime} days` : '--',
      icon: PrimeIcons.SPINNER,
      accent: 'border-cyan-500',
      iconColor: 'text-cyan-500',
      glowColor: '#06B6D4',
    },
    {
      title: 'Delayed Shipments',
      value: delayedShipments !== null ? delayedShipments.toLocaleString() : '--',
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      accent: 'border-red-500',
      iconColor: 'text-red-500',
      glowColor: '#EF4444',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`group relative flex flex-col gap-2 px-5 py-4 rounded-lg bg-white dark:bg-white/10 shadow-sm backdrop-blur-md border-l-4 ${stat.accent} transition-all duration-300 hover:scale-[1.015] hover:shadow-md`}
        >
          <div
            className="absolute inset-0 rounded-lg border-2 opacity-0 group-hover:opacity-60 group-hover:shadow-[0_0_15px] transition duration-300 pointer-events-none"
            style={{
              borderColor: stat.glowColor,
              boxShadow: `0 0 15px ${stat.glowColor}`,
            }}
          ></div>

          <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 relative z-10">
            <i className={`pi ${stat.icon} ${stat.iconColor} text-lg`} />
            <span className="text-sm font-medium">{stat.title}</span>
          </div>

          <div className="text-2xl font-bold text-gray-900 dark:text-white relative z-10">
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShipmentStats;
