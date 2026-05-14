import React from 'react';
import FieldDisplay from '../atoms/FieldDisplay';

function InfoGrid({ fields }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
      }}
    >
      {fields.map((field, index) => (
        <FieldDisplay key={index} label={field.label} value={field.value} />
      ))}
    </div>
  );
}

export default InfoGrid;