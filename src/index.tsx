import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tokens.css";
import "./styles/app.css";
import "./styles/scenes.css";

const ROOT_ID = "root";

loadInvokerCommands();

const root = document.getElementById(ROOT_ID);
if (!root) throw new Error(`Missing #${ROOT_ID}`);

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

function loadInvokerCommands(): void {
  if ("commandForElement" in HTMLButtonElement.prototype) return;
  void import("invokers-polyfill");
}
