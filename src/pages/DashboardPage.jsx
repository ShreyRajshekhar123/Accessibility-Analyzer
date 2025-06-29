// frontend/src/pages/DashboardPage.jsx

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { useAuth } from "../context/AuthContext";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define your backend API URL
const API_BASE_URL = "http://localhost:8000/api";

const DashboardPage = () => {
  const { user, loadingAuth } = useAuth(); // user will be the Firebase user object

  // State to store reports fetched for the current user
  const [userReports, setUserReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [errorReports, setErrorReports] = useState(null);

  // State for selected websites for comparison
  const [selectedWebsiteIds, setSelectedWebsiteIds] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // --- REAL Backend API Call ---
  const fetchUserReports = useCallback(async (firebaseUser) => {
    setLoadingReports(true);
    setErrorReports(null);
    try {
      if (!firebaseUser || !firebaseUser.uid) {
        setUserReports([]);
        setLoadingReports(false);
        console.warn("No authenticated user found for fetching reports.");
        return;
      }

      const idToken = await firebaseUser.getIdToken();
      // console.log("Firebase ID Token acquired for Dashboard.");

      const response = await fetch(
        `${API_BASE_URL}/reports/user/${firebaseUser.uid}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status} - ${
            errorData.detail || response.statusText
          }`
        );
      }

      const data = await response.json();
      setUserReports(data);
      if (data.length === 0) {
        setSelectedWebsiteIds([]);
      }
      // Added console.log to see fetched data
      // console.log("Fetched User Reports:", data);

    } catch (err) {
      console.error("Failed to fetch user reports:", err);
      setErrorReports(
        `Failed to load reports: ${err.message}. Please try again.`
      );
    } finally {
      setLoadingReports(false);
    }
  }, []);

  useEffect(() => {
    if (!loadingAuth && user) {
      fetchUserReports(user);
    } else if (!loadingAuth && !user) {
      setUserReports([]);
      setLoadingReports(false);
      setErrorReports("You must be logged in to view your dashboard.");
    }
  }, [user, loadingAuth, fetchUserReports]);

  const overallMetrics = userReports.reduce(
    (acc, report) => {
      acc.totalIssuesFound += report.summary.total_issues || 0;
      acc.reportsAnalyzed += 1;
      // CORRECTED: Use 'criticalIssues' as per backend JSON
      acc.criticalIssues += report.summary.criticalIssues || 0;

      if (
        !acc.lastReportDate ||
        new Date(report.timestamp) > new Date(acc.lastReportDate)
      ) {
        acc.lastReportDate = report.timestamp;
        acc.lastReportUrl = report.url;
      }
      return acc;
    },
    {
      totalIssuesFound: 0,
      reportsAnalyzed: 0,
      criticalIssues: 0,
      lastReportDate: null,
      lastReportUrl: null,
    }
  );

  // Added console.log to see calculated overall metrics
  // console.log("Calculated Overall Metrics:", overallMetrics);

  useEffect(() => {
    const filteredReports = userReports.filter((report) =>
      // Corrected to use report._id for filtering
      selectedWebsiteIds.includes(report._id)
    );

    const labels = filteredReports.map((report) => {
      try {
        const urlObj = new URL(report.url);
        return urlObj.hostname;
      } catch (e) {
        return report.url;
      }
    });

    const criticalIssuesData = filteredReports.map(
      // CORRECTED: Use 'criticalIssues' as per backend JSON
      (report) => report.summary.criticalIssues || 0
    );
    const totalIssuesData = filteredReports.map(
      (report) => report.summary.total_issues || 0
    );

    setChartData({
      labels,
      datasets: [
        {
          label: "Critical Issues",
          data: criticalIssuesData,
          backgroundColor: "rgba(239, 68, 68, 0.6)",
          borderColor: "rgba(239, 68, 68, 1)",
          borderWidth: 1,
        },
        {
          label: "Total Issues",
          data: totalIssuesData,
          backgroundColor: "rgba(99, 102, 241, 0.6)",
          borderColor: "rgba(99, 102, 241, 1)",
          borderWidth: 1,
        },
      ],
    });
  }, [selectedWebsiteIds, userReports]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#4b5563",
        },
      },
      title: {
        display: true,
        text: "Accessibility Issues Comparison",
        font: {
          size: 18,
          weight: "bold",
        },
        color: "#374151",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Website URL",
          color: "#4b5563",
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "#4b5563",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Issues",
          color: "#4b5563",
        },
        ticks: {
          color: "#4b5563",
        },
      },
    },
  };

  const handleWebsiteSelectionChange = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setSelectedWebsiteIds(value);
  };

  if (loadingAuth || loadingReports) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="text-xl text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  if (errorReports) {
    return (
      <div className="p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md text-center">
        {errorReports}
        {!user && (
          <p className="mt-4">
            Please{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              log in
            </Link>{" "}
            to view your reports.
          </p>
        )}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p>You need to be logged in to view the dashboard.</p>
        <Link
          to="/login"
          className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8">
      {/* Welcome Section */}
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-3 animate-fade-in-down">
          Welcome to your Dashboard,{" "}
          {user?.displayName || user?.email || "User"}!
        </h1>
        <p className="text-gray-600 text-lg animate-fade-in-up">
          This is your personalized overview of your accessibility analysis
          reports.
        </p>
      </div>

      {/* Key Metrics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center animate-pop-in">
          <p className="text-5xl font-bold text-indigo-600">
            {overallMetrics.reportsAnalyzed}
          </p>
          <p className="text-gray-500 text-lg mt-2">Reports Analyzed</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center animate-pop-in delay-1">
          <p className="text-5xl font-bold text-red-600">
            {overallMetrics.criticalIssues}
          </p>
          <p className="text-gray-500 text-lg mt-2">Critical Issues Overall</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center animate-pop-in delay-2">
          <p className="text-5xl font-bold text-yellow-600">
            {overallMetrics.totalIssuesFound}
          </p>
          <p className="text-gray-500 text-lg mt-2">Total Issues Found</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center animate-pop-in delay-3">
          <p className="text-md font-bold text-gray-700 mb-2">Last Report</p>
          <p className="text-indigo-600 text-lg font-semibold truncate w-full">
            {overallMetrics.lastReportUrl || "N/A"}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {overallMetrics.lastReportDate
              ? new Date(overallMetrics.lastReportDate).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Overall Analysis Comparison with Graphs */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Overall Analysis Comparison
        </h2>

        <>
          <div className="mb-6">
            <label
              htmlFor="website-select"
              className="block text-gray-700 text-lg font-medium mb-2"
            >
              Select Websites for Comparison:
            </label>
            <select
              id="website-select"
              multiple
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={selectedWebsiteIds}
              onChange={handleWebsiteSelectionChange}
              style={{ minHeight: "120px" }}
            >
              {userReports.length > 0 ? (
                userReports.map((report) => (
                  // Corrected: Use report._id for key and value
                  <option key={report._id} value={report._id}>
                    {report.url} (
                    {new Date(report.timestamp).toLocaleDateString()})
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No reports available. Analyze a website first!
                </option>
              )}
            </select>
            <p className="text-sm text-gray-500 mt-2">
              Hold Ctrl (Windows) or Cmd (Mac) to select multiple websites.
            </p>
          </div>

          <div className="h-96">
            {selectedWebsiteIds.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50 text-gray-500 rounded-md border-2 border-dashed border-gray-200">
                Select websites from the dropdown above to see a comparison
                graph.
              </div>
            )}
          </div>
        </>
      </div>

      {/* Recent Reports Section */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Your Recent Reports
        </h2>
        {userReports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    URL
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Issues
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Critical Issues
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userReports.slice(0, 4).map(
                  (
                    report // Show only the 4 most recent for brevity
                  ) => (
                    // Corrected: Use report._id for row key and Link
                    <tr key={report._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 hover:text-indigo-800 truncate max-w-xs sm:max-w-md">
                        <Link to={`/reports/${report._id}`}>{report.url}</Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.summary.total_issues}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                        {/* CORRECTED: Use 'criticalIssues' as per backend JSON */}
                        {report.summary.criticalIssues}{" "}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/reports/${report._id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Report
                        </Link>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No reports found. Analyze a website to see your data!
          </p>
        )}
        {userReports.length > 4 && (
          <div className="text-right mt-4">
            <Link
              to="/reports"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View All Reports &rarr;
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions / Call to Action */}
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Ready for a New Analysis?
        </h2>
        <p className="text-gray-600 mb-6">
          Get instant, AI-powered insights into your website's accessibility.
        </p>
        <Link
          to="/analyze"
          className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-md shadow-lg
                             text-white bg-indigo-600 hover:bg-indigo-700
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 transform hover:scale-105"
        >
          <span role="img" aria-label="Sparkles" className="mr-3">
            ✨
          </span>
          Analyze New Report
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;