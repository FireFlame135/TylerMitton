import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("🚀 main.tsx loaded BEFORE all code");
console.log("React:", React);

createRoot(document.getElementById("root")!).render(<App />);
console.log("🚀 main.tsx loaded AFTER ALL CODE");
