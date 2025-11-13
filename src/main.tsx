// src/main.tsx
/**
 * Entry point for the React application.
 * Author: Tyler Mitton
 * Mounts the root App component to the DOM and loads global styles.
 */

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Mount the React app to the DOM
createRoot(document.getElementById("root")!).render(<App />);
