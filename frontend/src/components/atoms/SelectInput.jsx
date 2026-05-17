import React from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';

function SelectInput({ value, onChange, options = [], placeholder, disabled = false, name, ...rest }) {
  function handleValueChange(newValue) {
    if (onChange) {
      onChange({ target: { value: newValue, name: name ?? '' } });
    }
  }

  return (
    <Select.Root
      value={value ?? ''}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <Select.Trigger
        className={`
          w-full flex items-center justify-between
          px-4 h-[50px]
          rounded-lg border text-base outline-none
          transition-colors text-left
          focus:border-[#4D44B5] focus:ring-1 focus:ring-[#4D44B5]
          data-[state=open]:border-[#4D44B5] data-[state=open]:ring-1 data-[state=open]:ring-[#4D44B5]
          ${disabled
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-[#CBD0E0]'
            : 'bg-white text-black border-[#CBD0E0] cursor-pointer hover:border-[#4D44B5]'
          }
        `}
      >
        <Select.Value placeholder={
          <span className="text-gray-400">{placeholder || 'Pilih...'}</span>
        } />
        <Select.Icon>
          <ChevronDown size={20} className={`transition-transform duration-200 ${disabled ? 'text-gray-400' : 'text-gray-600'}`} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="
            z-50 min-w-[var(--radix-select-trigger-width)]
            bg-white border border-[#CBD0E0] rounded-lg shadow-lg
            overflow-hidden
            animate-in fade-in-0 zoom-in-95
          "
          position="popper"
          sideOffset={4}
        >
          <Select.Viewport className="p-1">
            {options.map((option) => {
              const optValue = typeof option === 'string' ? option : option.value;
              const optLabel = typeof option === 'string' ? option : option.label;

              return (
                <Select.Item
                  key={optValue}
                  value={optValue}
                  className="
                    relative flex items-center justify-between
                    px-4 py-2.5 rounded-md text-sm text-black
                    cursor-pointer outline-none select-none
                    hover:bg-[#EEF0FF] hover:text-[#3D3FA8]
                    focus:bg-[#EEF0FF] focus:text-[#3D3FA8]
                    data-[state=checked]:bg-[#EEF0FF] data-[state=checked]:text-[#3D3FA8] data-[state=checked]:font-medium
                    transition-colors
                  "
                >
                  <Select.ItemText>{optLabel}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check size={14} className="text-[#3D3FA8]" />
                  </Select.ItemIndicator>
                </Select.Item>
              );
            })}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export default SelectInput;