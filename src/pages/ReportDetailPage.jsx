import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useParams to get reportId from URL
import { useAuth } from "../context/AuthContext"; // To get the logged-in user's ID
import AnalysisResults from "../components/AnalysisResults"; // Import AnalysisResults component

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Your FastAPI backend API base URL

const ReportDetailPage = () => {
  const { reportId } = useParams(); // Get the reportId from the URL (e.g., from /reports/12345)
  const navigate = useNavigate(); // For programmatic navigation (e.g., back button)
  const { user, loadingAuth } = useAuth(); // Get user for authentication checks (Firebase UID)

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch report details from the FastAPI backend
  const fetchReportDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!reportId) {
      setError("Report ID is missing from the URL.");
      setLoading(false);
      return;
    }

    // Wait for authentication to load
    if (loadingAuth) {
      // If auth is still loading, just return. useEffect will re-trigger when loadingAuth changes.
      return;
    }

    // If no user after auth loads, it means not authenticated. Redirect to login.
    if (!user) {
      setError("You must be logged in to view this report.");
      setLoading(false);
      navigate("/login", { replace: true }); // Redirect to login page
      return;
    }

    let idToken;
    try {
      // Get the Firebase ID token for authentication
      idToken = await user.getIdToken();
      // console.log("ReportDetailPage: Firebase ID Token:", idToken); // Uncomment for debugging token
    } catch (tokenError) {
      console.error("ReportDetailPage: Failed to get ID token:", tokenError);
      setError("Failed to get authentication token. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      // Make the API call to your FastAPI backend with the Authorization header
      const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`, // CRUCIAL: Add the Authorization header
        },
      });

      if (!response.ok) {
        let errorDetail = `HTTP error! Status: ${response.status}`;
        try {
          const errorData = await response.json(); // Attempt to parse JSON error from backend
          errorDetail = errorData.detail || errorDetail;
        } catch (parseError) {
          // If the response is not JSON, use the status text
          errorDetail = `Error: ${response.status} ${response.statusText}`;
        }

        // Handle specific HTTP error codes
        if (response.status === 401) {
          setError(
            `Unauthorized: ${errorDetail}. Your session may have expired. Please log in again.`
          );
          navigate("/login", { replace: true }); // Redirect to login on 401
        } else if (response.status === 404) {
          setError(
            "Report not found or you do not have permission to view it."
          );
        } else {
          setError(`Failed to load report: ${errorDetail}`);
        }
        throw new Error(errorDetail); // Throw to be caught by the outer catch block
      }

      const data = await response.json();
      setReport(data);
    } catch (err) {
      console.error("Failed to fetch detailed report:", err);
      // If error was already set by a specific status code handler, don't overwrite it
      if (!error) {
        setError(`Failed to load report: ${err.message}.`);
      }
    } finally {
      setLoading(false);
    }
  }, [reportId, user, loadingAuth, navigate, error]); // Add error to dependencies for useCallback to be stable

  useEffect(() => {
    // Call the memoized fetch function when dependencies change
    fetchReportDetails();
  }, [fetchReportDetails]); // Depend on the memoized function

  // Loading state UI
  if (loading || loadingAuth) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
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
        <span className="text-lg text-gray-700">Loading report details...</span>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-red-50 border border-red-300 text-red-800 p-6 rounded-lg shadow-md">
        <p className="text-xl font-semibold mb-4">Error loading report:</p>
        <p className="text-center mb-4">{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-2 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  // No report found after loading (e.g., 404 from backend, or null if API returned empty)
  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-yellow-50 border border-yellow-300 text-yellow-800 p-6 rounded-lg shadow-md">
        <p className="text-xl font-semibold mb-4">Report not found.</p>
        <p className="mb-4">
          It seems the report you are looking for does not exist or has been
          removed.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-2 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  // Render the report details if everything is successful
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="mb-6 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Reports
      </button>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
        Accessibility Report for:{" "}
        <a
          href={report.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline"
        >
          {report.page_title || new URL(report.url).hostname}{" "}
          {/* Use page_title if available, else extract hostname */}
        </a>
      </h1>
      <p className="text-gray-600 mb-6">
        Analyzed on: {new Date(report.timestamp).toLocaleString()}
      </p>
      {/*
        Instead of duplicating the summary display here,
        we can leverage the AnalysisResults component for consistency
        and to ensure all its features (charts, filters, etc.) are available.
      */}
      <AnalysisResults result={report} />{" "}
      {/* Use the AnalysisResults component */}
    </div>
  );
};

export default ReportDetailPage;
