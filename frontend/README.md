# Frontend - Sales Management System

React + Vite + Tailwind UI for exploring sales data. Single-page app that hits the Express backend.

## Run

```bash
npm install
npm run dev
```

Serves on http://localhost:3000.

Build/preview:

```bash
npm run build
npm run preview
```

## API base URL

- Default: http://localhost:3001
- Override via `.env`: `VITE_API_BASE_URL=http://localhost:3001`
- Fallback is set in `src/services/api.js`

## Features

- Search by name or phone
- Filters: region, gender, category, tags, payment method, age, date range
- Sort: date, quantity, customer name (asc/desc)
- Pagination: 10 items per page with totals from the backend
