import React from 'react';

interface TabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1 text-sm rounded-md ${active ? 'bg-black text-white' : 'bg-gray-100'
        }`}
    >
      {label}
    </button>
  );
};

export default Tab;
