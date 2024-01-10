import { useState } from 'react';

export type SelectProps = {
  label?: string;
  required?: boolean;
  disabled?: boolean;
  options: Array<{ value: string; label: string }>;
  defaultValue?: string;
  onChange?: (value: string) => void;
};
export default function Select({ label, required, options, defaultValue, onChange, disabled }: SelectProps) {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue || '');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="form-label" style={{ marginBottom: 2 }}>
          {label} {required ? <span>*</span> : ''}
        </label>
      )}
      <select
        disabled={disabled}
        className="form-select"
        aria-label="Select option"
        required={required}
        value={selectedValue}
        defaultValue={selectedValue}
        onChange={handleChange}
      >
        {options.map(option => (
          <option key={option.value} selected={option.value === selectedValue} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
