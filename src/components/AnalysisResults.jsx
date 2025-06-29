import React, { useState } from "react"; // Added useState for filter functionality
import StatCard from "./StatCard.jsx";
import IssueCard from "./IssueCard.jsx";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"; // Import Recharts components

const AnalysisResults = ({ result }) => {
  const [filterSeverity, setFilterSeverity] = useState("All"); // State for filtering issues
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false); // State to control dropdown visibility
  const [activeIndex, setActiveIndex] = useState(-1); // State for pie chart hover effect

  if (!result || !result.summary) {
    return null; // Don't render anything if no results or summary are provided
  }

  // Data for Bar Chart: Severity Distribution
  const severityData = [
    {
      name: "Critical",
      value: result.summary.criticalIssues,
      color: "#ef4444",
    }, // Updated to criticalIssues
    {
      name: "Moderate",
      value: result.summary.moderateIssues,
      color: "#f97316",
    }, // Updated to moderateIssues
    { name: "Minor", value: result.summary.minorIssues, color: "#eab308" }, // Updated to minorIssues
  ];

  // Data for Pie Chart: Overall Issue Distribution
  // Add an initial 'index' property for hover tracking
  const pieData = severityData
    .filter((item) => item.value > 0)
    .map((item, index) => ({
      ...item,
      index: index,
    })); // Only show categories with issues

  // Filtered issues based on the selected severity
  const filteredIssues = result.issues.filter(
    (issue) =>
      filterSeverity === "All" ||
      issue.severity.toLowerCase() === filterSeverity.toLowerCase()
  );

  // console.log("Accessibility Score:", result.summary.score);
  // Function to handle filter selection
  const handleFilterChange = (severity) => {
    setFilterSeverity(severity);
    setIsFilterDropdownOpen(false); // Close dropdown after selection
  };

  // Custom Tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload; // Access the data from the first payload item
      return (
        <div className="bg-gray-800 text-white p-3 rounded-lg shadow-xl text-sm border border-gray-600">
          <p className="font-bold mb-1">{data.name} Issues</p>
          <p>
            Count: <span className="font-semibold">{data.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const COLORS = ["#ef4444", "#f97316", "#eab308"]; // Consistent colors for charts

  // Custom label for Pie Chart, only showing percentage on hover
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    if (index === activeIndex) {
      // Only show label for the hovered slice
      const RADIAN = Math.PI / 180;
      // Adjust radius for label position slightly further out for clarity
      const labelRadius = outerRadius * 1.1;
      const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
      const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);

      return (
        <text
          x={x}
          y={y}
          fill="black" // Changed text color for better visibility against white background of chart area
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          className="font-semibold text-sm" // Smaller font size for percentage label
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    }
    return null;
  };

  // Function to handle mouse enter on pie slice
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  // Function to handle mouse leave from pie chart
  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  return (
    <div className="w-full max-w-4xl bg-white p-6 sm:p-8 rounded-xl shadow-2xl mt-8 animate-fade-in-up delay-1">
      <h3 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-200 pb-3">
        <span role="img" aria-label="Report icon" className="mr-2">
          📄
        </span>
        Analysis Report for "
        <span className="text-indigo-600">{result.url || "N/A"}</span>"{" "}
        {/* Changed to result.url */}
      </h3>

      {/* Summary Statistics - Enhanced Layout with Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Issues"
          value={result.summary.total_issues}
          color="bg-indigo-100 text-indigo-800"
        />
        <StatCard
          title="Critical Issues"
          value={result.summary.criticalIssues} // Updated property
          color="bg-red-100 text-red-800"
        />
        <StatCard
          title="Moderate Issues"
          value={result.summary.moderateIssues} // Updated property
          color="bg-orange-100 text-orange-800"
        />
        <StatCard
          title="Minor Issues"
          value={result.summary.minorIssues} // Updated property
          color="bg-yellow-100 text-yellow-800"
        />
      </div>

      {/* Score Card - Moved and styled to be more prominent */}
      <div className="bg-indigo-500 text-white p-6 rounded-xl shadow-xl mb-8 flex flex-col items-center justify-center transform transition-all duration-300 hover:scale-105">
        <h4 className="text-2xl font-semibold mb-2">Accessibility Score</h4>
        <p className="text-5xl font-extrabold">
          {result.summary.score || "N/A"}%
        </p>
        <p className="text-indigo-100 mt-2 text-sm">
          A higher score means better accessibility!
        </p>
      </div>

      {/* Charts Section */}
      {result.summary.total_issues > 0 && ( // Only show charts if there are issues
        <div className="mt-8 pt-6 border-t-2 border-indigo-200">
          <h4 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            <span role="img" aria-label="Chart icon" className="mr-2">
              📊
            </span>
            Issue Distribution
          </h4>
          <div className="flex flex-col lg:flex-row items-center justify-around gap-8">
            {/* Bar Chart: Issues by Severity */}
            <div className="w-full lg:w-1/2 h-80 bg-gray-50 rounded-lg p-4 shadow-md">
              <h5 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                Issues by Severity
              </h5>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart
                  data={severityData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(0,0,0,0.1)" }}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Number of Issues">
                    {severityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart: Percentage Distribution with Hover Effect */}
            {pieData.length > 0 && (
              <div className="w-full lg:w-1/2 h-80 bg-gray-50 rounded-lg p-4 shadow-md">
                <h5 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                  Severity Percentage
                </h5>
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart onMouseLeave={onPieLeave}>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80} // Base outer radius
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={renderCustomizedLabel} // Use custom label renderer
                      onMouseEnter={onPieEnter} // Handle mouse enter for hover effect
                      animationDuration={300} // Smooth animation for size changes
                      paddingAngle={5} // Space between slices
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          // Enlarge the slice on hover - increased difference for visibility
                          outerRadius={index === activeIndex ? 100 : 80} // Increased hover size to 100
                          style={{ transition: "all 0.3s ease-out" }} // Apply transition for smooth animation
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Issues Section with Filter Icon Dropdown */}
      <div className="w-full mt-8 pt-6 border-t-2 border-indigo-200">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-2xl font-bold text-gray-800 pb-2">
            <span role="img" aria-label="List icon" className="mr-2">
              📝
            </span>
            Detailed Issues
          </h4>
          <div className="relative">
            {/* Filter Icon Button */}
            <button
              className="flex items-center justify-center p-2 rounded-lg bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              aria-label="Filter Issues"
              aria-haspopup="true"
              aria-expanded={isFilterDropdownOpen}
            >
              <svg
                className="h-5 w-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V19a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isFilterDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-30 ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="filter-menu-button"
              >
                <div className="py-1" role="none">
                  <button
                    onClick={() => handleFilterChange("All")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                  >
                    All Severities
                  </button>
                  <button
                    onClick={() => handleFilterChange("Critical")}
                    className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900"
                    role="menuitem"
                  >
                    Critical
                  </button>
                  <button
                    onClick={() => handleFilterChange("Moderate")}
                    className="block w-full text-left px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 hover:text-orange-900"
                    role="menuitem"
                  >
                    Moderate
                  </button>
                  <button
                    onClick={() => handleFilterChange("Minor")}
                    className="block w-full text-left px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50 hover:text-yellow-900"
                    role="menuitem"
                  >
                    Minor
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {filteredIssues.length > 0 ? (
          <div className="space-y-4">
            {filteredIssues.map((issue, index) => (
              <IssueCard key={index} issue={issue} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-lg text-center py-4 rounded-lg bg-green-50 text-green-700 border border-green-200">
            <span role="img" aria-label="Party popper" className="mr-2">
              🎉
            </span>
            No accessibility issues found for the selected filter. Great job!
          </p>
        )}
      </div>

      {/* AI-Powered Suggestions (Overall) - if your backend provides a global one */}
      {result.ai_suggestions && result.ai_suggestions.detailed_fix && (
        <div className="mt-8 pt-6 border-t-2 border-indigo-200">
          <h4 className="text-2xl font-bold text-gray-800 mb-4">
            <span role="img" aria-label="Lightbulb icon" className="mr-2">
              💡
            </span>
            Overall AI Insights
          </h4>
          <div className="prose prose-indigo max-w-none text-gray-700 leading-relaxed bg-indigo-50 p-4 rounded-lg border border-indigo-100 shadow-inner">
            <p>{result.ai_suggestions.detailed_fix}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
