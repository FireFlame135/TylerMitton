import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="text-center">
        <h1 className="text-4xl text-gray-900 dark:text-gray-100 font-bold mb-4">404 Error</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Oops! Page not found.</p>
        <a href="/TylerMitton/" className="text-blue-500 dark:text-blue-400 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
