import React from 'react';

const cardData = [
  { label: 'Total Products', value: 1248, border: '#8b5cf6' },
  { label: 'In Stock', value: 872, border: '#00c853' },
  { label: 'Low Stock', value: 340, border: '#ffc400' },
  { label: 'Out of Stock', value: 36, border: '#ff3d00' },
];

const InventoryCards = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {cardData.map((card, index) => (
        <div
          key={index}
          className={`group relative p-4 rounded-xl bg-white dark:bg-gray-800 backdrop-blur-md transition-all duration-300 ease-in-out transform hover:scale-105`}
        >

            
          {/* Border glow effect on hover */}
          <div
            className="absolute inset-0 rounded-xl border-2 opacity-60 group-hover:opacity-100 group-hover:shadow-[0_0_15px] transition duration-300 pointer-events-none"
            style={{
              borderColor: card.border,
              boxShadow: `0 0 10px ${card.border}`,
            }}
          ></div>

          {/* Content Layer */}
          <div className="relative z-10">
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{card.label}</p>
            <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{card.value}</p>
          </div>

                
          
        </div>
      ))}
    </div>
  );
};

export default InventoryCards;
