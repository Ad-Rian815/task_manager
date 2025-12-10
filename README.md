Task Manager

A simple full-stack task management application built with React, Express, and SQLite.

Features

User authentication (register & login)

Create, read, update, delete tasks

Filter tasks by status: all, pending, completed

JWT-based session management

Responsive UI with Tailwind CSS

Project Structure
.
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/          # Login, Register, TasksPage
│   │   ├── components/     # TaskForm, TaskList
│   │   ├── api/            # API client
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── package.json
├── server/                 # Express backend
│   ├── models/             # Sequelize models (User, Task)
│   ├── routes/             # Auth, Tasks endpoints
│   ├── middleware/         # JWT authentication
│   ├── app.js
│   ├── .env                # Environment variables
│   └── package.json
└── package.json            # Root scripts

Setup Instructions
1. Prerequisites

Node.js 16+ and npm

2. Install Dependencies

From the project root:

npm run install-all


This will install dependencies for both server and client.

3. Configure Environment Variables

Copy the example file:

cp server/.env.example server/.env


Update the values if needed:

JWT_SECRET=your_secret_key
PORT=4000
DATABASE_FILE=./models/dev.sqlite
NODE_ENV=development

4. Initialize the Database
npm run init-db


Creates SQLite database at server/models/dev.sqlite

Initializes users and tasks tables

Running the Project
Start Both Servers

From the project root (or separate terminals):

cd server
npm start

cd client
npm run dev


✅ Server: http://localhost:4000
 (Express API)
✅ Client: http://localhost:3000
 (React app)

Open http://localhost:3000 in your browser to use the Task Manager.

Optional: Run Only Server or Client

Server only:

npm run server:dev


Client only:

npm run client:dev

Production Build (Frontend)
npm run client:build
npm run client:preview


Output: client/dist/

Can be served with any static server

API Endpoints
Authentication

POST /api/auth/register – Create new user

Body: { email, password, name? }

Response: { token, user }

POST /api/auth/login – Login user

Body: { email, password }

Response: { token, user }

Tasks (Requires Authentication)

GET /api/tasks?filter=all|pending|completed – List tasks

POST /api/tasks – Create task ({ title, description? })

PUT /api/tasks/:id – Update task ({ title?, description?, completed? })

DELETE /api/tasks/:id – Delete task

Include JWT in Authorization: Bearer <token> header for all task routes.

Troubleshooting

Port 4000 is in use: change PORT in server/.env

Client cannot connect to API: ensure server is running

Database errors: delete server/models/dev.sqlite and re-run npm run init-db

Technologies

Frontend: React 18, TypeScript, Vite, Tailwind CSS

Backend: Express, Sequelize, SQLite, JWT, bcrypt

Build Tools: Vite, PostCSS, Autoprefixer