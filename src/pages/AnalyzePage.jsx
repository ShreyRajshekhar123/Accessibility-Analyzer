// frontend/src/pages/AnalyzePage.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnalysisResults from "../components/AnalysisResults.jsx"; // Ensure this component exists
import { useAuth } from "../context/AuthContext";

// Define your backend API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AnalyzePage = () => {
  const [url, setUrl] = useState("");
  // This state is CRUCIAL now for displaying results on the same page.
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, loadingAuth } = useAuth();
  const navigate = useNavigate();

  // Optional: Clear results and errors when the URL input changes
  useEffect(() => {
    setAnalysisResult(null);
    setError(null);
  }, [url]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysisResult(null); // Clear previous results before starting new analysis

    if (!url.trim()) {
      setError("URL cannot be empty. Please enter a valid URL.");
      setLoading(false);
      return;
    }

    // --- Authentication and Token Logic ---
    if (loadingAuth) {
      setError("Authentication is still loading. Please wait.");
      setLoading(false);
      return;
    }
    if (!user) {
      setError("You must be logged in to analyze a website.");
      // Redirect to login if not authenticated
      navigate("/login", { replace: true });
      setLoading(false);
      return;
    }

    let idToken;
    try {
      idToken = await user.getIdToken();
      // console.log("AnalyzePage: Firebase ID Token acquired.");
    } catch (tokenError) {
      console.error("AnalyzePage: Failed to get ID token:", tokenError);
      setError(
        "Failed to get authentication token. Please try logging in again."
      );
      setLoading(false);
      return;
    }
    // --- End Authentication and Token Logic ---

    try {
      const formattedUrl =
        url.startsWith("http://") || url.startsWith("https://")
          ? url
          : `http://${url}`; // Ensure URL has http/https prefix

      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ url: formattedUrl }),
      });

      if (!response.ok) {
        let errorMessage = "An unexpected error occurred during analysis.";
        try {
          const errorData = await response.json();
          if (response.status === 401) {
            errorMessage =
              errorData.detail || "Unauthorized. Please log in again.";
            navigate("/login", { replace: true });
            return; // Important: Return after navigation
          }
          if (errorData.detail && Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail
              .map((err) => `${err.loc.join(".")} -> ${err.msg}`)
              .join("; ");
          } else {
            errorMessage =
              errorData.detail || errorData.message || errorMessage;
          }
        } catch (parseError) {
          errorMessage = `Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage); // Throw to be caught by the outer catch
      }

      const data = await response.json();
      // console.log("Full response data from backend:", data);

      // --- CRUCIAL CHANGE HERE ---
      // Instead of navigating, set the analysis result state
      // AnalysisResults.jsx will render automatically when analysisResult is not null
      setAnalysisResult(data);

      // REMOVED: This navigation is no longer needed for immediate analysis results
      // if (data._id) {
      //   console.log("Type of data._id:", typeof data._id);
      //   console.log("Value of data._id:", data._id);
      //   navigate(`/reports/${data._id}`); // Navigate using _id
      // } else {
      //   setError(
      //     "Analysis successful, but no report ID ('_id') was returned from the backend. (Frontend expected '_id' in response)"
      //   );
      // }
      // --- END CRUCIAL CHANGE ---
    } catch (err) {
      console.error("Error during analysis:", err);
      // This catches network errors (like the CORS 'Failed to fetch' TypeError)
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError(
          "Network connection error or CORS issue. Please ensure the backend is running and accessible from this origin."
        );
      } else {
        setError(
          err.message || "An unexpected error occurred during analysis."
        );
      }
      setAnalysisResult(null); // Clear any partial results on error
    } finally {
      setLoading(false);
    }
  };

  if (loadingAuth) {
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
        <p className="text-xl text-gray-700">Loading authentication...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p>You need to be logged in to analyze a website.</p>
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
    <div className="w-full flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-indigo-700 mb-2 animate-fade-in-down">
          Analyze Your Website
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-up delay-1">
          Enter a URL below to get a comprehensive accessibility report with
          AI-powered insights.
        </p>
      </header>

      <div className="w-full max-w-xl bg-white p-6 sm:p-8 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-[1.01] animate-fade-in-up">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <label
            htmlFor="url-input"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Enter Website URL:
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="url"
              id="url-input"
              className="flex-grow p-3 border-2 border-indigo-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base placeholder-gray-400 outline-none transition-all duration-200"
              placeholder="e.g., https://www.example.com or local.dev"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={loading} // Disable input while loading
            />
            <button
              type="submit"
              className={`px-6 py-3 rounded-lg text-white font-semibold text-lg shadow-md transition-all duration-300 ease-in-out flex items-center justify-center
                ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transform hover:scale-105"
                }`}
              disabled={loading} // Disable button while loading
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Analyzing...
                </>
              ) : (
                "Analyze"
              )}
            </button>
          </div>
        </form>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mt-6 animate-fade-in-up"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}
      </div>

      {/* This section now actively renders AnalysisResults.jsx when analysisResult has data */}
      {analysisResult && (
        <div className="w-full max-w-4xl mt-12">
          {" "}
          {/* You might want to adjust styling */}
          <AnalysisResults result={analysisResult} />
        </div>
      )}

      {/* No full-page overlay anymore. The loading is indicated by the button state. */}
    </div>
  );
};

export default AnalyzePage;
