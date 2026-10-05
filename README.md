# Automatic Lab Allocation System
> **Academic College DBMS Mini-Project**  
> Built with MySQL 8.0, Node.js + Express (Raw Parameterized SQL, No ORM), and React + Vite + Tailwind CSS.

---

## 1. Project Overview
The **Automatic Lab Allocation System** is an enterprise-grade academic lab management platform engineered to eliminate room double-bookings, faculty schedule overlaps, untracked hardware terminal defects, and low infrastructure utilization.

Unlike conventional web applications that manage business logic solely in code, this system guarantees integrity at the **Database Management Systems (DBMS)** layer using:
- **3NF Relational Decomposition** across 19 base tables
- **Multi-column UNIQUE & CHECK Constraints** preventing concurrency race conditions
- **ACID Transactions** with row-level locks (`SELECT ... FOR UPDATE`), rollback error handlers, and savepoints
- **MySQL 8.0 Triggers** automating hardware fault states and real-time audit logs
- **Stored Procedures & Functions** for atomic booking validations and seat allocations
- **Relational Division (`Double NOT EXISTS`)** for curriculum software capability queries

---

## 2. Tech Stack & Architecture
- **Database Engine**: MySQL 8.0 (InnoDB Engine, UTF8MB4)
- **Backend API**: Node.js & Express using raw, parameterized queries with `mysql2/promise` connection pooling (Strictly **No ORM**)
- **Frontend App**: React 18, Vite, React Router 6, Tailwind CSS, Lucide Icons, Recharts
- **Environment**: Managed via `.env` with fallback defaults

---

## 3. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MySQL Server**: 8.0+ running on `localhost:3306`

---

## 4. Quick Start & Setup

### Step 1: Clone / Enter Directory
```bash
cd "Automatic-Lab-Allocation-System"
```

### Step 2: Configure Environment (`.env`)
A default `.env` is provided. If your local MySQL root password differs, update `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=lab_allocation_db
PORT=5000
```

### Step 3: Automated One-Command Installation & DB Initialization
Run the root setup command:
```bash
npm run setup
```
This command automatically:
1. Installs backend and frontend dependencies
2. Connects to your local MySQL 8 server
3. Drops & recreates `lab_allocation_db`
4. Executes `database/schema.sql` (19 tables + indexes + constraints)
5. Executes `database/dbms_features.sql` (4 Views, 3 Stored Procedures, 2 Functions, 3 Triggers)
6. Executes `database/seed.sql` (Realistic academic data across departments, faculty, students, labs, and time slots)

---

## 5. Running the Application

To run both backend API (Port 5000) and frontend interface (Port 3000) simultaneously:
```bash
npm run dev
```

Alternatively, you can run them individually:
- **Backend**: `npm run dev:backend` (Runs on `http://localhost:5000`)
- **Frontend**: `npm run dev:frontend` (Runs on `http://localhost:3000`)

To reset the database to clean seed state at any time:
```bash
npm run db:setup
```

---

## 6. Directory Structure
```
├── backend/
│   ├── controllers/            # Route controllers executing raw parameterized SQL
│   │   ├── adHocController.js
│   │   ├── auditController.js
│   │   ├── batchController.js
│   │   ├── courseController.js
│   │   ├── dashboardController.js
│   │   ├── dbmsController.js
│   │   ├── issueController.js
│   │   ├── labController.js
│   │   ├── notificationController.js
│   │   ├── scheduleController.js
│   │   ├── userController.js
│   │   └── workstationController.js
│   ├── middleware/
│   │   └── errorHandler.js     # Friendly formatter for MySQL constraint & trigger errors
│   ├── queries/
│   │   └── showcaseQueries.js  # Catalog of 14 viva showcase queries (JOINs, division, etc.)
│   ├── routes/
│   │   └── index.js            # Express API route bindings
│   ├── db.js                   # mysql2 connection pool
│   ├── server.js               # Express app listening on port 5000
│   └── test_api.js             # Automated API integration test script
├── database/
│   ├── schema.sql              # 19 normalized 3NF tables, PKs, FKs, CHECKs, UNIQUEs
│   ├── dbms_features.sql       # 4 Views, 3 Procedures, 2 Functions, 3 Triggers
│   ├── seed.sql                # Realistic academic baseline seed data
│   └── setup.js                # Database reset script executed by `npm run db:setup`
├── docs/
│   ├── DESIGN.md               # Schema specifications, Mermaid ER diagram, 3NF proofs
│   ├── DEMO_SCRIPT.md          # 7-minute viva walkthrough flow
│   └── VIVA_NOTES.md           # Frequently asked viva questions & answers mapped to code
├── frontend/
│   ├── src/
│   │   ├── api/client.js       # Lightweight fetch wrapper
│   │   ├── components/         # Modals, Skeletons, Navbar, Sidebar, Layout
│   │   ├── context/            # Toast notification context
│   │   ├── pages/              # 9 feature pages (Dashboard, Schedules, Labs, Showcase, etc.)
│   │   ├── App.jsx             # React Router routing
│   │   └── index.css           # Tailwind CSS directives
│   ├── index.html
│   └── vite.config.js          # Vite config with backend proxy on /api
├── scripts/
│   └── verify_phase4.js        # Comprehensive DBMS verification test suite
├── .env                        # Local MySQL configuration
├── .env.example                # Template configuration
├── package.json                # Root package configuration
└── run-all.js                  # Concurrent launcher script
```

---

## 7. Troubleshooting
- **MySQL Connection Refused (`ECONNREFUSED`)**: Ensure the MySQL80 service is running. Run `Get-Service MySQL80` or start it via Services Manager.
- **Access Denied (`ER_ACCESS_DENIED_ERROR`)**: Verify your `DB_PASSWORD` inside `.env`.
- **Port Conflict (Port 5000 or 3000 in use)**: Update `PORT` in `.env` or kill conflicting processes using `Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process`.
