import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

const dayPickerStyles = `
  .rdp {
    --rdp-accent-color: #3D3FA8;
    --rdp-background-color: #EEF0FF;
    margin: 0;
    font-family: Inter, sans-serif;
    font-size: 14px;
  }
  .rdp-months {
    display: flex;
    gap: 24px;
  }
  .rdp-day_selected:not(.rdp-day_disabled) {
    background-color: #3D3FA8 !important;
    color: white !important;
    border-radius: 6px;
  }
  .rdp-day_range_middle:not(.rdp-day_disabled) {
    background-color: #EEF0FF !important;
    color: #3D3FA8 !important;
    border-radius: 0 !important;
  }
  .rdp-day_range_start:not(.rdp-day_disabled),
  .rdp-day_range_end:not(.rdp-day_disabled) {
    background-color: #3D3FA8 !important;
    color: white !important;
    border-radius: 6px !important;
  }
  .rdp-day:hover:not(.rdp-day_disabled):not(.rdp-day_selected):not(.rdp-day_range_middle) {
    background-color: #EEF0FF !important;
    border-radius: 6px;
  }
  .rdp-nav_button {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .rdp-nav_button:hover {
    background-color: #EEF0FF !important;
  }
  .rdp-caption {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4px;
    margin-bottom: 8px;
  }
  .rdp-caption_label {
    font-weight: 600;
    color: #1A1A2E;
    font-size: 14px;
  }
  .rdp-head_cell {
    color: #6B7280;
    font-weight: 500;
    font-size: 13px;
  }
  .rdp-day_today:not(.rdp-day_selected) {
    color: #3D3FA8;
    font-weight: 700;
  }
  .rdp-button:focus-visible {
    outline: 2px solid #3D3FA8;
    outline-offset: 2px;
  }
`;

function DateRangePicker({ label, placeholder = 'Pilih rentang tanggal', value = {}, onChange, error, disabled = false }) {
  const [open, setOpen] = useState(false);

  function onSelectHandler(range) {
    onChange(range || {});
    if (range?.from && range?.to) {
      setOpen(false);
    }
  }

  let displayValue = placeholder;
  if (value.from && value.to) {
    displayValue = `${format(value.from, 'dd MMM yyyy', { locale: id })} – ${format(value.to, 'dd MMM yyyy', { locale: id })}`;
  } else if (value.from) {
    displayValue = `${format(value.from, 'dd MMM yyyy', { locale: id })} – ...`;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <style>{dayPickerStyles}</style>
      {label && (
        <label style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
          {label}
        </label>
      )}
      <Popover.Root open={open} onOpenChange={disabled ? undefined : setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={`w-full flex items-center justify-between px-4 h-[50px] rounded-lg border text-base outline-none transition-colors text-left
              ${error ? 'border-red-400' : 'border-[#CBD0E0]'}
              ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white cursor-pointer hover:border-[#4D44B5]'}
              ${open ? 'border-[#4D44B5] ring-1 ring-[#4D44B5]' : ''}
            `}
          >
            <span style={{ color: value.from ? '#1A1A2E' : '#9CA3AF' }}>
              {displayValue}
            </span>
            <Calendar size={16} color="#6B7280" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={4}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #CBD0E0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              zIndex: 100,
              padding: '16px',
            }}
          >
            <DayPicker
              mode="range"
              numberOfMonths={2}
              selected={value?.from ? value : undefined}
              onSelect={onSelectHandler}
              showOutsideDays
              locale={id}
              components={{
                IconLeft: () => <ChevronLeft size={16} color="#1A1A2E" />,
                IconRight: () => <ChevronRight size={16} color="#1A1A2E" />,
              }}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {error && (
        <span style={{ fontSize: '12px', color: '#8B1A1A', fontFamily: 'Inter, sans-serif' }}>
          {error}
        </span>
      )}
    </div>
  );
}

export default DateRangePicker;