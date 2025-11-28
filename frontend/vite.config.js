import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path';

// Get the current directory name
const __dirname = path.resolve();

export default defineConfig(({ mode }) => {
  // Load environment variables from the frontend directory
  const env = loadEnv(mode, path.resolve(__dirname, 'frontend'), '');
  
  // Determine the API URL with fallbacks
  const apiUrl = env.VITE_API_URL || 'http://localhost:5000';
  
  return {
    root: path.resolve(__dirname, 'frontend'),
    publicDir: path.resolve(__dirname, 'public'),
    plugins: [react()],
    define: {
      'process.env': {
        ...env,
        VITE_API_URL: JSON.stringify(apiUrl)
      }
    },
    server: {
      port: 3000,
      strictPort: true,
      proxy: {
        '^/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          }
        }
      }
    },
    build: {
      outDir: path.resolve(__dirname, 'dist'),
      assetsDir: 'assets',
      sourcemap: true,
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'frontend/index.html')
        },
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            auth: ['axios', 'jwt-decode'],
          },
        },
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'frontend/src'),
      },
    },
  };
});
