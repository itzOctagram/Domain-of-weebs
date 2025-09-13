import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api-aa": {
        target: "https://da.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-aa/, ""),
      },
      "/api-a": {
        target: "https://ea.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-a/, ""),
      },
      "/api-b": {
        target: "https://db.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-b/, ""),
      },
      "/api-c": {
        target: "https://dc.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-c/, ""),
      },
      "/api-ca": {
        target: "https://da.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-ca/, ""),
      },
      "/api-d": {
        target: "https://dd.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-d/, ""),
      },
      "/api-dg": {
        target: "https://dg.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-dg/, ""),
      },
      "/api-dh": {
        target: "https://dh.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-dh/, ""),
      },
      "/api-e": {
        target: "https://de.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-e/, ""),
      },
      "/api-f": {
        target: "https://df.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-f/, ""),
      },
      "/api-sub": {
        target: "https://mgstatics.xyz/subtitle/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-sub/, ""),
      },
      "/api-thumb": {
        target: "https://mgstatics.xyz/thumbnails/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-thumb/, ""),
      },
    },
  },
});
