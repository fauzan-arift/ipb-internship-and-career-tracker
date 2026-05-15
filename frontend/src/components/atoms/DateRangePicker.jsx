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

function DateRangePicker({ label, placeholder = 'dd/mm/yyyy – dd/mm/yyyy', value = {}, onChange, error, disabled = false }) {
  const [open, setOpen] = useState(false);

  function onSelectHandler(range) {
    onChange(range || {});
    if (range && range.from && range.to) {
      setOpen(false);
    }
  }

  let displayValue = placeholder;
  if (value.from && value.to) {
    displayValue = `${formatDate(value.from)} – ${formatDate(value.to)}`;
  } else if (value.from) {
    displayValue = `${formatDate(value.from)} – ...`;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
          {label}
        </label>
      )}
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '8px',
              border: error ? '1.5px solid #8B1A1A' : '1.5px solid #CBD0E0',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              color: value.from ? '#1A1A2E' : '#6B7280',
              backgroundColor: disabled ? '#F5F5F5' : '#FFFFFF',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.6 : 1,
              width: '100%',
              boxSizing: 'border-box',
              textAlign: 'left',
            }}
          >
            <span>{displayValue}</span>
            <Calendar size={16} color="#6B7280" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
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
              mode="range"
              selected={value?.from ? value : undefined}
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

export default DateRangePicker;