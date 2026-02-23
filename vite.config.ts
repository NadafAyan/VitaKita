import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        "/api/classify": {
          target: "https://api-inference.huggingface.co/models/YashKumar11/vitagita-model",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/classify/, ""),
          headers: {
            Authorization: `Bearer ${env.VITE_HF_TOKEN}`,
          },
        },
        "/api/chat-hf": {
          target: "https://router.huggingface.co/v1/chat/completions",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/chat-hf/, ""),
          headers: {
            Authorization: `Bearer ${env.VITE_HF_TOKEN}`,
          },
        },
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
