# Server (Node + Express + SQLite)

Install:
  cd server
  npm install

Environment:
  copy .env.example -> .env and edit if needed

Initialize DB (optional):
  npm run init-db

Run:
  npm run dev    # with nodemon
  npm start      # production

API endpoints:
  POST /api/auth/register  {email, password, name?}
  POST /api/auth/login     {email, password}
  GET  /api/tasks?filter=all|completed|pending   (Authorization: Bearer <token>)
  POST /api/tasks
  PUT  /api/tasks/:id
  DELETE /api/tasks/:id
