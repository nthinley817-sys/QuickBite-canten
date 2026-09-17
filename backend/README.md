# QuickBite backend

Java (Spring Boot 3, Java 17) + MySQL REST API for the QuickBite React
frontend. It's a separate app from `../` (the Vite frontend) — run both at
once during development.

## Endpoints

| Method | Path                       | Matches `src/services/api.js`     |
|--------|----------------------------|------------------------------------|
| GET    | `/api/menu`                | `Api.getMenu()`                    |
| PUT    | `/api/menu/{id}`           | `Api.updateMenuItem(item)`         |
| GET    | `/api/orders`               | `Api.getOrders()`                  |
| POST   | `/api/orders`               | `Api.createOrder(order)`           |
| PATCH  | `/api/orders/{id}/status`   | `Api.updateOrderStatus(id, status)`|
| GET    | `/api/canteens`             | (not called yet — see note below) |
| POST   | `/api/staff/login`          | (not called yet — see note below) |

The frontend's UI pages weren't touched. `getMenu`/`getOrders` are already
wired in `App.jsx`, so those two now come from MySQL as soon as this
backend is running. `createOrder`, `updateOrderStatus`, `updateMenuItem`,
canteens and staff login exist and work here, but `App.jsx` currently
manages orders/menu-edits/login purely in local React state without
calling them — ask to have those wired in too if you want orders/menu
edits/staff login to actually persist.

## 1. Install MySQL

Any MySQL 8.x install works (local install, Docker, XAMPP/WAMP, etc). You
just need a running server and a user with permission to create databases
— the app creates the `quickbite` database itself on first run.

## 2. Configure credentials

Defaults to `root` with no password (`backend/src/main/resources/application.properties`).
To use different credentials, set environment variables before starting:

```bash
# Windows (PowerShell)
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_password"

# macOS/Linux
export DB_USERNAME=root
export DB_PASSWORD=your_password
```

## 3. Install Maven (if you don't have it)

Check first: `mvn -v`. If that fails, install it — e.g. on Windows with
[Chocolatey](https://chocolatey.org/) run `choco install maven`, or grab it
from https://maven.apache.org/download.cgi and add its `bin` folder to your
PATH. (Java 17+ is required too; `java -version` to check.)

## 4. Run it

```bash
cd backend
mvn spring-boot:run
```

First run creates the `quickbite` database and its tables, then seeds them
with the same demo menu/orders/canteens the frontend used to hardcode, plus
one staff login (`staff` / `staff123`, matching the frontend's current
demo login). It only seeds empty tables, so this is safe to re-run.

The API is now at `http://localhost:8080/api/...` — try
`http://localhost:8080/api/menu` in a browser.

## 5. Point the frontend at it

`src/services/api.js` already calls `http://localhost:8080/api` by default.
To use a different backend URL, set `VITE_API_BASE_URL` in a `.env` file at
the frontend project root (see `.env.example`).

## Notes

- CORS is open to any `localhost` origin (`config/CorsConfig.java`) so the
  Vite dev server can call it regardless of which port it's on.
- `spring.jpa.hibernate.ddl-auto=update` auto-manages the schema — fine for
  this prototype; swap in Flyway/Liquibase before this holds real data.
