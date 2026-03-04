import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

// Disable right-click context menu globally
window.addEventListener("contextmenu", (e) => e.preventDefault());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/Web-OS-Portfolio">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
