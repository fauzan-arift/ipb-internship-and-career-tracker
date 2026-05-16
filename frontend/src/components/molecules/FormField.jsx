import React from 'react';

function FormField({ label, error, children }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-black font-medium text-base">{label}</label>}
      {children}
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}

export default FormField;