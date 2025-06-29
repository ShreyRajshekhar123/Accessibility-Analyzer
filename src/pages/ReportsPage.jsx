import React from "react";

const ReportsPage = ({ user }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md min-h-[50vh] flex flex-col justify-center items-center text-center">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">
        My Saved Reports
      </h1>
      <p className="text-gray-700 text-lg max-w-2xl">
        View, manage, and download your past accessibility analysis reports
        here. This section will list all your completed analyses.
      </p>
      {/* List reports here */}
    </div>
  );
};

export default ReportsPage;
