import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      events: "events",
    },
  },
  define: {
    global: "globalThis",
    "process.env": "{}",
    "process.version": '"v18.0.0"',
    "process.versions": '{"node":"18.0.0"}',
  },
  optimizeDeps: {
    include: ["buffer", "crypto-browserify", "process"],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
}));
