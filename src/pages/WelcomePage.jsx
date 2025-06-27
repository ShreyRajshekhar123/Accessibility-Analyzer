// frontend/src/pages/WelcomePage.jsx

import React, { useState, useEffect, useRef } from "react";

const WelcomePage = ({ onStartAnalysis }) => {
  // Refs to attach to the sections we want to observe
  const howItWorksRef = useRef(null);
  const footerRef = useRef(null);

  // State to control the visibility/animation of each section
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showFooter, setShowFooter] = useState(false);

  // State to control active step highlighting
  const [activeStep, setActiveStep] = useState(0); // 0: none, 1: step1, 2: step2, 3: step3

  useEffect(() => {
    const observerOptions = {
      root: null, // viewport
      rootMargin: "0px",
      threshold: 0.2, // Trigger when 20% of the element is visible
    };

    const howItWorksObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShowHowItWorks(true);
          howItWorksObserver.unobserve(entry.target);

          // Set timeouts to activate steps in sync with arrow animation
          // These delays correspond to the arrowPath keyframes in App.jsx
          // Arrow starts after 0.8s, passes step 1 around 1.4s (0.8s + 0.6s from App.jsx keyframes for first third)
          // Passes step 2 around 2.1s (0.8s + 1.3s from App.jsx keyframes for second third)
          // Passes step 3 around 2.8s (0.8s + 2.0s from App.jsx keyframes for third third)
          setTimeout(() => setActiveStep(1), 1400); // Activate Step 1 after arrow passes it
          setTimeout(() => setActiveStep(2), 2100); // Activate Step 2 after arrow passes it
          setTimeout(() => setActiveStep(3), 2800); // Activate Step 3 after arrow passes it
        }
      });
    }, observerOptions);

    const footerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowFooter(true);
            footerObserver.unobserve(entry.target);
          }
        });
      },
      { ...observerOptions, threshold: 0.1 }
    );

    // Attach observers to the respective DOM elements
    if (howItWorksRef.current) {
      howItWorksObserver.observe(howItWorksRef.current);
    }
    if (footerRef.current) {
      footerObserver.observe(footerRef.current);
    }

    // Cleanup function: Disconnect observers when the component unmounts
    return () => {
      if (howItWorksRef.current) {
        howItWorksObserver.unobserve(howItWorksRef.current);
      }
      if (footerRef.current) {
        footerObserver.unobserve(footerRef.current);
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div className="max-w-4xl mx-auto w-full">
      {" "}
      {/* Container for main content, centered */}
      {/* Welcome Section - always visible, but could have its own initial animation */}
      <section className="text-center py-12">
        <header className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-700 mb-2">
            <span
              role="img"
              aria-label="Accessibility Icon"
              className="mr-3 text-5xl sm:text-6xl inline-block transform -rotate-12 animate-spin-slow"
            >
              ⚙️
            </span>
            Accessibility Analyzer
          </h1>
          <p className="text-lg text-gray-600">
            Your first step to a more inclusive web.
          </p>
        </header>

        <h2 className="text-5xl sm:text-6xl font-extrabold text-indigo-700 mb-4">
          Welcome!
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Empower your web presence by identifying and resolving accessibility
          barriers. Get instant insights and AI-powered suggestions to make your
          website inclusive for everyone.
        </p>

        <button
          onClick={onStartAnalysis}
          className="px-8 py-4 rounded-xl text-white font-bold text-xl shadow-lg
                     bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800
                     transform hover:scale-105 transition-all duration-300 ease-in-out
                     animate-bounce-once mt-12"
        >
          Start Analyzing Now!
        </button>
      </section>
      {/* How it Works Section - appears on scroll */}
      {/* Added min-h-[50vh] to ensure there's enough scroll space if content is short */}
      <section
        ref={howItWorksRef}
        className={`w-full py-12 px-4 transition-all duration-1000 ease-out ${
          showHowItWorks
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        } ${
          !showHowItWorks
            ? "min-h-[50vh] flex flex-col justify-center items-center"
            : ""
        }`}
      >
        <h3 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-12 text-center">
          How it Works
        </h3>

        <div className="relative flex flex-col md:flex-row justify-center items-stretch space-y-8 md:space-y-0 md:space-x-12">
          {/* Animated Arrow for larger screens */}
          {showHowItWorks && (
            <svg
              className="hidden md:block absolute top-[18%] h-8 w-8 text-indigo-500 z-20 animate-arrow-path"
              style={{ left: "0%" }} /* Initial position for animation */
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          )}

          {/* Dotted Line as background */}
          <div className="hidden md:block absolute top-[18%] left-0 right-0 h-0.5 bg-gray-300 transform -translate-y-1/2 z-0"></div>

          {/* Step 1 */}
          <div className="flex-1 flex flex-col items-center p-4 relative z-10 bg-transparent">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full border-2 font-bold text-2xl mb-4 shadow-md
                         ${
                           activeStep >= 1
                             ? "bg-indigo-500 border-indigo-700 text-white animate-pop-in"
                             : "bg-indigo-100 border-indigo-300 text-indigo-700"
                         }`}
            >
              1
            </div>
            <h4 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
              Start Analysis
            </h4>
            <p className="text-gray-600 max-w-xs sm:max-w-sm">
              Click the "Start Analyzing Now!" button and navigate to the
              analysis page.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex-1 flex flex-col items-center p-4 relative z-10 bg-transparent">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full border-2 font-bold text-2xl mb-4 shadow-md
                         ${
                           activeStep >= 2
                             ? "bg-indigo-500 border-indigo-700 text-white animate-pop-in"
                             : "bg-indigo-100 border-indigo-300 text-indigo-700"
                         }`}
            >
              2
            </div>
            <h4 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
              Enter URL & Analyze
            </h4>
            <p className="text-gray-600 max-w-xs sm:max-w-sm">
              Input the URL of any website you want to check and hit the
              "Analyze" button.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex-1 flex flex-col items-center p-4 relative z-10 bg-transparent">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full border-2 font-bold text-2xl mb-4 shadow-md
                         ${
                           activeStep >= 3
                             ? "bg-indigo-500 border-indigo-700 text-white animate-pop-in"
                             : "bg-indigo-100 border-indigo-300 text-indigo-700"
                         }`}
            >
              3
            </div>
            <h4 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
              Receive Report & Fixes
            </h4>
            <p className="text-gray-600 max-w-xs sm:max-w-sm">
              Get a comprehensive report of accessibility issues with AI-powered
              suggestions.
            </p>
          </div>
        </div>
      </section>
      {/* Spacer to ensure footer is scrollable into view, if necessary. */}
      <div className={`${!showFooter ? "min-h-[50vh]" : ""}`}></div>
      {/* Footer - appears on scroll */}
      <footer
        ref={footerRef}
        className={`w-full py-4 mt-8 text-sm text-gray-500 text-center transition-all duration-1000 ease-out ${
          showFooter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <p>
          &copy; {new Date().getFullYear()} Accessibility Analyzer. Built with{" "}
          <span role="img" aria-label="heart">
            ❤️
          </span>{" "}
          for an inclusive web.
        </p>
      </footer>
    </div>
  );
};

export default WelcomePage;
