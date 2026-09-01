import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

import fs from 'fs';

// Helpers for API backend
function parseBody(req: any): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk: any) => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function getMenuFile(): any[] {
  const menuPath = path.resolve(__dirname, 'public/data/menu.json');
  try {
    if (fs.existsSync(menuPath)) {
      return JSON.parse(fs.readFileSync(menuPath, 'utf-8'));
    }
  } catch (e) {
    console.error('Failed to read menu.json', e);
  }
  return [];
}

function saveMenuFile(data: any[]) {
  const dir = path.resolve(__dirname, 'public/data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.resolve(dir, 'menu.json'), JSON.stringify(data, null, 2), 'utf-8');
}

// Live Mock API Backend Plugin inside Vite server
function apiBackendPlugin(): Plugin {
  return {
    name: 'tiffin-treat-api-backend',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
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

        // POST /api/upload - Handle image file uploads
        if (req.method === 'POST' && url === '/api/upload') {
          const body = await parseBody(req);
          const imageData = body.image || '';
          if (!imageData) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Missing image data' }));
          }

          const uploadsDir = path.resolve(__dirname, 'public/uploads');
          if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

          let filename = '';
          if (typeof imageData === 'string' && imageData.startsWith('data:')) {
            const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
              const ext = matches[1].includes('png') ? 'png' : matches[1].includes('webp') ? 'webp' : 'jpg';
              const rawName = (body.filename || 'dish').replace(/\.[^/.]+$/, '');
              const cleanBase = rawName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
              filename = `${cleanBase}_${Date.now()}.${ext}`;
              const buffer = Buffer.from(matches[2], 'base64');
              fs.writeFileSync(path.resolve(uploadsDir, filename), buffer);
            }
          }

          const fileUrl = filename ? `/uploads/${filename}` : imageData;
          res.statusCode = 200;
          return res.end(JSON.stringify({ success: true, url: fileUrl }));
        }

        // GET /api/menu - Get all items
        if (req.method === 'GET' && (url === '/api/menu' || url.startsWith('/api/menu?'))) {
          const menu = getMenuFile();
          res.statusCode = 200;
          return res.end(JSON.stringify(menu));
        }

        // POST /api/menu - Add item
        if (req.method === 'POST' && url === '/api/menu') {
          const body = await parseBody(req);
          const menu = getMenuFile();
          menu.unshift(body);
          saveMenuFile(menu);
          res.statusCode = 201;
          return res.end(JSON.stringify({ success: true, item: body }));
        }

        // Operations on /api/menu/:id
        const menuMatch = url.match(/^\/api\/menu\/([^?\/]+)/);
        if (menuMatch) {
          const itemId = decodeURIComponent(menuMatch[1]);
          const menu = getMenuFile();
          const itemIndex = menu.findIndex((m: any) => m.id === itemId);

          // PATCH /api/menu/:id/sold-out
          if (url.includes('/sold-out') && (req.method === 'PATCH' || req.method === 'POST')) {
            const body = await parseBody(req);
            if (itemIndex !== -1) {
              menu[itemIndex].isSoldOut = body.isSoldOut ?? !menu[itemIndex].isSoldOut;
              saveMenuFile(menu);
              res.statusCode = 200;
              return res.end(JSON.stringify({ success: true, item: menu[itemIndex] }));
            }
          }

          // PATCH /api/menu/:id/price
          if (url.includes('/price') && (req.method === 'PATCH' || req.method === 'POST')) {
            const body = await parseBody(req);
            if (itemIndex !== -1) {
              menu[itemIndex].price = Number(body.price);
              saveMenuFile(menu);
              res.statusCode = 200;
              return res.end(JSON.stringify({ success: true, item: menu[itemIndex] }));
            }
          }

          // PUT or PATCH /api/menu/:id
          if (req.method === 'PUT' || req.method === 'PATCH') {
            const body = await parseBody(req);
            if (itemIndex !== -1) {
              menu[itemIndex] = { ...menu[itemIndex], ...body };
              saveMenuFile(menu);
              res.statusCode = 200;
              return res.end(JSON.stringify({ success: true, item: menu[itemIndex] }));
            } else {
              menu.unshift(body);
              saveMenuFile(menu);
              res.statusCode = 200;
              return res.end(JSON.stringify({ success: true, item: body }));
            }
          }

          // DELETE /api/menu/:id
          if (req.method === 'DELETE') {
            const filtered = menu.filter((m: any) => m.id !== itemId);
            saveMenuFile(filtered);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true }));
          }
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
      watch: {
        ignored: ['**/public/data/**', '**/public/uploads/**']
      },
    },
  };
});
