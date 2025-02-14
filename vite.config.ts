import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "../flask-backend/static",
        emptyOutDir: true,
        sourcemap: true
    },
    server: {
        proxy: {
            "/ask": "http://127.0.0.1:9002",
            "/chat": "http://127.0.0.1:9002",
            "/tunedgpt": "http://127.0.0.1:9002",
            "/selfservice": "http://127.0.0.1:9002",
            "/default/gpt": "http://127.0.0.1:9002",
            "/db": "http://127.0.0.1:9002",
            "/logout": "http://127.0.0.1:9002",
            "/emailAssistant": "http://127.0.0.1:9002",
            "/eda": "http://127.0.0.1:9002",
            "/bi": "http://127.0.0.1:9002",
            "/leaver": "http://127.0.0.1:9002",
            "/ct": "http://127.0.0.1:9002",
            "/dac": "http://127.0.0.1:9002",
            "/takeda": "http://127.0.0.1:9002",
            "/catalogue": "http://127.0.0.1:9002",
            "/exp": "http://127.0.0.1:9002",
            "/qvd":"http://127.0.0.1:9002",
            "/abbvie":"http://127.0.0.1:9002",
            
        }
    }
});
