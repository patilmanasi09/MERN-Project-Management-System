# Project Management System

A full-stack, role-based project management system: admins, HODs, and
regular users each get a different view of the same workspace for creating
and tracking projects, assigning tasks, and managing accounts.

```
pms/
  PME-Frontend/     React + Vite frontend
  PMS-Backend/    Node.js/Express + MongoDB API
```

## Tech stack

**Frontend** — React 18, Vite, Redux Toolkit, React Router v6, Axios,
Bootstrap + a custom design system (ink/teal palette, Space Grotesk / Inter
/ JetBrains Mono), react-icons, react-toastify.

**Backend** — Node.js, Express, MongoDB/Mongoose, JWT auth, bcryptjs, Multer.

## Getting started

### 1. Backend

```bash
cd PMS-Backend
npm install
```

Create `PMS-Backend/.env`:

```
PORT = 5004
MONGO_URL = mongodb://localhost:27017/projectmgmt
SECRET_KEY = <any long random string>
```

```bash
node server.js
```

MongoDB must be running locally (or point `MONGO_URL` at Atlas). On startup
the server also auto-cleans a legacy stale index on `taskassignments` (see
`PMS-Backend/config/db.js`) — safe to leave in place, it no-ops once resolved.

### 2. Frontend

```bash
cd PMS-Frontend
npm install
npm run dev
```

The PMS-Frontend expects the backend at `http://localhost:5004`
(`PMS-Frontend/src/api/axiosInstance.js`) — update that file if your backend runs
elsewhere.

## Roles

Stored on the `User` model as `"user"`, `"HOD"`, or `"admin"` (note the
capitalization). New registrations always get `"user"`; promote someone via
`PUT /user/updateUser/:ID` (admin only) or directly in the database.

| Page | admin | HOD | user |
|---|---|---|---|
| Dashboard | ✅ | ✅ | ✅ |
| Projects | ✅ | ✅ | ✅ |
| Create Project | ✅ | ✅ | ❌ |
| Assign Task | ✅ | ✅ | ❌ |
| My Tasks | ✅ | ✅ | ✅ |
| Users | ✅ | ❌ | ❌ |
| Departments | ✅ | ❌ | ❌ |
| Profile | ✅ | ✅ | ✅ |

Restricted pages are guarded twice on the frontend — hidden from the sidebar
*and* redirected via `RoleRoute` if the URL is typed directly — and enforced
server-side by `middleware/auth.js`'s `admin`/`hod` checks.

## Features

- Auth (login/register/JWT), session rehydrated on refresh
- Projects: create, list, edit (incl. status), delete
- Task assignment: admin/HOD create + assign a task to a user in one step;
  the assignee accepts/declines/completes it under "My Tasks"
- Users & Departments: admin-only management
- Profile: edit your own details, change password

## API overview

All routes except `/user/register` and `/user/login` require
`Authorization: Bearer <token>`.

### `/user`
| Method | Path | Access |
|---|---|---|
| POST | `/register` | public |
| POST | `/login` | public |
| GET | `/getUserInfo` | any logged-in user |
| PUT | `/updateProfile` | self |
| PUT | `/updateUser/:ID` | admin |
| PUT | `/changePassword` | self |
| GET | `/getAllUsers` | any logged-in user |
| GET | `/totalNumberOfUsers` | any logged-in user |

### `/project`
| Method | Path | Access |
|---|---|---|
| POST | `/create` | admin, HOD |
| GET | `/getAll`, `/getproject/:ID` | any logged-in user |
| PATCH | `/updateStatus/:ID` | admin, HOD |
| PUT | `/updateproject/:ID` | admin, HOD |
| DELETE | `/delete/:ID` | admin |
| GET | totals/status/month variants | any logged-in user |

Project `status` enum: `Pending`, `In-progress`, `Completed`.
Project `department` enum: `HR`, `Information Technology`, `Development`,
`Finance`, `Cloud`.

### `/tasks`
| Method | Path | Access |
|---|---|---|
| POST | `/create` | any logged-in user |
| GET | `/getAll`, `/getTask/:ID`, `/getTasksByProject/:PROJECT_ID` | any logged-in user |
| PATCH | `/updateStatus/:ID`, `/updateTask/:ID` | any logged-in user |
| DELETE | `/delete/:ID` | any logged-in user |
| GET | totals/status/month variants | any logged-in user |

### `/assign`
| Method | Path | Access |
|---|---|---|
| POST | `/assignTask` | any logged-in user |
| GET | `/getAllAssignments` | any logged-in user |
| PATCH | `/updateAssignmentStatus/:ID` | any logged-in user |

Assignment `status` enum: `Assigned`, `Accepted`, `Rejected`, `Completed`.

### `/department`
| Method | Path | Access |
|---|---|---|
| POST | `/create` | admin |
| GET | `/getAll` | any logged-in user |
| PUT | `/update/:ID` | admin |
| DELETE | `/delete/:ID` | admin |

### `/roleRequest`
| Method | Path | Access |
|---|---|---|
| POST | `/applyHOD` | any logged-in user |
| GET | `/getAllRequests` | admin |
| PATCH | `/approve/:ID`, `/reject/:ID` | admin |


