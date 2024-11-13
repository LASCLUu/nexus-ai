import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { AppProvider } from "./contexts/AppContext";

const AppRoutes = React.lazy(() => import("./routes"));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AppProvider userId={1}>
      <AppRoutes />
    </AppProvider>
  </BrowserRouter>
);
