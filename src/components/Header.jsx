// frontend/src/components/Header.jsx

import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = ({
  user,
  loadingAuth,
  onSignOut, // This prop is still here, but the button using it will be conditionally removed from the main header
  toggleSidebar,
  isSidebarOpen,
}) => {
  const location = useLocation();

  // Condition to show "Sign In with Google" button
  // It should show if not authenticated AND on the homepage or login page
  const showSignInButton =
    !user && (location.pathname === "/" || location.pathname === "/login");

  return (
    <header className="flex items-center justify-between p-4 sm:px-6 lg:px-8 bg-white shadow-md sticky top-0 z-30 h-16">
      <div className="flex items-center space-x-2">
        {user && (
          <button
            onClick={toggleSidebar}
            className="mr-4 text-gray-700 focus:outline-none p-2 rounded-md hover:bg-gray-100"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isSidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              )}
            </svg>
          </button>
        )}
        <Link
          to={user ? "/dashboard" : "/"}
          className="text-2xl font-bold text-gray-800 hover:text-indigo-600 transition-colors duration-200 flex items-center space-x-2"
        >
          <div className="bg-indigo-600 p-2 rounded-lg flex items-center justify-center">
            <span
              role="img"
              aria-label="Accessibility Icon"
              className="text-white text-lg inline-block transform -rotate-12"
            >
              ⚙️
            </span>
          </div>
          <span>Accessibility Analyzer</span>
        </Link>
      </div>

      {!user && (
        <nav className="hidden md:flex space-x-8">
          <Link
            to="#"
            className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
          >
            Features
          </Link>
          <Link
            to="#"
            className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
          >
            How It Works
          </Link>
          <Link
            to="#"
            className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
          >
            About
          </Link>
        </nav>
      )}

      {loadingAuth ? (
        <div className="text-gray-600 flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-600"
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
          Loading...
        </div>
      ) : user ? (
        // Authenticated User: Display user info but NO Sign Out button
        <div className="flex items-center space-x-4">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="User Avatar"
              className="w-8 h-8 rounded-full border-2 border-indigo-300 hidden sm:block"
            />
          )}
          <span className="hidden sm:inline text-gray-700 font-medium">
            Hello, {user.displayName || user.email}!
          </span>
          {/* Removed the Sign Out button from here as requested */}
        </div>
      ) : (
        // Unauthenticated User: Display Sign In with Google button if applicable
        showSignInButton && (
          <Link
            to="/login"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md font-semibold transition-colors"
          >
            Sign In with Google
          </Link>
        )
      )}
    </header>
  );
};

export default Header;
