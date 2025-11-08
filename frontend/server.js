const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

function readJSON(name, defaultValue) {
  const file = path.join(DATA_DIR, name + '.json');
  if (!fs.existsSync(file)) return defaultValue;
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return defaultValue; }
}
function writeJSON(name, data) {
  const file = path.join(DATA_DIR, name + '.json');
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

app.use(cors());
app.use(express.json());
// serve static site
app.use(express.static(__dirname));

// Note: admin dashboard and session-based auth were removed. Write/delete admin endpoints are disabled.
// endpoints
app.get('/api/catalog', (req, res) => {
  const catalog = readJSON('catalog', null);
  if (catalog) return res.json(catalog);
  // fallback to bundled product JSON file (nath_agency_catalog.json)
  const bundledCatalogPath = path.join(__dirname, 'nath_agency_catalog.json');
  if (fs.existsSync(bundledCatalogPath)) {
    try {
      const json = JSON.parse(fs.readFileSync(bundledCatalogPath, 'utf8'));
      return res.json(json);
    } catch (e) {
      return res.status(500).json({ error: 'Failed to parse bundled catalog' });
    }
  }
  return res.status(404).json({ error: 'No catalog found' });
});

// lightweight SVG placeholder image generator used by front-end product data
app.get('/api/placeholder/:w/:h', (req, res) => {
  const w = Math.abs(parseInt(req.params.w, 10)) || 300;
  const h = Math.abs(parseInt(req.params.h, 10)) || 200;
  const bg = '#f5f7fa';
  const fg = '#666';
  const text = `${w}x${h}`;
  const fontSize = Math.max(12, Math.floor(Math.min(w, h) / 6));
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">\n  <rect width="100%" height="100%" fill="${bg}"/>\n  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="${fontSize}" fill="${fg}">${text}</text>\n</svg>`;
  res.set('Content-Type', 'image/svg+xml');
  res.send(svg);
});

app.post('/api/catalog', (req, res) => {
  // Catalog updates via API are disabled because admin dashboard was removed
  return res.status(403).json({ error: 'catalog updates disabled' });
});

app.get('/api/orders', (req, res) => { res.json(readJSON('orders', [])); });
app.post('/api/orders', (req, res) => {
  const orders = readJSON('orders', []);
  const order = req.body;
  order.id = order.id || Date.now();
  order.createdAt = new Date().toISOString();
  orders.push(order);
  writeJSON('orders', orders);
  res.json(order);
});
app.delete('/api/orders/:id', (req, res) => {
  // Deleting orders via API is disabled (admin dashboard removed)
  return res.status(403).json({ error: 'order deletion disabled' });
});

app.get('/api/reviews', (req, res) => { res.json(readJSON('reviews', [])); });
app.post('/api/reviews', (req, res) => { const reviews = readJSON('reviews', []); reviews.push(req.body); writeJSON('reviews', reviews); res.json({ ok: true }); });
app.delete('/api/reviews/:idx', (req, res) => { const idx = Number(req.params.idx); // review deletion disabled since admin dashboard is removed
  return res.status(403).json({ error: 'review deletion disabled' }); });

app.listen(PORT, () => console.log('Server started on port', PORT));
