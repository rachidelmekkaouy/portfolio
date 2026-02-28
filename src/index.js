// src/index.js  ← CRA entry point (rename to index.js NOT main.jsx)
// ─────────────────────────────────────────────────────────────────
// React mounts into #root defined in public/index.html
// ─────────────────────────────────────────────────────────────────

import React from "react";
import ReactDOM from "react-dom/client";

// Bootstrap CSS — must come before our custom CSS
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);