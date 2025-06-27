// frontend/src/pages/AnalyzePage.jsx

import React, { useState } from "react";
import AnalysisResults from "../components/AnalysisResults"; // Import the AnalysisResults component

const AnalyzePage = () => {
  const [url, setUrl] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Analysis failed.");
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
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
      <header className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 mb-2">
          Analyze Your Website
        </h2>
        <p className="text-md sm:text-lg text-gray-600">
          Enter a URL below to get a comprehensive accessibility report.
        </p>
      </header>

      <form onSubmit={handleAnalyze} className="mb-8 space-y-4">
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
            className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base"
            placeholder="e.g., https://www.example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`px-6 py-3 rounded-lg text-white font-semibold text-lg shadow-md transition-all duration-300 ease-in-out
              ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transform hover:scale-105"
              }`}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </form>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {analysisResult && <AnalysisResults result={analysisResult} />}
    </div>
  );
};

export default AnalyzePage;
