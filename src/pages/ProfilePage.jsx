// frontend/src/pages/ProfilePage.jsx
import React from "react";
import { useAuth } from "../context/AuthContext"; // Assuming you have an AuthContext

const ProfilePage = () => {
  const { user, loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
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
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
        <p>Please log in to view your profile.</p>
        {/* You might want a "Go to Login" button here */}
      </div>
    );
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Your Profile
      </h1>

      <div className="flex flex-col items-center mb-8">
        <img
          src={
            user.photoURL ||
            `https://ui-avatars.com/api/?name=${
              user.displayName || user.email
            }&background=random&color=fff&size=128`
          }
          alt="User Avatar"
          className="w-32 h-32 rounded-full object-cover border-4 border-indigo-300 shadow-lg"
        />
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          {user.displayName || "No Name Provided"}
        </h2>
        <p className="text-gray-600 text-lg">{user.email}</p>
        {user.uid && (
          <p className="text-sm text-gray-500 mt-1">User ID: {user.uid}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            Account Information
          </h3>
          <p className="text-gray-600">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-gray-600">
            <strong>Account Created:</strong>{" "}
            {user.metadata?.creationTime
              ? new Date(user.metadata.creationTime).toLocaleDateString()
              : "N/A"}
          </p>
          <p className="text-gray-600">
            <strong>Last Sign In:</strong>{" "}
            {user.metadata?.lastSignInTime
              ? new Date(user.metadata.lastSignInTime).toLocaleString()
              : "N/A"}
          </p>
        </div>

        {/* You can add more profile details here, e.g., an "Edit Profile" button */}
        <div className="text-center mt-6">
          <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
