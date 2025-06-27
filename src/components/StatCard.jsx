// frontend/src/components/StatCard.jsx

import React from "react";

// The StatCard component now correctly accepts and uses a single 'color' prop
const StatCard = ({ title, value, color }) => (
  <div
    // The 'color' prop should contain both background and text classes, e.g., "bg-red-100 text-red-800"
    className={`p-4 rounded-xl shadow-md text-center transform hover:scale-105 transition-transform duration-200
                ${color || "bg-gray-50 text-gray-800"}
                flex flex-col items-center justify-center`} // Added flex layout for centering
  >
    <p className="text-sm font-medium">{title}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

export default StatCard;
