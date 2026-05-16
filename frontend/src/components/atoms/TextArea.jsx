import React from 'react';

function TextArea({ value, onChange, placeholder = '', rows = 4, disabled = false, ...rest }) {
  return (
    <textarea
      value={value ?? ''}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`w-full px-4 py-3.5 rounded-lg border border-[#CBD0E0] text-base outline-none focus:border-[#4D44B5] focus:ring-1 focus:ring-[#4D44B5] transition-colors resize-vertical ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-black'}`}
      {...rest}
    />
  );
}

export default TextArea;