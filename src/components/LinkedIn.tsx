import { useEffect } from "react";

export default function LinkedInRedirect() {
  useEffect(() => {
    window.location.replace("https://www.linkedin.com/in/tyler-mitton");
  }, []);

  return <p>Redirecting to LinkedIn...</p>;
}