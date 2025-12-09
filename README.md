# Retail Sales Management System

## Overview

Search, filter, sort, and paginate retail sales data in a clean UI. Backend serves in-memory JSON; frontend is a single-page React app. Designed for quick exploration of customer, product, and payment insights. No database setup required. Runs locally on two lightweight servers.

## Tech Stack

- Backend: Node.js + Express (in-memory JSON)
- Frontend: React (Vite) + React Router + Tailwind
- HTTP: Axios

## Search Implementation Summary

- Case-insensitive substring match on customer name and phone
- Works alongside filters, sorting, and pagination
- Handled on the backend before filters/sort/page are applied

## Filter Implementation Summary

- Multi-select: region, gender, category, tags, payment method
- Ranges: age (min/max), date (from/to)
- Filters combine; empty values are ignored

## Sorting Implementation Summary

- Fields: date, quantity, customerName
- Orders: asc or desc (date defaults to desc)
- Applied after search/filters, before pagination

## Pagination Implementation Summary

- Page size: 10
- Backend returns total items/pages
- Frontend shows page numbers plus prev/next controls

## Setup Instructions

1. Backend

```bash
cd backend
npm install
npm run convert-csv   # first run or when CSV changes
npm start             # or npm run dev
```

Serves on http://localhost:3001

2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Serves on http://localhost:3000 (proxy to backend)
