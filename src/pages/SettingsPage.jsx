// frontend/src/pages/SettingsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SettingsPage = () => {
  const { user, loadingAuth } = useAuth();
  const navigate = useNavigate();

  const [emailNotifications, setEmailNotifications] = useState(false);
  const [theme, setTheme] = useState("System Default");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      if (loadingAuth || !user) {
        return;
      }

      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const idToken = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/settings`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate("/login", { replace: true });
            return;
          }
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch settings.");
        }

        const data = await response.json();
        setEmailNotifications(data.emailNotifications ?? false);
        setTheme(data.theme ?? "System Default");
      } catch (err) {
        console.error("Error fetching settings:", err);
        setError(err.message || "Could not load settings.");
      } finally {
        setLoading(false);
      }
    };

    if (!loadingAuth && user) {
      fetchSettings();
    }
  }, [user, loadingAuth, navigate]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    if (!user) {
      setError("You must be logged in to save settings.");
      navigate("/login", { replace: true });
      setSaving(false);
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          emailNotifications,
          theme,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to save settings.");
      }

      setSuccessMessage("Settings saved successfully!");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setError(err.message || "Failed to save settings.");
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setSaving(false);
    }
  };

  // Reused loading and access denied states from previous iteration
  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center p-6 bg-white rounded-lg shadow-xl">
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
          <p className="text-xl font-medium text-gray-700">
            Loading user authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg shadow-lg text-center max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-yellow-900">
            Access Denied
          </h2>
          <p className="mb-6">
            You need to be logged in to view your settings.
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center p-6 bg-white rounded-lg shadow-xl">
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
          <p className="text-xl font-medium text-gray-700">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    // This outer div now primarily provides padding and ensures it occupies vertical space
    // The actual page background (gray-100) should be set by the parent layout component.
    <div className="p-8 pb-16 min-h-[calc(100vh-80px)] md:p-10">
      {" "}
      {/* Adjusted height and padding */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Settings
        </h1>

        {/* Status Messages */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-6 animate-fade-in"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {successMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg relative mb-6 animate-fade-in"
            role="alert"
          >
            <strong className="font-bold">Success:</strong>
            <span className="block sm:inline ml-2">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSaveChanges} className="space-y-10">
          {/* Account Settings Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-indigo-200 pb-2">
              Account Settings
            </h2>
            <p className="text-gray-600 mb-6">
              Manage your account preferences and notifications.
            </p>
            <div className="flex items-center justify-between py-2">
              <label
                htmlFor="email-notifications"
                className="flex items-center cursor-pointer text-gray-700 text-lg font-medium"
              >
                Receive email updates
              </label>
              <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                <input
                  type="checkbox"
                  id="email-notifications"
                  className="absolute left-0 w-full h-full cursor-pointer opacity-0 peer"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  disabled={saving}
                />
                <span
                  className={`
                  absolute inset-0 rounded-full transition-colors duration-300
                  ${emailNotifications ? "bg-indigo-600" : "bg-gray-300"}
                  peer-focus:ring-2 peer-focus:ring-indigo-500 peer-focus:ring-offset-2
                `}
                ></span>
                <span
                  className={`
                  absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300
                  ${emailNotifications ? "translate-x-full" : "translate-x-0"}
                  peer-checked:border-indigo-600
                `}
                ></span>
              </div>
            </div>
          </div>

          {/* Display Preferences Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-indigo-200 pb-2">
              Display Preferences
            </h2>
            <p className="text-gray-600 mb-6">
              Customize the look and feel of the application's interface.
            </p>
            <div>
              <label
                htmlFor="theme-select"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Theme
              </label>
              <select
                id="theme-select"
                className="mt-1 block w-full pl-4 pr-12 py-3 text-base border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                           shadow-sm appearance-none bg-white
                           hover:border-gray-400 transition duration-150 ease-in-out"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                disabled={saving}
              >
                <option value="Light" className="text-gray-700">
                  Light
                </option>
                <option value="Dark" className="text-gray-700">
                  Dark
                </option>
                <option value="System Default" className="text-gray-700">
                  System Default
                </option>
              </select>
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className={`w-full sm:w-auto px-10 py-4 text-lg font-semibold rounded-full shadow-lg transition duration-300 ease-in-out transform
                ${
                  saving
                    ? "bg-indigo-400 text-white cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
                }
                flex items-center justify-center
              `}
              disabled={saving}
            >
              {saving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
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
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
