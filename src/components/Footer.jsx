// frontend/src/components/Footer.jsx

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-start space-y-8 md:space-y-0 md:space-x-12">
        {/* Left Section: Logo, Description, Social Icons */}
        <div className="flex flex-col space-y-4 md:w-1/3 lg:w-1/4">
          <div className="flex items-center space-x-2">
            {/* Accessibility Analyzer Logo/Icon */}
            <div className="bg-indigo-600 p-2 rounded-lg flex items-center justify-center">
              <span
                role="img"
                aria-label="Accessibility Icon"
                className="text-white text-lg inline-block transform -rotate-12"
              >
                ⚙️
              </span>
            </div>
            <span className="text-2xl font-bold">Accessibility Analyzer</span>
          </div>
          <p className="text-gray-400 max-w-sm">
            Empowering developers and content creators to build inclusive web
            experiences for everyone. Scan, analyze, and improve your website's
            accessibility with AI-powered insights.
          </p>
          <div className="flex space-x-4 mt-4">
            {/* Social Icons for Accessibility Analyzer - Using Lucide React Icons for consistency */}
            <a
              href="#"
              className="text-gray-400 hover:text-white transform hover:scale-110 transition-transform duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-twitter"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17-17 11.6 2.2.3 4.4-.6 6-2 2.7-2.1 4.7-5 5.5-8.1"></path>
                <path d="M11 19l-3 3-5-5"></path>
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transform hover:scale-110 transition-transform duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-facebook"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transform hover:scale-110 transition-transform duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-instagram"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transform hover:scale-110 transition-transform duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-github"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.44-.78-3.46 0 0-1.09 0-3 1.3a9 9 0 0 0-6 0c-1.91-1.3-3-1.3-3-1.3-.5 1.02-.9 2.2-.78 3.46 0 3.5 3 5.5 6 5.5A4.8 4.8 0 0 0 9 18v4"></path>
                <path d="M12 2C6.5 2 2 6.5 2 12a10 10 0 0 0 8 9.8c.5.1.7-.2.7-.5v-2.1c-3.5.7-4.2-1.6-4.2-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-1.6.1-1.6 1.1-.9 1.8.1 2.1.6 1.1 1.8 2.8 1.3 3.5.9.1-.7.4-1.6.9-2.3-2.6-.3-5.3-1.3-5.3-5.5-.1-1.1.4-2.2 1.1-3-.1-.2-.5-1.5.1-3 0 0 1.9-.6 6 1.5 1.8-.5 3.6-.5 5.3 0 4.1-2.1 6-1.5 6-1.5.6 1.5.2 2.8.1 3 1.1.8 1.6 1.9 1.5 3 0 4.2-2.7 5.2-5.3 5.5.4.4.8 1 .8 2.2v3.3c0 .3.3.6.7.5C20 21.8 22 17.3 22 12 22 6.5 17.5 2 12 2z"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Right Section: PRODUCT, SUPPORT, and Call to Action */}
        <div className="flex flex-col md:flex-row md:space-x-12 md:flex-wrap md:w-2/3 lg:w-3/4 justify-around items-start">
          <div className="flex flex-row gap-x-16 gap-y-4 text-sm mb-8 md:mb-0 w-full md:w-auto justify-around md:justify-start">
            {/* PRODUCT Column */}
            <div className="flex flex-col">
              <h4 className="font-semibold text-gray-200 mb-3">PRODUCT</h4>
              <ul>
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Analyze Demo
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            {/* SUPPORT Column */}
            <div className="flex flex-col">
              <h4 className="font-semibold text-gray-200 mb-3">SUPPORT</h4>
              <ul>
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* New Eye-catching Call to Action section */}
          <div className="flex flex-col bg-indigo-700 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 w-full md:max-w-xs md:ml-auto items-center text-center">
            <h4 className="font-extrabold text-white text-xl mb-4">
              READY TO ANALYZE?
            </h4>
            <p className="text-indigo-100 text-sm mb-4">
              Get an instant accessibility report for your website with
              AI-powered suggestions.
            </p>
            <button className="bg-white text-indigo-800 px-6 py-3 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors text-base font-semibold shadow-md">
              Start Your Free Scan!
            </button>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs mt-8 pt-4 border-t border-gray-700">
        &copy; {new Date().getFullYear()} Accessibility Analyzer. All Rights
        Reserved.
      </div>
    </footer>
  );
};

export default Footer;
