import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

function formatDate(date) {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const dayPickerStyles = `
  .rdp {
    --rdp-accent-color: #3D3FA8;
    --rdp-background-color: #EEF0FF;
    --rdp-accent-color-dark: #2D2F88;
    --rdp-background-color-dark: #EEF0FF;
    margin: 0;
    font-family: Inter, sans-serif;
    font-size: 14px;
  }
  .rdp-day_selected:not(.rdp-day_disabled) {
    background-color: #3D3FA8 !important;
    color: white !important;
    border-radius: 6px;
  }
  .rdp-day:hover:not(.rdp-day_disabled):not(.rdp-day_selected) {
    background-color: #EEF0FF !important;
    border-radius: 6px;
  }
  .rdp-button:focus-visible {
    outline: 2px solid #3D3FA8;
    outline-offset: 2px;
  }
  .rdp-nav_button:hover {
    background-color: #EEF0FF !important;
    border-radius: 6px;
  }
  .rdp-caption_label {
    font-weight: 600;
    color: #1A1A2E;
  }
  .rdp-head_cell {
    color: #6B7280;
    font-weight: 500;
  }
  .rdp-day_today:not(.rdp-day_selected) {
    color: #3D3FA8;
    font-weight: 700;
  }
`;

function DatePicker({ label, placeholder = 'dd/mm/yyyy', value, onChange, error, disabled = false }) {
  const [open, setOpen] = useState(false);

  function onSelectHandler(date) {
    onChange(date);
    setOpen(false);
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
            <span style={{ color: value ? '#1A1A2E' : '#9CA3AF' }}>
              {value ? formatDate(value) : placeholder}
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
              padding: '8px',
            }}
          >
            <DayPicker
              mode="single"
              selected={value || undefined}
              onSelect={onSelectHandler}
              showOutsideDays
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

export default DatePicker;