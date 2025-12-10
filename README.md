# Task Manager

A full-stack task management application built with React, Express, and SQLite.

## Features

- User authentication (register, login)
- Create, read, update, delete tasks
- Filter tasks by status (all, pending, completed)
- JWT-based session management
- Responsive UI with Tailwind CSS

## Project Structure

```
.
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── pages/         # Login, Register, TasksPage
│   │   ├── components/    # TaskForm, TaskList
│   │   ├── api/           # API client
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── server/                # Express backend
│   ├── models/            # Sequelize models (User, Task)
│   ├── routes/            # Auth, Tasks endpoints
│   ├── middleware/        # JWT authentication
│   ├── app.js
│   ├── .env               # Environment variables
│   └── package.json
└── package.json           # Root package.json with scripts
```

## Setup

### Prerequisites

- Node.js 16+ and npm

### Installation

1. **Clone and install dependencies:**

```bash
npm run install-all
```

2. **Initialize the database:**

```bash
npm run init-db
```

This creates the SQLite database at `server/models/dev.sqlite` and initializes the User and Task tables.

3. **Configure environment variables:**

Copy `server/.env.example` to `server/.env` and update values if needed:

```bash
JWT_SECRET=your_secret_key_change_in_production
PORT=4000
DATABASE_FILE=./models/dev.sqlite
NODE_ENV=development
```

## Running

```
cd server
npm start

cd client
npm run dev
```

This will start:
- **Server** on `http://localhost:4000`
- **Client** on `http://localhost:3000`

### Server Only

```bash
npm run server:dev
```

Uses `nodemon` for hot-reload. Logs requests and errors to console.

### Client Only

```bash
npm run client:dev
```

Vite dev server with hot-module reload on `http://localhost:3000`.


## API Endpoints

### Authentication

- `POST /api/auth/register` – Create a new user
  - Body: `{ email, password, name? }`
  - Response: `{ token, user }`

- `POST /api/auth/login` – Authenticate user
  - Body: `{ email, password }`
  - Response: `{ token, user }`

### Tasks (requires authentication)

- `GET /api/tasks?filter=all|pending|completed` – List user's tasks
- `POST /api/tasks` – Create a task
  - Body: `{ title, description? }`
- `PUT /api/tasks/:id` – Update a task
  - Body: `{ title?, description?, completed? }`
- `DELETE /api/tasks/:id` – Delete a task

## Troubleshooting

### Port 4000 is in use

Kill the process on port 4000 or change `PORT` in `server/.env`.

### Client cannot connect to API

Ensure server is running on port 4000. The client uses Vite's proxy to forward `/api` requests to the server.

### Database errors

Delete `server/models/dev.sqlite` and re-run `npm run init-db` to reset the database.

## Technologies

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router
- **Backend:** Express, Sequelize, SQLite, JWT, bcrypt
- **Build:** Vite, PostCSS, Autoprefixer


Register an account, create tasks, and test it out.
