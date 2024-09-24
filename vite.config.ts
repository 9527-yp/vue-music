import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: true, //ip地址
      port: 8080, //端口号
      open: false, //启动后是否自动打开浏览器
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          ws: true,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
