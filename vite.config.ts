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

function getOrdersFile(): any[] {
  const ordersPath = path.resolve(__dirname, 'public/data/orders.json');
  try {
    if (fs.existsSync(ordersPath)) {
      return JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
    }
  } catch (e) {
    console.error('Failed to read orders.json', e);
  }
  return [];
}

function saveOrdersFile(data: any[]) {
  const dir = path.resolve(__dirname, 'public/data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.resolve(dir, 'orders.json'), JSON.stringify(data, null, 2), 'utf-8');
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

        // Direct Static Handler for /uploads/... to serve newly uploaded files immediately
        if (url.startsWith('/uploads/')) {
          const cleanPath = url.split('?')[0].replace(/^\/uploads\//, '');
          const filePath = path.resolve(__dirname, 'public/uploads', cleanPath);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes: Record<string, string> = {
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.png': 'image/png',
              '.webp': 'image/webp',
              '.gif': 'image/gif',
              '.avif': 'image/avif',
              '.svg': 'image/svg+xml'
            };
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.statusCode = 200;
            return fs.createReadStream(filePath).pipe(res);
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

        // GET /api/orders
        if (req.method === 'GET' && (url === '/api/orders' || url.startsWith('/api/orders?'))) {
          const orders = getOrdersFile();
          res.statusCode = 200;
          return res.end(JSON.stringify(orders));
        }

        // POST /api/orders - Add new order
        if (req.method === 'POST' && url === '/api/orders') {
          const body = await parseBody(req);
          const orders = getOrdersFile();
          orders.unshift(body);
          saveOrdersFile(orders);
          res.statusCode = 201;
          return res.end(JSON.stringify({ success: true, order: body }));
        }

        // PATCH /api/orders/:id/payment (Record / Edit actual money paid and payment mode)
        const orderPaymentMatch = url.match(/^\/api\/orders\/([^?\/]+)\/payment/);
        if (orderPaymentMatch && (req.method === 'PATCH' || req.method === 'PUT' || req.method === 'POST')) {
          const orderId = decodeURIComponent(orderPaymentMatch[1]);
          const body = await parseBody(req);
          const orders = getOrdersFile();
          const orderIndex = orders.findIndex((o: any) => o.orderId === orderId || o.id === orderId);

          const amountPaid = Number(body.amountPaid) || 0;
          const paymentMode = body.paymentMode || 'Cash';
          const settledBy = body.settledBy || 'Staff';

          if (orderIndex !== -1) {
            const target = orders[orderIndex];
            const total = Number(target.totalAmount) || 0;
            const difference = Number((total - amountPaid).toFixed(2));
            const paymentStatus = difference <= 0 ? 'paid' : (paymentMode === 'Credit' ? 'credit' : (amountPaid > 0 ? 'partial' : 'pending'));

            target.amountPaid = amountPaid;
            target.paymentDifference = difference;
            target.paymentMode = paymentMode;
            target.paymentStatus = paymentStatus;
            target.paymentSettledAt = new Date().toISOString();
            target.settledBy = settledBy;
            if (target.customerDetails) {
              target.customerDetails.amountPaid = amountPaid;
              target.customerDetails.paymentDifference = difference;
              target.customerDetails.paymentMode = paymentMode;
              target.customerDetails.paymentStatus = paymentStatus;
            }

            orders[orderIndex] = target;
            saveOrdersFile(orders);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, order: target }));
          } else {
            res.statusCode = 200;
            return res.end(JSON.stringify({ 
              success: true, 
              order: { orderId, amountPaid, paymentDifference: 0, paymentMode, paymentStatus: 'paid' } 
            }));
          }
        }

        // GET /api/reports/sales (Sales report & billing bifurcation)
        if (req.method === 'GET' && (url === '/api/reports/sales' || url.startsWith('/api/reports/sales?'))) {
          const orders = getOrdersFile();
          const validOrders = orders.filter((o: any) => o.status !== 'cancelled');

          let totalGross = 0;
          let totalPaid = 0;
          let totalDue = 0;
          let totalCash = 0;
          let totalCard = 0;
          let totalCredit = 0;
          let cashCount = 0;
          let cardCount = 0;
          let creditCount = 0;

          validOrders.forEach((o: any) => {
            const total = Number(o.totalAmount) || 0;
            const paid = o.amountPaid != null ? Number(o.amountPaid) : total;
            const mode = o.paymentMode || (o.customerDetails?.paymentMethod?.includes('cash') ? 'Cash' : 'Card');
            const diff = Number((total - paid).toFixed(2));

            totalGross += total;
            totalPaid += paid;
            if (diff > 0) totalDue += diff;

            if (mode === 'Cash') {
              totalCash += paid;
              cashCount++;
            } else if (mode === 'Credit') {
              totalCredit += (diff > 0 ? diff : total);
              creditCount++;
            } else {
              totalCard += paid;
              cardCount++;
            }
          });

          const gstTotal = Number((totalGross * (3 / 23)).toFixed(2));
          const netRevenue = Number((totalGross - gstTotal).toFixed(2));

          res.statusCode = 200;
          return res.end(JSON.stringify({
            success: true,
            summary: {
              totalOrders: validOrders.length,
              grossInvoiced: Number(totalGross.toFixed(2)),
              actualCollected: Number(totalPaid.toFixed(2)),
              outstandingDue: Number(totalDue.toFixed(2)),
              gst15Percent: gstTotal,
              netRevenueExGst: netRevenue,
              bifurcation: {
                cash: { count: cashCount, totalCollected: Number(totalCash.toFixed(2)) },
                card: { count: cardCount, totalCollected: Number(totalCard.toFixed(2)) },
                credit: { count: creditCount, totalDue: Number(totalCredit.toFixed(2)) }
              }
            }
          }));
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
