// frontend/src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase.js";

// Import the CSS module
import styles from "./Sidebar.module.css"; // Correct import for CSS Modules

// Import Heroicons for a more professional look
import {
  HomeIcon, // For Dashboard
  DocumentMagnifyingGlassIcon, // For Analyze New Report
  FolderIcon, // For My Saved Reports
  Cog6ToothIcon, // For Settings
  UserCircleIcon, // For Profile
  ArrowRightOnRectangleIcon, // For Sign Out button
  XMarkIcon, // For Close Sidebar button on mobile
} from "@heroicons/react/24/outline"; // Using outline icons for a lighter look

const Sidebar = ({ isOpen, toggleSidebar, user }) => {
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // console.log("User signed out from sidebar.");
      // Close sidebar after sign out if it's open, as the layout might change
      toggleSidebar();
    } catch (error) {
      console.error("Error signing out from sidebar:", error.message);
    }
  };

  // Define navigation items with their paths and corresponding Heroicon components
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
    {
      name: "Analyze New Report",
      path: "/analyze",
      icon: DocumentMagnifyingGlassIcon,
    },
    { name: "My Saved Reports", path: "/reports", icon: FolderIcon },
    { name: "Settings", path: "/settings", icon: Cog6ToothIcon },
    { name: "Profile", path: "/profile", icon: UserCircleIcon },
  ];

  // Function to determine if a navigation item should be active
  const isActive = (path) => {
    if (path === "/reports") {
      return (
        location.pathname === "/reports" ||
        location.pathname.startsWith("/reports/")
      );
    }
    return location.pathname === path;
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
          aria-label="Close sidebar overlay"
        ></div>
      )}

      <aside
        className={`
          bg-indigo-800 text-white p-6 z-50 transition-transform duration-300 ease-in-out flex flex-col
          fixed top-0 left-0 h-full w-full
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:top-16 md:left-0 md:h-[calc(100vh-4rem)] md:w-64
          ${isOpen ? "md:translate-x-0" : "md:-translate-x-full"}
        `}
      >
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold text-white">Analyzer Menu</h2>
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none p-2 rounded-md hover:bg-indigo-700 md:hidden"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Apply the custom scrollbar class here using CSS Modules */}
        <nav
          className={`space-y-3 flex-grow overflow-y-auto ${styles.sidebarNav}`}
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center p-3 rounded-lg text-lg font-medium transition-colors duration-200
                ${
                  isActive(item.path)
                    ? "bg-indigo-700 text-white shadow-lg"
                    : "text-indigo-200 hover:bg-indigo-700 hover:text-white"
                }`}
              onClick={toggleSidebar}
            >
              <item.icon className="w-6 h-6 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>

        {user && (
          <div className="mt-auto pt-6 border-t border-indigo-700">
            <div className="flex items-center mb-4">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full mr-3 border-2 border-indigo-300"
                />
              )}
              <div className="flex-1">
                <p className="text-lg font-semibold truncate">
                  {user.displayName || user.email}
                </p>
                <p className="text-sm text-indigo-200">Signed In</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
