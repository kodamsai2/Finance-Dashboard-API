# 📊 Finance Dashboard API

Backend API for a finance dashboard application that provides financial summaries, category breakdowns, trends, and transaction management.

---

## 🚀 Tech Stack

* **Backend:** Node.js, Express
* **Database:** PostgreSQL (Neon - Serverless), Sequelize ORM
* **Authentication:** JWT, bcryptjs
* **Validation:** express-validator
* **Rate Limiting:** express-rate-limit
* **API Testing:** Postman
* **Deployment:** Render

---

## ⚙️ Getting Started

### Prerequisites

* Node.js
* npm

### Installation

```bash
git clone https://github.com/kodamsai2/Finance-Dashboard-API.git
cd Finance-Dashboard-API
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=Finance_Dashboard_Secret
```

---

## ▶️ Run the Server

```bash
npm run start
```

Server will start on:

```
http://localhost:3000
```

---
## folder structure
src/ structure is:
src/server.js: starts server after DB connect
src/app.js: Express app, middleware, mounts routes under /api/v1/*
src/config/db.js: Sequelize connection + sync
src/constants.js: roles/statuses/types/categories
src/middlewares/auth.middleware.js: JWT auth, sets req.userUUID/userRole/userStatus
src/models/: Sequelize models (user.model.js, record.model.js) + associations (index.js)
src/routes/: route definitions + validators
src/controllers/: request handlers (RBAC checks, response formatting)
src/services/: DB/query logic
```
Finance-Dashboard-API/
├── src/
│   ├── config/
│   │   └── db.js              : Sequelize connection + sync
│   ├── controllers/           : request handlers (RBAC checks, response formatting)
│   │   ├── auth.controller.js : auth controller (register, login)
│   │   ├── config.controller.js : config controller (categories)
│   │   ├── user.controller.js : user controller (get, update role, update status, delete)
│   │   └── record.controller.js : record controller (get, create, update, delete)
│   │   └── dashboard.controller.js : dashboard controller (analytics) (summary, categories, trends, recent)
│   ├── middlewares/         : authentication middleware (auth.middleware.js)
│   ├── models/              : Sequelize models (user.model.js, record.model.js) + associations (index.js)
│   │   ├── index.js         : associations between models
│   │   ├── user.model.js    : user model
│   │   └── record.model.js  : record model
│   ├── routes/              : route definitions + validators 
│   │   ├── auth.routes.js   : auth routes (register, login)
│   │   ├── config.routes.js : config routes (categories)
│   │   ├── user.routes.js   : user routes (get, update role, update status, delete)
│   │   └── record.routes.js : record routes (get, create, update, delete)
│   │   └── dashboard.routes.js : dashboard routes (analytics) (summary, categories, trends, recent)
│   ├── services/            : DB queries logic (dashboard.service.js, record.service.js, user.service.js)
│   ├── constants.js         : roles/statuses/types/categories
│   ├── app.js               : Express app, middleware, mounts routes under /api/v1/*
│   └── server.js  : starts server after DB connect
```
## 🔗 Base URL / Versioning

All endpoints are prefixed with:

- `/api/v1`

Example: `POST /api/v1/auth/login`

## 🔐 Authentication

Send the JWT in every protected request:

- `Authorization: Bearer <token>`

## 📌 API Overview (Actual Routes)

### Authentication
- `POST /api/v1/auth/register`
  - Body: `{ "username": "string", "email": "string", "password": "string" }`
- `POST /api/v1/auth/login`
  - Body: `{ "email": "string", "password": "string" }`

### Configuration
- `GET /api/v1/config/categories`
  - Returns categories grouped by record type

### Users (Admin only; account must be Active)
- `GET /api/v1/users?status=Active|Inactive&role=Viewer|Analyst|Admin`
- `GET /api/v1/users/:uuid`
- `PATCH /api/v1/users/:uuid/role` body: `{ "role": "Viewer|Analyst|Admin" }`
- `PATCH /api/v1/users/:uuid/status` body: `{ "status": "Active|Inactive" }`
- `DELETE /api/v1/users/:uuid` (soft delete)

### Records
- `GET /api/v1/records`
  - Filters: `type=Income|Expense`, `category=Rent,Travel`, `from=YYYY-MM-DD`, `to=YYYY-MM-DD`, `minAmount`, `maxAmount`, `search`
  - Sorting: `sortBy=date|amount`, `sortOrder=asc|desc`
  - Pagination: `page=1`, `limit=10` (10–30)
- `POST /api/v1/records` (Admin only)
  - Body: `{ "amount": 100, "type": "Income", "category": "Rent", "date": "2024-01-01", "description": "optional" }`
- `PATCH /api/v1/records/:uuid` (Admin only)
- `DELETE /api/v1/records/:uuid` (Admin only; soft delete)

### Dashboard
- `GET /api/v1/dashboard/summary?year=YYYY`
- `GET /api/v1/dashboard/categories?year=YYYY` (Analyst/Admin)
- `GET /api/v1/dashboard/trends?period=monthly|weekly&year=YYYY&month=MM` (month required for weekly; Analyst/Admin)
- `GET /api/v1/dashboard/recent` (Analyst/Admin; returns latest 10)

## 👥 User Roles

| Role    | Permissions                   |
| ------- | ----------------------------- |
| Admin   | Full access (users + records) |
| Analyst | Analytics + records view      |
| Viewer  | Read-only access              |

---

## 🧪 API Documentation

👉 https://documenter.getpostman.com/view/28166640/2sBXiqF9SR

---

## 🌐 Deployment

Hosted on **Render**
(Deployment URL: )

---

## 📝 Notes

* First admin must be manually assigned via database.
* Records use **soft delete** (destroy() method in sequelize)
* Role-based access control is enforced across endpoints.
* Amount is stored in paisa in the database.
* Pagination is implemented for getting records.
* Validation is implemented for all endpoints.
* Error handling is implemented for all endpoints.
* Logging is implemented for all endpoints.
* IP based Rate limiting is implemented for all endpoints.
* Authentication is implemented for all endpoints.
* Authorization is implemented for all endpoints.
