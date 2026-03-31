import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      // 代理音频资源，绕过 CORS 限制
      '/api/audio': {
        target: 'https://keee5215-1407310157.cos.ap-beijing.myqcloud.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/audio/, ''),
        configure: (proxy, options) => {
          // 添加 CORS 响应头
          proxy.on('proxyRes', (proxyRes, req, res) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          });
        }
      }
    }
  }
});
