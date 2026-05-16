import React from 'react';
import { ChevronDown } from 'lucide-react';

function SelectInput({ value, onChange, options = [], placeholder, disabled = false, ...rest }) {
  return (
    <div className="relative">
      <select
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3.5 rounded-lg border border-[#CBD0E0] text-base outline-none focus:border-[#4D44B5] focus:ring-1 focus:ring-[#4D44B5] transition-colors appearance-none pr-14 ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-black'}`}
        {...rest}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((option) => (
          <option
            key={typeof option === 'string' ? option : option.value}
            value={typeof option === 'string' ? option : option.value}
          >
            {typeof option === 'string' ? option : option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
        <ChevronDown size={20} color="black" />
      </div>
    </div>
  );
}

export default SelectInput;