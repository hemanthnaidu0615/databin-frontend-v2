import { Dropdown } from "primereact/dropdown";
import React from "react";


type PrimeSelectFilterProps<T = any> = {
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
};

export const PrimeSelectFilter = <T,>({
  value,
  options,
  onChange,
  placeholder,
  className,
  disabled = false,
}: PrimeSelectFilterProps<T>) => {
  return (
    <Dropdown
      value={value}
      options={options}
      onChange={(e) => onChange(e.value)}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
    />
  );
};

