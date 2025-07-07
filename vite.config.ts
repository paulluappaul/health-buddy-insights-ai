
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    watch: {
      usePolling: true,
      interval: 1000,
      binaryInterval: 1000,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/build/**',
        '**/.cache/**',
        '**/coverage/**',
        '**/.nyc_output/**',
        '**/.vscode/**',
        '**/.idea/**',
        '**/tmp/**',
        '**/temp/**',
        '**/logs/**',
        '**/*.log',
        '**/package-lock.json',
        '**/yarn.lock',
        '**/bun.lockb'
      ]
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: []
  }
}));
