// src/components/LinkedIn.tsx
/**
 * LinkedIn redirect component.
 * Author: Tyler Mitton
 * Redirects users to LinkedIn profile when route is accessed.
 */

import { useEffect } from "react";

export default function LinkedInRedirect() {
  // Redirect to LinkedIn on component mount
  useEffect(() => {
    window.location.replace("https://www.linkedin.com/in/tyler-mitton");
  }, []);

  // Show loading message while redirect occurs
  return <p>Redirecting to LinkedIn...</p>;
}