import React from 'react';
import * as Select from '@radix-ui/react-select';
import { SlidersHorizontal, Check } from 'lucide-react';

const ALL_VALUE = '__all__';

function FilterButton({ value, onChange, options = [], defaultLabel = 'Filter: Semua' }) {
  function handleValueChange(newValue) {
    if (onChange) {
      onChange({ target: { value: newValue === ALL_VALUE ? '' : newValue } });
    }
  }

  return (
    <Select.Root
      value={value === '' || value == null ? ALL_VALUE : value}
      onValueChange={handleValueChange}
    >
      <Select.Trigger
        className="
          flex items-center gap-2
          bg-[#3D3FA8] text-white
          px-4 py-2 rounded-lg
          text-sm font-semibold
          cursor-pointer outline-none
          hover:bg-[#2D2F88] transition-colors
          data-[state=open]:bg-[#2D2F88]
        "
      >
        <Select.Icon>
          <SlidersHorizontal size={14} className="text-white" />
        </Select.Icon>
        <Select.Value placeholder={defaultLabel}>
          {value
            ? options.find(o => o.value === value)?.label ?? defaultLabel
            : defaultLabel
          }
        </Select.Value>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="
            z-50 min-w-[var(--radix-select-trigger-width)]
            bg-white border border-[#CBD0E0] rounded-lg shadow-lg
            overflow-hidden
          "
          position="popper"
          sideOffset={4}
          align="end"
          modal={false}
        >
          <Select.Viewport className="p-1">
            <Select.Item
              value={ALL_VALUE}
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
              <Select.ItemText>{defaultLabel}</Select.ItemText>
              <Select.ItemIndicator>
                <Check size={14} className="text-[#3D3FA8]" />
              </Select.ItemIndicator>
            </Select.Item>

            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
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
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check size={14} className="text-[#3D3FA8]" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export default FilterButton;