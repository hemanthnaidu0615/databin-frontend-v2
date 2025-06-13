import { Dropdown } from "primereact/dropdown";
import React from "react";

type SelectFilterProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLSelectElement>;
  className?: string;
  disabled?: boolean;
  
};

type PrimeSelectFilterProps<T = any> = {
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};
const SelectFilter: React.FC<SelectFilterProps> = ({ label, value, options,disabled = false, onChange, onKeyDown, className }) => {
  return (
    <select
      className={className}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      disabled={disabled}
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
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

export default SelectFilter;
