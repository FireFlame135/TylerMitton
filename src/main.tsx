console.log("🚀 main.tsx loaded BEFORE all code");


import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

console.log("🚀 main.tsx loaded AFTER ALL CODE");
