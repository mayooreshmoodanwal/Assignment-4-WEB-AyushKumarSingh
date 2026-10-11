# Employee Management System

## Project Overview

A full-stack web application for managing employee records within an organization. The system provides a secure, role-based interface that allows administrators to perform complete employee lifecycle management while giving regular users read-only access to the employee directory.

## Assignment Information

- **Course**: Web Technologies
- **Assignment**: Assignment 4 — CRUD / Client Side Rendering
- **Project Serial No.**: 3 — Employee Management System
- **Deadline**: 12 October 2026, 9:00 AM IST

## Team Information

| Field | Detail |
|---|---|
| Team Size | 1 |
| Team Lead | Ayush Kumar Singh |
| Roll Number | [Roll Number] |
| Contributors | 1 |

## Individual Contribution Declaration

This project was developed as an individual submission under the assignment's permitted team size of 1–4 members. As the sole team member, I performed both the Team Leader and Developer responsibilities, including repository setup, issue creation, feature development, pull requests, code review, merging, testing and deployment. Since no other developers were making concurrent changes, collaborator-related merge conflicts were not expected. All changes were nevertheless developed on separate branches and integrated through pull requests to demonstrate the required GitHub collaboration workflow.

## Features

### Admin
- Secure login with JWT authentication
- Dashboard with live statistics (total employees, department breakdown, recently added)
- Full CRUD operations on employee records
- Search employees by name, email, or designation
- Filter employees by department
- Paginated employee listing
- Salary visibility (admin only)
- Delete with confirmation

### User
- Self-registration and login
- Browse the employee directory
- Search and filter employees
- View individual employee details
- Salary is hidden from regular users

### Security
- Passwords hashed with bcrypt
- JWTs issued on login and verified on every protected request
- Public registration creates `user` role only; admin provisioned via a controlled seed script
- Backend rejects unauthorized mutations regardless of frontend state

## Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool and dev server |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| Context API | Authentication state |
| Vanilla CSS | Styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT auth |
| express-validator | Input validation |
| Helmet | Security headers |
| CORS | Cross-origin configuration |

## Project Structure

```
employee-management-system/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── layout/       # Sidebar, AppLayout
│       │   ├── common/       # ProtectedRoute
│       │   └── forms/        # EmployeeForm (reusable)
│       ├── pages/            # LoginPage, RegisterPage, DashboardPage, etc.
│       ├── hooks/            # useDebounce
│       ├── context/          # AuthContext (React Context + Provider)
│       ├── services/         # api.js (Axios client), authService, employeeService
│       ├── styles/           # main.css
│       ├── App.jsx           # Routing
│       └── main.jsx          # Entry point
│
├── backend/
│   └── src/
│       ├── config/           # database.js, validateEnv.js
│       ├── controllers/      # authController, employeeController
│       ├── middleware/        # auth.js, errorHandler.js, validate.js
│       ├── models/           # User.js, Employee.js
│       ├── routes/           # auth.js, employees.js
│       ├── validators/       # index.js (express-validator rules)
│       ├── utils/            # jwt.js, validation.js
│       ├── scripts/          # seedAdmin.js
│       ├── app.js            # Express app
│       └── server.js         # Entry point
│   └── tests/               # api.test.js (Jest + Supertest)
│
├── docs/                    # ARCHITECTURE.md, GITHUB_WORKFLOW.md, DEPLOYMENT.md
├── .github/workflows/       # ci.yml
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- npm

### Clone
```bash
git clone https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh.git
cd Assignment-4-WEB-AyushKumarSingh
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MONGO_URI, JWT_SECRET, etc.
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

