// frontend/src/pages/MySavedReportsPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming you have an AuthContext

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"; // Ensure this matches your .env or default

const MySavedReportsPage = () => {
  const { user, loadingAuth } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetchAllUserReports should now directly use the `user` object from context
  // and handle obtaining the ID token.
  const fetchAllUserReports = useCallback(async () => {
    // Removed 'userId' parameter
    setLoading(true);
    setError(null);
    try {
      // Step 1: Ensure user and user.uid are available
      if (!user || !user.uid) {
        console.warn(
          "fetchAllUserReports: User or User UID is missing. Cannot fetch reports."
        );
        // If user is null or uid is missing, it means they are not logged in or auth is not fully loaded.
        // We handle this gracefully later in the component rendering.
        setLoading(false);
        return;
      }

      // Step 2: Get the Firebase ID Token
      const idToken = await user.getIdToken();
      // console.log(
      //   "MySavedReportsPage - User UID from context (BEFORE FETCH):",
      //   user.uid
      // );
      // console.log(
      //   "MySavedReportsPage - Firebase ID Token successfully obtained for UID:",
      //   user.uid
      // );

      // Step 3: Make the fetch request, including the Authorization header
      const response = await fetch(`${API_BASE_URL}/reports/user/${user.uid}`, {
        // Use user.uid directly here
        method: "GET", // Explicitly set method
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`, // THIS IS CRUCIAL!
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API response error:", errorData); // Log the full error from backend
        throw new Error(
          `HTTP error! Status: ${response.status} - ${
            errorData.detail || response.statusText || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      setReports(data);
    } catch (err) {
      console.error("Failed to fetch all user reports:", err);
      setError(
        `Failed to load reports: ${err.message}. Please ensure you are logged in with the correct account and try again.`
      );
    } finally {
      setLoading(false);
    }
  }, [user]); // Dependency on 'user' is necessary for user.uid and user.getIdToken()

  useEffect(() => {
    // Only attempt to fetch if authentication is loaded and a user is present
    if (!loadingAuth) {
      if (user && user.uid) {
        fetchAllUserReports(); // Call without arguments as userId is now derived internally
      } else {
        // If auth loading is complete and no user, set reports empty and stop loading
        setReports([]);
        setLoading(false);
        setError(null); // Clear any previous errors if user logs out
      }
    }
  }, [user, loadingAuth, fetchAllUserReports]); // Dependencies

  // --- Conditional Renders ---
  // 1. Initial loading state (auth or reports)
  if (loadingAuth || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <svg
          className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-600"
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
        Loading reports...
      </div>
    );
  }

  // 2. Error state (after loading)
  if (error) {
    return (
      <div className="p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md text-center max-w-lg mx-auto mt-10">
        <h2 className="text-xl font-bold mb-4">Error</h2>
        <p className="mb-4">{error}</p>
        <button
          onClick={() => fetchAllUserReports()} // Retry without arguments
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  // 3. Not logged in state (after loadingAuth is false and no user)
  if (!user) {
    return (
      <div className="p-8 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg shadow-md text-center max-w-lg mx-auto mt-10">
        <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
        <p>Please log in to view your saved reports.</p>
        <Link
          to="/login"
          className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  // 4. Main content (reports list or empty message)
  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        My Saved Reports
      </h1>

      {reports.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg shadow-inner text-center">
          <p className="text-gray-600 text-lg mb-4">
            You haven't analyzed any websites yet.
          </p>
          <Link
            to="/analyze"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Start a new analysis!
          </Link>
        </div>
      ) : (
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
              {reports.map((report) => (
                <tr key={report._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 hover:text-indigo-800 truncate max-w-xs sm:max-w-md">
                    <Link to={`/reports/${report._id}`}>{report.url}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(report.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.summary?.total_issues || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                    {report.summary?.critical || 0}
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MySavedReportsPage;
