# NATH Agency — Local admin server

This repository contains a static website and a small Node/Express server to persist catalog, orders and reviews locally for development.

Run (Windows PowerShell):

```powershell
cd "c:\Finallllllll\Major Project\nath-agency-medical-store"
npm install
npm start
```

The server serves the site and provides REST endpoints under `/api`:
- GET /api/catalog
- POST /api/catalog
- GET /api/orders
- POST /api/orders
- DELETE /api/orders/:id
- GET /api/reviews
- POST /api/reviews
- DELETE /api/reviews/:idx

If the server is not running, the admin falls back to using browser localStorage keys: `nath_product_data`, `nath_orders`, `nath_reviews`.
