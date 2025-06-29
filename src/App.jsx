// src/App.jsx

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
  useNavigate, // <-- IMPORT THIS HOOK
} from "react-router-dom";

// Pages
import WelcomePage from "./pages/WelcomePage.jsx";
import AnalyzePage from "./pages/AnalyzePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import MySavedReportsPage from "./pages/MySavedReportsPage.jsx"; // <-- RENAMED IMPORT
import SettingsPage from "./pages/SettingsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ReportDetailPage from "./pages/ReportDetailPage.jsx";

// Components
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Footer from "./components/Footer.jsx";

// Import AuthProvider and useAuth hook
import { AuthProvider, useAuth } from "./context/AuthContext";

// Main App component
function AppContent() {
  const { user, loadingAuth, handleSignInWithGoogle, handleSignOut } =
    useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate(); // <-- INITIALIZE useNavigate HOOK

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Adjust sidebar open state based on user login
  // This useEffect ensures the sidebar toggles when user logs in/out
  useEffect(() => {
    if (!loadingAuth) {
      // Only adjust after authentication state is determined
      if (user) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    }
  }, [user, loadingAuth]); // Depend on 'user' and 'loadingAuth' from context

  // Define sidebar width for consistency on desktop
  const sidebarWidthInPx = 256; // Corresponding pixel value for Tailwind's w-64

  return (
    // The main app container. flex-col ensures header, main, footer stack vertically.
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 font-inter text-gray-800">
      <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
          /* General Welcome Section Animations */
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes bounceOnce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
          @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          /* How it Works Section - Numbered Circle Animations */
          @keyframes popIn {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-pop-in { animation: popIn 0.3s ease-out forwards; }

          /* How it Works Section - Arrow Animation */
          @keyframes arrowPath {
            0% { left: 0%; opacity: 0; transform: translateX(-100%); }
            10% { left: 0%; opacity: 1; transform: translateX(-50%); }
            30% { left: calc(33.33% - 1.5rem); opacity: 1; transform: translateX(0%); }
            35% { left: calc(33.33% - 1.5rem); opacity: 1; transform: translateX(0%); }
            60% { left: calc(66.66% - 1.5rem); opacity: 1; transform: translateX(0%); }
            65% { left: calc(66.66% - 1.5rem); opacity: 1; transform: translateX(0%); }
            90% { left: calc(100% - 1.5rem); opacity: 1; transform: translateX(0%); }
            95% { left: calc(100% - 1.5rem); opacity: 1; transform: translateX(0%); }
            100% { left: 100%; opacity: 0; transform: translateX(0%); }
          }
          @media (max-width: 767px) {
            @keyframes arrowPath {
              0%, 100% { left: 0%; opacity: 0; transform: translateX(-100%); }
            }
          }

          .animate-arrow-path {
            animation: arrowPath 2.5s ease-in-out forwards;
            animation-delay: 0.8s;
          }

          /* General utility animations */
          .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
          .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; animation-delay: 0.2s; }
          .animate-fade-in-up.delay-1 { animation-delay: 0.4s; }
          .animate-bounce-once { animation: bounceOnce 1s ease-in-out forwards; animation-delay: 0.5s; }
          .animate-spin-slow { animation: spinSlow 5s linear infinite; }

          /* Custom styling for main content area to account for fixed sidebar on desktop */
          .main-content-area {
              /* On mobile, main content is always full width as sidebar overlays */
              margin-left: 0;
              width: 100%;
              transition: margin-left 0.3s ease-in-out, width 0.3s ease-in-out;
          }

          @media (min-width: 768px) { /* md breakpoint and up */
              .main-content-area {
                  margin-left: ${
                    user && isSidebarOpen ? `${sidebarWidthInPx}px` : "0"
                  };
                  width: ${
                    user && isSidebarOpen
                      ? `calc(100% - ${sidebarWidthInPx}px)`
                      : "100%"
                  };
              }
          }

          /* Footer styling */
          .min-page-height {
              min-height: calc(100vh - 64px - 64px); /* Assuming header is ~64px and footer is ~64px */
              /* Adjust these values based on your actual header/footer heights */
          }
        `}</style>

      <Header
        user={user}
        loadingAuth={loadingAuth}
        onSignOut={handleSignOut}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      {user && ( // Only render sidebar if user is logged in
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          user={user}
        />
      )}

      <main
        className={`flex-grow overflow-y-auto ${
          user ? "main-content-area" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route
              path="/"
              element={
                <WelcomePage
                  // Use navigate directly for redirection from WelcomePage
                  onStartAnalysis={() =>
                    user ? navigate("/analyze") : navigate("/login")
                  }
                />
              }
            />
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <LoginPage
                    onSignIn={handleSignInWithGoogle}
                    loading={loadingAuth}
                  />
                )
              }
            />

            {/* Protected Routes: Render Outlet if user is logged in, otherwise redirect to login */}
            {/* The conditional rendering of the <Route element={...}> ensures a user must be logged in to access these paths. */}
            <Route
              element={user ? <Outlet /> : <Navigate to="/login" replace />}
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/analyze" element={<AnalyzePage />} />
              <Route path="/reports" element={<MySavedReportsPage />} />{" "}
              {/* Corrected component name */}
              <Route path="/reports/:reportId" element={<ReportDetailPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Fallback route for unmatched paths (404-like behavior) */}
            <Route
              path="*"
              element={
                user ? <Navigate to="/dashboard" /> : <Navigate to="/" />
              }
            />
          </Routes>
        </div>
      </main>

      <FooterConditionalRender />
    </div>
  );
}

function FooterConditionalRender() {
  const location = useLocation();
  // Only render Footer on the WelcomePage (root path)
  return location.pathname === "/" ? <Footer /> : null;
}

// The root App component which provides the AuthContext
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
