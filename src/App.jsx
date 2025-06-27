// frontend/src/App.jsx

import React, { useState } from "react";
import WelcomePage from "./pages/WelcomePage.jsx";
import AnalyzePage from "./pages/AnalyzePage.jsx";
import Header from "./components/Header.jsx"; // Corrected path and casing
import Footer from "./components/Footer.jsx"; // Corrected path and casing

function App() {
  const [currentPage, setCurrentPage] = useState("welcome"); // 'welcome' or 'analyze'

  const handleStartAnalysis = () => {
    setCurrentPage("analyze");
  };

  return (
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
        @keyframes popIn { /* For the numbered circles popping into active state */
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in { animation: popIn 0.3s ease-out forwards; }


        /* How it Works Section - Arrow Animation */
        @keyframes arrowPath {
          0% { left: 0%; opacity: 0; transform: translateX(-100%); } /* Start completely left, hidden */
          10% { left: 0%; opacity: 1; transform: translateX(-50%); } /* Arrow appears and starts moving */
          30% { left: calc(33.33% - 1.5rem); opacity: 1; transform: translateX(0%); } /* At first step */
          35% { left: calc(33.33% - 1.5rem); opacity: 1; transform: translateX(0%); } /* Slight pause */
          60% { left: calc(66.66% - 1.5rem); opacity: 1; transform: translateX(0%); } /* At second step */
          65% { left: calc(66.66% - 1.5rem); opacity: 1; transform: translateX(0%); } /* Slight pause */
          90% { left: calc(100% - 1.5rem); opacity: 1; transform: translateX(0%); } /* At third step */
          95% { left: calc(100% - 1.5rem); opacity: 1; transform: translateX(0%); } /* Slight pause */
          100% { left: 100%; opacity: 0; transform: translateX(0%); } /* Arrow exits right, fades */
        }
        /* Adjusting arrow position for small screens if needed, but primarily MD+ */
        @media (max-width: 767px) { /* Adjust for mobile, arrow might not be needed or positioned differently */
          @keyframes arrowPath {
            0%, 100% { left: 0%; opacity: 0; transform: translateX(-100%); }
          }
        }

        .animate-arrow-path {
          animation: arrowPath 2.5s ease-in-out forwards; /* Total duration for arrow movement */
          animation-delay: 0.8s; /* Delay before arrow starts moving after section appears */
        }

        /* General utility animations */
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; animation-delay: 0.2s; }
        .animate-fade-in-up.delay-1 { animation-delay: 0.4s; }
        .animate-bounce-once { animation: bounceOnce 1s ease-in-out forwards; animation-delay: 0.5s; }
        .animate-spin-slow { animation: spinSlow 5s linear infinite; }
      `}</style>
      <Header /> {/* Render the Header component */}
      {/* Main Content Area - occupies remaining space */}
      <main className="flex-grow flex flex-col items-center p-4 sm:p-6 lg:p-8">
        {currentPage === "welcome" ? (
          <WelcomePage onStartAnalysis={handleStartAnalysis} />
        ) : (
          <AnalyzePage />
        )}
      </main>
      {/* Conditionally render the Footer based on the currentPage */}
      {currentPage === "welcome" && <Footer />}
    </div>
  );
}

export default App;
