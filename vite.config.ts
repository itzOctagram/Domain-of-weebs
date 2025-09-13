import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
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
      "/api-a": {
        target: "https://da.netmagcdn.com:2228/hls-playback/",
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
      "/api-d": {
        target: "https://dd.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-d/, ""),
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
      "/api-g": {
        target: "https://dg.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-g/, ""),
      },
      "/api-h": {
        target: "https://dh.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-h/, ""),
      },
      "/api-i": {
        target: "https://di.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-i/, ""),
      },
      "/api-j": {
        target: "https://dj.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-j/, ""),
      },
      "/api-k": {
        target: "https://dk.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-k/, ""),
      },
      "/api-l": {
        target: "https://dl.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-l/, ""),
      },
      "/api-m": {
        target: "https://dm.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-m/, ""),
      },
      "/api-n": {
        target: "https://dn.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-n/, ""),
      },
      "/api-o": {
        target: "https://do.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-o/, ""),
      },
      "/api-p": {
        target: "https://dp.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-p/, ""),
      },
      "/api-q": {
        target: "https://dq.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-q/, ""),
      },
      "/api-r": {
        target: "https://dr.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-r/, ""),
      },
      "/api-s": {
        target: "https://ds.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-s/, ""),
      },
      "/api-t": {
        target: "https://dt.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-t/, ""),
      },
      "/api-u": {
        target: "https://du.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-u/, ""),
      },
      "/api-v": {
        target: "https://dv.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-v/, ""),
      },
      "/api-w": {
        target: "https://dw.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-w/, ""),
      },
      "/api-x": {
        target: "https://dx.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-x/, ""),
      },
      "/api-y": {
        target: "https://dy.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-y/, ""),
      },
      "/api-z": {
        target: "https://dz.netmagcdn.com:2228/hls-playback/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-z/, ""),
      },
    },
  },
});
