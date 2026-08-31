import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

import fs from 'fs';

// Live Mock API Backend Plugin inside Vite server
function apiBackendPlugin(): Plugin {
  return {
    name: 'tiffin-treat-api-backend',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';

        // Swagger UI Explorer Route
        if (url === '/swagger' || url === '/docs' || url === '/api/docs') {
          const swaggerHtmlPath = path.resolve(__dirname, 'public/swagger.html');
          if (fs.existsSync(swaggerHtmlPath)) {
            const html = fs.readFileSync(swaggerHtmlPath, 'utf-8');
            res.setHeader('Content-Type', 'text/html');
            res.statusCode = 200;
            return res.end(html);
          }
        }

        // OpenAPI 3.0.3 Specification JSON
        if (url === '/openapi.json' || url === '/api/openapi.json') {
          const openApiPath = path.resolve(__dirname, 'public/openapi.json');
          if (fs.existsSync(openApiPath)) {
            const json = fs.readFileSync(openApiPath, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            return res.end(json);
          }
        }

        if (!url.startsWith('/api/')) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          return res.end();
        }

        // Health endpoint
        if (url === '/api/health') {
          res.statusCode = 200;
          return res.end(JSON.stringify({ status: 'online', time: new Date().toISOString(), service: 'Tiffin & Treat NZ API' }));
        }

        // Return standard API status
        res.statusCode = 200;
        return res.end(JSON.stringify({ success: true, timestamp: new Date().toISOString() }));
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiBackendPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: true,
      port: 3000,
      allowedHosts: true as const,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
