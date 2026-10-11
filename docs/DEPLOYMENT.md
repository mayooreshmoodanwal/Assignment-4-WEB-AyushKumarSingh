# Deployment Guide

## Overview

| Service | Platform | Purpose |
|---|---|---|
| Frontend | Vercel | React SPA |
| Backend | Render or Railway | Express REST API |
| Database | MongoDB Atlas | Persistent data store |

## MongoDB Atlas

1. Create a cluster on [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a database user with read/write access
3. Add the backend host IP to the IP allow list (or allow all for testing: `0.0.0.0/0`)
4. Copy the connection string and set as `MONGO_URI` in the backend environment

## Backend (Render)

1. Connect GitHub repository to Render
2. Create a new **Web Service**
3. Set:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `node src/server.js`
4. Add environment variables in Render's dashboard:
   - `PORT=10000`
   - `NODE_ENV=production`
   - `MONGO_URI=<Atlas connection string>`
   - `JWT_SECRET=<long random secret>`
   - `JWT_EXPIRES_IN=7d`
   - `CLIENT_URL=<Vercel frontend URL>`
5. After deployment, run admin provisioning:
   ```bash
   MONGO_URI=<prod URI> ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=<secure> ADMIN_NAME="Admin" npm run seed:admin
   ```

## Frontend (Vercel)

1. Import the GitHub repository on [Vercel](https://vercel.com)
2. Set:
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add environment variable:
   - `VITE_API_URL=<Render backend URL>/api`
4. Add a `vercel.json` in the `frontend/` directory for SPA routing:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
5. Deploy

## CORS Configuration

The backend's `CLIENT_URL` environment variable must match exactly the Vercel deployment URL (e.g. `https://your-app.vercel.app`). Trailing slashes or mismatches will cause CORS errors.

## Production Verification Checklist

- [ ] Backend health endpoint responds: `GET <backend-url>/api/health`
- [ ] Frontend loads at Vercel URL
- [ ] Frontend can reach backend (no CORS errors in browser console)
- [ ] User registration works
- [ ] User login works
- [ ] Admin login works
- [ ] Admin can add, edit, delete employees
- [ ] Regular user cannot add/edit/delete via direct API call (returns 403)
- [ ] Salary is not exposed to non-admin users in API response

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| CORS error on frontend | `CLIENT_URL` mismatch | Update `CLIENT_URL` env var on backend to match Vercel URL |
| 500 on backend start | Missing env vars | Check all required env vars are set |
| MongoDB connection refused | IP not allowed | Add backend host IP to Atlas allow list |
| SPA 404 on refresh | Missing Vercel rewrite | Ensure `vercel.json` rewrite rule is present |
| Admin cannot log in | Seed script not run | Run `npm run seed:admin` with correct env vars |
