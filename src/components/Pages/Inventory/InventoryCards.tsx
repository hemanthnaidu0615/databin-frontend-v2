import React from 'react';
import { PrimeIcons } from 'primereact/api';
import 'primeicons/primeicons.css';

const cardData = [
  { 
    label: 'Total Products', 
    value: 1248, 
    border: '#8b5cf6',
    icon: PrimeIcons.BOX,
    barPercent: 85,
    iconColor: 'text-purple-500'
  },
  { 
    label: 'In Stock', 
    value: 872, 
    border: '#00c853',
    icon: PrimeIcons.CHECK_CIRCLE,
    barPercent: 70,
    iconColor: 'text-green-500'
  },
  { 
    label: 'Low Stock', 
    value: 340, 
    border: '#ffc400',
    icon: PrimeIcons.EXCLAMATION_CIRCLE,
    barPercent: 45,
    iconColor: 'text-yellow-500'
  },
  { 
    label: 'Out of Stock', 
    value: 36, 
    border: '#ff3d00',
    icon: PrimeIcons.TIMES_CIRCLE,
    barPercent: 15,
    iconColor: 'text-red-500'
  },
];

const InventoryCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cardData.map((card, index) => (
        <div
          key={index}
          className="group relative p-5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-l-4 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]"
          style={{ borderLeftColor: card.border }}
        >
          {/* Border glow effect on hover */}
          <div
            className="absolute inset-0 rounded-xl border-2 opacity-0 group-hover:opacity-60 group-hover:shadow-[0_0_15px] transition duration-300 pointer-events-none"
            style={{
              borderColor: card.border,
              boxShadow: `0 0 15px ${card.border}`,
            }}
          ></div>

          {/* Content Layer */}
          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <i className={`pi ${card.icon} ${card.iconColor} text-lg`} />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {card.label}
              </p>
            </div>
            
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {card.value.toLocaleString()}
            </p>

          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryCards;