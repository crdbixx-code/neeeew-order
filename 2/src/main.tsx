import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n/config";
import "./index.css";

// Fix 3: Suspense fallback prevents React from throwing on lazy-loaded chunks
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={
      <div style={{ display:"flex", height:"100vh", alignItems:"center", justifyContent:"center", background:"#0d1117", color:"#fff", fontSize:"1rem" }}>
        Loading…
      </div>
    }>
      <App />
    </Suspense>
  </React.StrictMode>
);
