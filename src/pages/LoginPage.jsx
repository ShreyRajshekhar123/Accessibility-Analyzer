// frontend/src/pages/LoginPage.jsx

import React, { useState } from "react";

const LoginPage = ({ onSignIn, loading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Note: For a real application, you would implement email/password
  // authentication here using Firebase's signInWithEmailAndPassword,
  // and handle form submission. For this scope, the primary focus
  // is on Google Sign-In and the visual design.
  const handleEmailLogin = (e) => {
    e.preventDefault();
    // console.log("Attempting email login with:", { email, password });
    // This is where you'd call Firebase email/password auth:
    // auth.signInWithEmailAndPassword(email, password)
    // .then(...)
    // .catch(...)
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-purple-50 to-indigo-100 font-inter text-gray-800">
      <style>{`
        /* Minimal animations for the login page */
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.5s ease-out forwards;
        }
      `}</style>
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-10 md:p-12 animate-fadeInScale max-w-md w-full border border-gray-200">
        {/* Removed Application Logo/Icon & Title section */}

        <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 mb-8 text-center">
          Login to your Account
        </h2>

        <form onSubmit={handleEmailLogin} className="space-y-5 mb-6">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 rounded-lg text-white font-semibold text-lg shadow-md transition-colors duration-200 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            disabled={loading} // You might want a separate loading state for email login
          >
            Login with Email
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>{" "}
          {/* Adjusted border color */}
          <span className="flex-shrink mx-4 text-gray-500">or</span>{" "}
          {/* Adjusted text color */}
          <div className="flex-grow border-t border-gray-300"></div>{" "}
          {/* Adjusted border color */}
        </div>

        <button
          onClick={onSignIn}
          disabled={loading}
          className={`w-full px-4 py-3 rounded-lg text-white font-semibold text-lg shadow-md transition-all duration-300 ease-in-out flex items-center justify-center gap-2
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed" // Changed from red to gray for loading
                : "bg-gray-800 hover:bg-gray-700 active:bg-gray-900 transform hover:scale-105" // Changed from red to black/gray for Google Sign-in
            }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              Signing In...
            </>
          ) : (
            <>
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                className="w-5 h-5"
              />
              Sign in with Google
            </>
          )}
        </button>

        <p className="text-center text-gray-600 text-sm mt-6">
          {" "}
          {/* Adjusted text color */}
          Don't have an account?{" "}
          <a href="#" className="text-indigo-600 hover:underline">
            {" "}
            {/* Adjusted link color */}
            Create one here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
