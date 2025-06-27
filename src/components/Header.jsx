// frontend/src/components/Header.jsx

import React from "react";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 sm:px-6 lg:px-8 bg-white shadow-md z-50">
      <div className="flex items-center space-x-2">
        {/* Accessibility Analyzer Icon and Name */}
        <div className="bg-indigo-600 p-2 rounded-lg flex items-center justify-center">
          <span
            role="img"
            aria-label="Accessibility Icon"
            className="text-white text-lg inline-block transform -rotate-12 animate-spin-slow"
          >
            ⚙️
          </span>
        </div>
        <span className="text-xl font-bold text-gray-800">
          Accessibility Analyzer
        </span>
      </div>
      <nav className="hidden md:flex space-x-8">
        <a
          href="#"
          className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
        >
          Features
        </a>
        <a
          href="#"
          className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
        >
          How It Works
        </a>
        <a
          href="#"
          className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
        >
          About
        </a>
      </nav>
      <button className="px-5 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition-colors">
        Sign In with Google
      </button>
    </header>
  );
};

export default Header;
