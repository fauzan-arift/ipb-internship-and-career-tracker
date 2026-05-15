import React from 'react';
import SkillTag from '../atoms/SkillTag';

function SkillList({ skills = [] }) {
  if (skills.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {skills.map((skill, index) => (
        <SkillTag key={index} label={skill} />
      ))}
    </div>
  );
}

export default SkillList;