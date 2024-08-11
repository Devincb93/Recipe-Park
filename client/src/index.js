import React from "react";
import App from "./App";
import "./index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MyProvider } from "./MyContext";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
<BrowserRouter>
    <MyProvider>
        <App />
    </MyProvider>    
</BrowserRouter>
);