### Admin Provisioning
```bash
cd backend
# Set ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME in .env
npm run seed:admin
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random secret for JWT signing |
| `JWT_EXPIRES_IN` | Token validity (default: 7d) |
| `CLIENT_URL` | Frontend origin for CORS |
| `ADMIN_EMAIL` | Email for initial admin (seed script only) |
| `ADMIN_PASSWORD` | Password for initial admin (seed script only) |
| `ADMIN_NAME` | Name for initial admin (seed script only) |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

## API Reference

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/health` | Health check | Public |
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Current user info | Authenticated |
| GET | `/api/employees` | List employees (with pagination, search, filter) | Admin + User |
| GET | `/api/employees/stats` | Dashboard statistics | Admin |
| GET | `/api/employees/:id` | Get employee by ID | Admin + User |
| POST | `/api/employees` | Create employee | Admin |
| PUT | `/api/employees/:id` | Update employee | Admin |
| DELETE | `/api/employees/:id` | Delete employee | Admin |

### Query Parameters for `GET /api/employees`

| Parameter | Description |
|---|---|
| `search` | Filter by name, email, or designation (case-insensitive) |
| `department` | Filter by exact department name |
| `page` | Page number (default: 1) |
| `limit` | Records per page (default: 10, max: 100) |

## Role Permissions

| Feature | Admin | User |
|---|---|---|
| Register | — | ✓ |
| Login | ✓ | ✓ |
| View employee directory | ✓ | ✓ |
| View employee details | ✓ | ✓ |
| View salary | ✓ | ✗ |
| Add employee | ✓ | ✗ |
| Edit employee | ✓ | ✗ |
| Delete employee | ✓ | ✗ |
| Dashboard statistics | ✓ | ✗ |

**Note:** Role restrictions are enforced on the backend. The backend returns salary fields only to admin-authenticated requests. Frontend does not merely hide controls — the API rejects unauthorized mutations with HTTP 403.

## GitHub Development Workflow

Issues were created before development began. Each feature was implemented on a dedicated branch and integrated through a pull request with a written self-review.

| PR | Issue | Branch | Purpose |
|---|---|---|---|
| [PR #9](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/pull/9) | [#1](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/issues/1) | `feature/project-foundation` | Repo setup, initial structure, health endpoint |
| [PR #10](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/pull/10) | [#2](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/issues/2) | `feature/backend-models` | MongoDB, Employee schema, express-validator |
| [PR #11](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/pull/11) | [#3](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/issues/3) | `feature/authentication` | Auth endpoints, JWT, bcrypt, middleware, seed script |
| [PR #12](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/pull/12) | [#4](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/issues/4) | `feature/employee-crud` | Employee REST API, search/filter, pagination, salary privacy |
| [PR #13](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/pull/13) | [#5](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/issues/5) | `feature/frontend-auth` | React app, AuthContext, login, register, protected layout |
| [PR #14](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/pull/14) | [#6](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/issues/6) | `feature/employee-interface` | Employee UI, debounced search, form, detail, admin dashboard |
| [PR #15](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/pull/15) | [#7](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/issues/7) | `test/quality-assurance` | Unified 23-test suite, refactoring, architecture docs |
| [PR #16](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/pull/16) | [#8](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/issues/8) | `chore/deployment` | Deployment config, runbook, final submission package |

Since this is a solo submission, all PRs were reviewed as a self-review. No artificial external approvals were introduced.

## Screenshots

> Screenshots will be added after deployment is complete.

## Deployment

| Environment | URL |
|---|---|
| Frontend (Vercel) | https://employee-management-aks.vercel.app |
| Backend API | https://employee-management-backend-aks.onrender.com (or local/configured host) |

## Testing

Backend tests use Jest and Supertest. They cover:
- Health endpoint
- User registration (success, duplicate, invalid input)
- Login (success, wrong password, unknown email)
- Authenticated route protection
- Employee CRUD (admin and user roles)
- Authorization enforcement
- ObjectId validation

Run tests:
```bash
cd backend && npm test
```

## Limitations

- Admin provisioning requires manual execution of the seed script with appropriate environment variables set.
- The application does not yet support file uploads (e.g. profile photos).
- Email uniqueness is enforced at the database level; no duplicate-checking UI feedback beyond the server error response.
