import React from "react";

interface KPIWidgetProps {
  label: string;
  value: string | number;
  icon: string;
  iconColor: string;
  glowColor: string;
}

const KPIWidget: React.FC<KPIWidgetProps> = ({
  label,
  value,
  icon,
  iconColor,
  glowColor,
}) => (
  <div
    className="group relative flex flex-col gap-2 px-5 py-4 rounded-2xl bg-white dark:bg-[#1C2333] text-black dark:text-white shadow-sm border-l-[6px] transition-transform transform hover:scale-[1.015]"
    style={{ borderColor: glowColor }}
  >
    <div
      className="absolute inset-0 rounded-xl border-2 opacity-0 group-hover:opacity-50 transition duration-300 pointer-events-none overflow-hidden"
      style={{ borderColor: glowColor, boxShadow: `0 0 10px ${glowColor}` }}
    />
    <div className="flex items-center gap-2 relative z-10">
      <i className={`pi ${icon} ${iconColor} text-base`} />
      <span className="app-widget-label">{label}</span>
    </div>
    <div className="app-widget-value relative z-10 truncate">{value}</div>
  </div>
);

export default KPIWidget;
