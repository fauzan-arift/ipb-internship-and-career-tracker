import React from 'react';

function FormGrid2Col({ children }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
      }}
    >
      {children}
    </div>
  );
}

export default FormGrid2Col;