// src/pages/NotFound.tsx
/**
 * 404 Not Found error page.
 * Author: Tyler Mitton
 * Displays when user navigates to a non-existent route.
 */

import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  // Get the attempted route
  const location = useLocation();

  // Log 404 error to console for debugging
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="text-center">
        {/* Error code */}
        <h1 className="text-4xl text-gray-900 dark:text-gray-100 font-bold mb-4">404 Error</h1>
        {/* Error message */}
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Oops! Page not found.</p>
        {/* Link back to home */}
        <a href="/" className="text-blue-500 dark:text-blue-400 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
