// frontend/src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase.js"; // Make sure this path is correct
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap your application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []);

  // Sign in with Google function
  const handleSignInWithGoogle = async () => {
    setLoadingAuth(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // user state will be updated by onAuthStateChanged listener
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      // You might want to set an error state here
    } finally {
      setLoadingAuth(false);
    }
  };

  // Sign out function
  const handleSignOut = async () => {
    setLoadingAuth(true);
    try {
      await signOut(auth);
      // user state will be updated by onAuthStateChanged listener
    } catch (error) {
      console.error("Error signing out:", error.message);
      // You might want to set an error state here
    } finally {
      setLoadingAuth(false);
    }
  };

  // Value to be provided by the context
  const value = {
    user,
    loadingAuth,
    handleSignInWithGoogle,
    handleSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Only render children when authentication state is determined */}
      {!loadingAuth && children}
      {loadingAuth && (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 font-inter text-gray-600 text-lg">
          <svg
            className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-600"
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
          Loading application...
        </div>
      )}
    </AuthContext.Provider>
  );
};
