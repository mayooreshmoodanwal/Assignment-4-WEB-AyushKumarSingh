# Architecture

## Overview

The application follows a classic three-tier web architecture: a React single-page application communicates with an Express REST API, which reads and writes to MongoDB Atlas.

## Frontend Architecture

```
Request Flow:
User Interaction → React Component → Service Layer → Axios Client → Backend API
                                   ↑
                           AuthContext (shared state)
```

### Layers

| Layer | Location | Responsibility |
|---|---|---|
| Pages | `src/pages/` | Route-level components; orchestrate data fetching and page layout |
| Components | `src/components/` | Reusable UI: layout wrappers, forms, route guards |
| Context | `src/context/` | `AuthContext` — holds authenticated user, exposes login/logout/register |
| Services | `src/services/` | HTTP functions using Axios; no UI logic |
| Hooks | `src/hooks/` | `useDebounce` — pure timing utility |
| Styles | `src/styles/` | Single CSS file using custom properties |

### Authentication Flow (Frontend)

1. On app load, `AuthProvider` reads `localStorage` for a token.
2. If a token exists, `GET /api/auth/me` is called to rehydrate the user object.
3. On 401 responses, the Axios interceptor clears the token and redirects to `/login`.
4. `ProtectedRoute` renders children only when the user is authenticated. `adminOnly` prop redirects non-admins.

### Salary Privacy

Salary data is excluded from API responses for non-admin users. The frontend conditionally renders salary columns and fields only when `user.role === 'admin'`, consistent with what the API returns.

## Backend Architecture

```
Request → Route → Middleware (auth, validate) → Controller → Service/Model → MongoDB → Response
```

### Layers

| Layer | Location | Responsibility |
|---|---|---|
| Routes | `src/routes/` | Declare HTTP method + path + middleware chain |
| Middleware | `src/middleware/` | `authenticateUser`, `requireAdmin`, `handleValidation`, `errorHandler` |
| Controllers | `src/controllers/` | Parse request, delegate to model/service, format response |
| Models | `src/models/` | Mongoose schemas with built-in validation |
| Validators | `src/validators/` | `express-validator` rule sets |
| Config | `src/config/` | Database connection, environment validation |
| Utils | `src/utils/` | `generateToken`, `isValidObjectId` |
| Scripts | `src/scripts/` | `seedAdmin.js` — one-time admin provisioning |

## Database Models

### User

| Field | Type | Constraints |
|---|---|---|
| name | String | required, min 2 chars |
| email | String | required, unique, lowercase |
| password | String | required, min 8 chars, hashed, excluded from default select |
| role | String | enum: `user`, `admin`; default: `user` |
| createdAt | Date | auto (timestamps) |
| updatedAt | Date | auto (timestamps) |

### Employee

| Field | Type | Constraints |
|---|---|---|
| name | String | required, min 2 chars |
| email | String | required, unique, lowercase |
| department | String | required |
| designation | String | required |
| salary | Number | required, min 0 |
| joiningDate | Date | required |
| createdAt | Date | auto (timestamps) |
| updatedAt | Date | auto (timestamps) |

## Authentication

- Passwords hashed with bcrypt (cost factor 12)
- JWT signed with `JWT_SECRET`; default expiry 7 days
- Token sent as `Authorization: Bearer <token>` header
- `authenticateUser` middleware verifies signature, loads user from DB
- `requireAdmin` middleware checks `user.role === 'admin'`
- Expired/malformed tokens receive 401 with a clear error message
- Token storage: `localStorage` (acceptable for an assignment; production apps may prefer `httpOnly` cookies)

## Authorization

| Route | Middleware |
|---|---|
| `GET /api/employees` | `authenticateUser` |
| `GET /api/employees/:id` | `authenticateUser` |
| `POST /api/employees` | `authenticateUser`, `requireAdmin` |
| `PUT /api/employees/:id` | `authenticateUser`, `requireAdmin` |
| `DELETE /api/employees/:id` | `authenticateUser`, `requireAdmin` |
| `GET /api/employees/stats` | `authenticateUser`, `requireAdmin` |

## Environment Configuration

Sensitive values are read from environment variables at startup. `validateEnv.js` throws on startup if required variables are missing, preventing a misconfigured server from silently accepting requests.

## Key Design Decisions

1. **Salary privacy**: The `GET /api/employees` and `GET /api/employees/:id` controllers use Mongoose field selection to exclude `salary` for non-admin users at the database query level.
2. **No mock data**: All statistics and listings are derived from live database queries.
3. **Centralized error handling**: A single `errorHandler` middleware translates Mongoose errors, duplicate-key errors, and CastErrors into consistent JSON responses.
4. **Admin provisioning**: Admins cannot be created through the public registration endpoint. The `seedAdmin.js` script requires `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME` to be set in the environment before execution.
