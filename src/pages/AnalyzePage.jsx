// frontend/src/pages/AnalyzePage.jsx

import React, { useState } from "react";
import AnalysisResults from "../components/AnalysisResults.jsx"; // Import the AnalysisResults component

const AnalyzePage = () => {
  const [url, setUrl] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    setError(null);
    setAnalysisResult(null); // Clear previous results

    try {
      // Basic URL validation
      if (!url.trim()) {
        throw new Error("URL cannot be empty. Please enter a valid URL.");
      }

      // Prepend 'http://' if no protocol is specified
      const formattedUrl = url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `http://${url}`;

      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:5173", // Ensure this matches your frontend origin
        },
        body: JSON.stringify({ url: formattedUrl }),
      });

      if (!response.ok) {
        let errorMessage = "An unexpected error occurred during analysis.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (parseError) {
          // If response is not JSON, use status text
          errorMessage = `Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error("Error during analysis:", err);
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center p-4 sm:p-6 lg:p-8"> {/* Added padding for overall page and centering */}
      <header className="text-center mb-8">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-indigo-700 mb-2 animate-fade-in-down">
          Analyze Your Website
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-up delay-1">
          Enter a URL below to get a comprehensive accessibility report with AI-powered insights.
        </p>
      </header>

      {/* Input Form Section - Enhanced Styling */}
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
              type="url" // Changed to type="url" for better mobile keyboard and basic validation
              id="url-input"
              className="flex-grow p-3 border-2 border-indigo-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base placeholder-gray-400 outline-none transition-all duration-200"
              placeholder="e.g., https://www.example.com or local.dev"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={loading} // Disable input when loading
            />
            <button
              type="submit"
              className={`px-6 py-3 rounded-lg text-white font-semibold text-lg shadow-md transition-all duration-300 ease-in-out flex items-center justify-center
                ${loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transform hover:scale-105"
                }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                "Analyze"
              )}
            </button>
          </div>
        </form>

        {/* Error Message Display - Enhanced Styling */}
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

      {/* Analysis Results Section - Conditionally rendered by AnalysisResults component */}
      {analysisResult && <AnalysisResults result={analysisResult} />}
    </div>
  );
};

export default AnalyzePage;
