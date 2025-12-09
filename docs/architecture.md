# Architecture

## Backend architecture

- Express app serving sales data from generated JSON (no DB)
- Layers: routes → controllers → services; utilities for CSV → JSON
- Data source: `src/data/sales.json` produced by `src/utils/convertCsvToJson.js`

## Frontend architecture

- React (Vite) SPA; `src/routes/Home.jsx` owns state and requests
- UI composed from `src/components` (filters, sort, table, pagination, search, sidebar)
- API client in `src/services/api.js`; styles in `src/styles`

## Data flow

1. User updates search/filters/sort/page in the UI
2. `Home` triggers fetch via `api.js`
3. Request hits Express routes → controllers → services
4. Service loads cached JSON, applies search → filters → sort → paginate
5. JSON response returns items/totals; UI re-renders

## Folder structure

- backend/
  - src/routes
  - src/controllers
  - src/services
  - src/utils (CSV → JSON)
  - src/data (CSV + generated JSON)
- frontend/
  - src/routes
  - src/components
  - src/services
  - src/styles
- docs/ (this file)

## Module responsibilities

- Routes: define endpoints, map to controllers
- Controllers: parse/query params, handle errors, format responses
- Services: search/filter/sort/paginate, manage in-memory data
- Utils: CSV conversion to JSON
- Components: reusable UI pieces; `Home` coordinates state and rendering
