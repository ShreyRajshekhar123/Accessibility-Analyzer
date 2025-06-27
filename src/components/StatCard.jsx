// frontend/src/components/StatCard.jsx

import React from "react";

const StatCard = ({ title, value, bgColor, textColor }) => (
  <div
    className={`${bgColor} ${textColor} p-4 rounded-lg shadow-sm text-center transform hover:scale-105 transition-transform duration-200`}
  >
    <p className="text-sm font-medium">{title}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

export default StatCard;
