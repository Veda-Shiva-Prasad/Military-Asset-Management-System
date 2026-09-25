````md
# Military Asset Management System

A full-stack web application for managing military assets across multiple bases. The system tracks purchases, transfers, assignments, expenditures, inventory balances, and user activities with role-based access control.

## Features

- Dashboard with Opening Balance, Closing Balance and Net Movement
- Purchase and transfer management
- Asset assignment and expenditure tracking
- Role-based access control (RBAC)
- Audit logging for system transactions
- Date, base and equipment filters
- Inventory validation to prevent invalid transactions
- Responsive React frontend
- Secure REST APIs using JWT authentication

## Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- Sequelize ORM
- JWT
- bcryptjs

### Database

- PostgreSQL

## Architecture

The application follows a simple frontend-backend architecture:

React Frontend → REST API → Express Backend → Sequelize → PostgreSQL

## User Roles

### Admin

- Full access to the system
- Can manage all bases and transactions
- Can view audit logs

### Base Commander

- Access limited to the assigned base
- Can manage purchases, transfers, assignments and expenditures

### Logistics Officer

- Access limited to the assigned base
- Can manage purchases and transfers

## Main API Endpoints

| Method   | Endpoint            | Purpose                 |
| -------- | ------------------- | ----------------------- |
| POST     | `/api/auth/login`   | User login              |
| GET      | `/api/dashboard`    | Dashboard data          |
| GET/POST | `/api/purchases`    | Purchase management     |
| GET/POST | `/api/transfers`    | Transfer management     |
| GET/POST | `/api/assignments`  | Assignment management   |
| GET/POST | `/api/expenditures` | Expenditure management  |
| GET      | `/api/audit-logs`   | Audit logs (Admin only) |

## Database Models

- User
- Base
- EquipmentType
- Purchase
- Transfer
- Assignment
- Expenditure
- AuditLog

## API Logging

Important transactions such as purchases, transfers, assignments and expenditures are recorded in the `AuditLog` table with the user, action, entity, entity ID, details and timestamp.

## Setup

### Backend

```bash
cd backend
npm install
npm run dev
```
````

Create a `.env` file using the following format:

```env
PORT=5000
DB_NAME=military_asset_management
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on the Vite development server and communicates with the backend through the REST API.

## Login Credentials

### Admin

Email: `admin@mams.com`
Password: `Admin@123`

### Base Commander

Email: `commander@mams.com`
Password: `Admin@123`

### Logistics Officer

Email: `logistics@mams.com`
Password: `Admin@123`

## Project Structure

```text
Military-Asset-Management-System/
├── backend/
├── frontend/
├── README.md
└── .gitignore
```

## Author

Veda Shiva Prasad

```


```
