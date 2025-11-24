import { Buffer } from "buffer";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Polyfill Buffer and process for otplib (required for browser environment)
// Note: crypto and process are polyfilled via Vite aliases
try {
  if (typeof window !== "undefined") {
    (window as any).Buffer = Buffer;
    (globalThis as any).Buffer = Buffer;

    // Create process object with all required properties for readable-stream
    // The process polyfill is loaded via Vite alias, but we ensure it has version
    if (!(window as any).process) {
      (window as any).process = {
        env: {},
        version: "v18.0.0",
        versions: { node: "18.0.0" },
        nextTick: (fn: Function) => setTimeout(fn, 0),
        browser: true,
      };
    } else {
      // Ensure version exists and is a string
      const proc = (window as any).process;
      if (!proc.version || typeof proc.version !== "string") {
        proc.version = "v18.0.0";
      }
      if (!proc.versions) {
        proc.versions = { node: "18.0.0" };
      }
    }

    (globalThis as any).process = (window as any).process;
  }
} catch (error) {
  console.error("Failed to setup polyfills:", error);
}

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  createRoot(rootElement).render(<App />);
} catch (error) {
  console.error("Failed to render app:", error);
  // Show error message to user
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1>Application Error</h1>
      <p>Failed to load the application. Please check the console for details.</p>
      <pre>${error instanceof Error ? error.message : String(error)}</pre>
    </div>
  `;
}
