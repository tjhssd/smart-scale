import React from 'react';

const StatCard = ({ label, value, unit, color, icon }) => (
  <div className="stat-card">
    <span className="stat-label">{label}</span>
    <div className="stat-main">
      <span className="stat-value">{value}</span>
      <span className="stat-unit">{unit}</span>
    </div>
    <div className="stat-footer" style={{color}}>
      {icon} <span style={{marginLeft:'5px'}}>Mới nhất</span>
    </div>
  </div>
);

export default StatCard;