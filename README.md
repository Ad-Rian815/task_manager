# Task Manager

A simple full-stack task management application built with **React**, **Express**, and **SQLite**.

---

## Features

- User authentication (register & login)
- Create, read, update, delete tasks
- Filter tasks by status: **all**, **pending**, **completed**
- JWT-based session management
- Responsive UI with **Tailwind CSS**

---

## Project Structure

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

---

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm

---

### Install Dependencies

From project root:

```bash
npm run install-all
This installs dependencies for both server and client.

3. Configure Environment Variables

Copy the example file:

cp server/.env.example server/.env


Update the values if needed:

JWT_SECRET=your_secret_key
PORT=4000
DATABASE_FILE=./models/dev.sqlite
NODE_ENV=development