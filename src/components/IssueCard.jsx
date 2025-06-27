// frontend/src/components/IssueCard.jsx

import React, { useState } from "react";

const IssueCard = ({ issue }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case "critical":
      case "serious":
        return "border-red-500 bg-red-50";
      case "moderate":
        return "border-orange-500 bg-orange-50";
      case "minor":
        return "border-blue-500 bg-blue-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  return (
    <div
      className={`border-l-4 ${getSeverityColor(
        issue.severity
      )} rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 flex justify-between items-center bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
      >
        <div>
          <h4 className="text-lg font-semibold text-gray-800">
            {issue.description}
          </h4>
          <p
            className={`text-sm font-medium capitalize ${
              issue.severity === "critical"
                ? "text-red-600"
                : issue.severity === "serious"
                ? "text-red-600"
                : issue.severity === "moderate"
                ? "text-orange-600"
                : "text-blue-600"
            }`}
          >
            Severity: {issue.severity}
          </p>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
            isOpen ? "rotate-90" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </button>

      {isOpen && (
        <div className="p-4 pt-0 bg-white border-t border-gray-200">
          <p className="text-gray-700 text-sm mb-3">
            <strong className="font-medium">Help:</strong> {issue.help}
          </p>

          {issue.nodes && issue.nodes.length > 0 && (
            <div className="mb-3">
              <p className="text-gray-700 text-sm font-medium mb-1">
                Problematic HTML:
              </p>
              <pre className="bg-gray-100 p-2 rounded-md text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-all">
                <code>{issue.nodes[0].html}</code>
              </pre>
            </div>
          )}

          {issue.ai_suggestions && (
            <div className="space-y-2">
              <p className="text-gray-700 text-sm font-medium">
                AI Suggestions:
              </p>
              <p className="text-gray-700 text-sm">
                <strong className="font-medium">Short Fix:</strong>{" "}
                {issue.ai_suggestions.short_fix}
              </p>
              <p className="text-gray-700 text-sm">
                <strong className="font-medium">Detailed Fix:</strong>{" "}
                {issue.ai_suggestions.detailed_fix}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IssueCard;
