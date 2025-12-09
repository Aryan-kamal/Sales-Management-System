# Backend - Sales Management System

Express API that serves sales data from in-memory JSON (no DB). Layers stay simple: routes → controllers → services, with CSV → JSON handled in `src/utils/`.

## Run

```bash
npm install
npm run convert-csv   # first time or when CSV changes
npm start             # or npm run dev
```

Default port: http://localhost:3001 (respects PORT env).

## Endpoints

- GET `/api/sales` — search, filter, sort, paginate
- GET `/api/sales/filter-options` — unique filter values
- GET `/health` — health check

Common query params: `search`, `region`, `gender`, `ageMin`, `ageMax`, `category`, `tags`, `paymentMethod`, `dateFrom`, `dateTo`, `sortBy`, `sortOrder`, `page`, `pageSize`.

## Data notes

- Data loads once from `src/data/sales.json` (generated from CSV) and is cached for requests.
