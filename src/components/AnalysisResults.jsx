// frontend/src/components/AnalysisResults.jsx

import React from "react";
import StatCard from "./StatCard.jsx"; // Import StatCard
import IssueCard from "./IssueCard"; // Import IssueCard

const AnalysisResults = ({ result }) => {
  const { url, timestamp, summary, issues } = result;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-4">
        Analysis Report
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Issues"
          value={summary.total_issues}
          bgColor="bg-blue-100"
          textColor="text-blue-700"
        />
        <StatCard
          title="Critical"
          value={summary.critical}
          bgColor="bg-red-100"
          textColor="text-red-700"
        />
        <StatCard
          title="Moderate"
          value={summary.moderate}
          bgColor="bg-orange-100"
          textColor="text-orange-700"
        />
        <StatCard
          title="Minor"
          value={summary.minor}
          bgColor="bg-green-100"
          textColor="text-green-700"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-700 mb-4">
        Detailed Issues ({issues.length})
      </h3>
      {issues.length === 0 ? (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center font-medium">
          No accessibility issues found. Great job!
        </div>
      ) : (
        <div className="space-y-4">
          {issues.map((issue, index) => (
            <IssueCard key={index} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
