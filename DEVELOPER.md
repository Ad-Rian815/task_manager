# Developer Guide

Welcome to the Task Manager development environment. This guide covers architecture, code organization, and development workflows.

## Project Architecture

### Frontend Stack
- **React 18** – Component library
- **TypeScript** – Type safety
- **Vite** – Build tool and dev server
- **Tailwind CSS** – Utility-first styling
- **React Router** – Page navigation
- **Axios/Fetch** – HTTP requests

### Backend Stack
- **Express.js** – Web framework
- **Sequelize** – ORM (Object-Relational Mapping)
- **SQLite/PostgreSQL** – Database
- **JWT** – Authentication tokens
- **Bcrypt** – Password hashing
- **CORS** – Cross-origin resource sharing

### Database Schema

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  userId INTEGER NOT NULL,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

## Code Organization

### Client Structure

```
client/src/
├── main.tsx              # React entry point
├── App.tsx               # Root layout component
├── index.css             # Global styles (Tailwind)
├── api/
│   └── client.ts         # Fetch wrapper with auth
├── pages/
│   ├── Login.tsx         # /login route
│   ├── Register.tsx      # /register route
│   └── TasksPage.tsx     # /tasks route (main app)
└── components/
    ├── TaskForm.tsx      # Create task form
    └── TaskList.tsx      # Task list with edit/delete
```

**Key patterns:**
- Pages handle routing and state management
- Components are pure/presentational
- API client handles all HTTP requests
- Token stored in localStorage

### Server Structure

```
server/
├── app.js                # Express app setup
├── models/
│   ├── index.js          # Sequelize connection + associations
│   ├── user.js           # User model definition
│   └── task.js           # Task model definition
├── routes/
│   ├── auth.js           # POST /register, /login
│   └── tasks.js          # GET/POST/PUT/DELETE /tasks
├── middleware/
│   └── auth.js           # JWT verification middleware
└── .env                  # Configuration
```

**Key patterns:**
- Models define database schema
- Routes handle HTTP requests
- Middleware authenticates requests
- Error handling with try/catch

## Common Development Tasks

### Add a New API Endpoint

1. **Update the model** (if needed):
   ```javascript
   // server/models/task.js
   Task.findByStatus = async function(userId, status) {
     // custom query
   };
   ```

2. **Add the route**:
   ```javascript
   // server/routes/tasks.js
   router.get('/status/:status', authenticate, async (req, res) => {
     const { status } = req.params;
     const tasks = await Task.findByStatus(req.user.id, status);
     res.json(tasks);
   });
   ```

3. **Call from client**:
   ```typescript
   // client/src/api/client.ts
   const tasks = await apiFetch(`/tasks/status/${status}`);
   ```

### Add a New Page

1. **Create the component**:
   ```typescript
   // client/src/pages/NewPage.tsx
   export default function NewPage() {
     return <div>New Page</div>;
   }
   ```

2. **Add the route**:
   ```typescript
   // client/src/main.tsx
   <Route path="/newpage" element={<NewPage />} />
   ```

3. **Link to it**:
   ```typescript
   import { Link } from 'react-router-dom';
   <Link to="/newpage">Go to New Page</Link>
   ```

### Add Styling

Use **Tailwind CSS classes**:

```typescript
<div className="flex gap-4 p-6 bg-white rounded shadow">
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Click me
  </button>
</div>
```

For custom styles, edit `client/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
.btn-primary {
  @apply px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700;
}
```

### Add Input Validation

**Server-side (important!):**

```javascript
// server/routes/tasks.js
router.post('/', authenticate, async (req, res) => {
  const { title, description } = req.body;
  
  // Validate
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ message: 'Title must be a non-empty string' });
  }
  if (title.length > 255) {
    return res.status(400).json({ message: 'Title too long (max 255 chars)' });
  }
  if (description && typeof description !== 'string') {
    return res.status(400).json({ message: 'Description must be a string' });
  }
  
  // Create task...
});
```

**Client-side (UX):**

```typescript
const [title, setTitle] = useState('');
const [error, setError] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  
  if (!title.trim()) {
    setError('Title is required');
    return;
  }
  if (title.length > 255) {
    setError('Title too long');
    return;
  }
  
  // Submit...
};
```

## Testing

### Manual Testing

1. **Run full stack**:
   ```bash
   npm run dev
   ```

2. **Test auth flow**:
   - Register new user
   - Verify email is unique
   - Login with wrong password → error
   - Login with correct credentials → redirect to /tasks
   - Close browser, reopen → still logged in (token in localStorage)

3. **Test tasks**:
   - Create task
   - Check it appears in list
   - Toggle completion
   - Edit title
   - Delete task → gone from list

### Automated Testing (Optional)

Add Jest for unit tests:

```bash
npm install --save-dev jest @types/jest
```

Example test:

```typescript
// client/src/__tests__/api.test.ts
import { apiFetch } from '../api/client';

test('apiFetch includes auth token', async () => {
  localStorage.setItem('token', 'test-token');
  
  // Mock fetch
  global.fetch = jest.fn();
  
  await apiFetch('/tasks');
  
  const call = (global.fetch as jest.Mock).mock.calls[0];
  expect(call[1].headers.Authorization).toBe('Bearer test-token');
});
```

## Debugging

### Browser DevTools

1. **Network tab** – See API requests/responses
2. **Console tab** – View errors and logs
3. **React DevTools extension** – Inspect component props/state
4. **Redux DevTools** (if using Redux) – Track state changes

### Server Debugging

1. **Console logs**:
   ```javascript
   console.log('User:', req.user);
   console.error('Error:', err);
   ```

2. **VS Code debugger**:
   ```json
   // .vscode/launch.json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "node",
         "request": "launch",
         "program": "${workspaceFolder}/server/app.js",
         "restart": true,
         "console": "integratedTerminal"
       }
     ]
   }
   ```

3. **Database inspection**:
   ```bash
   sqlite3 server/models/dev.sqlite
   sqlite> .tables
   sqlite> SELECT * FROM users;
   ```

## Performance Tips

### Frontend
- **Lazy load components** – Use React.lazy() for route-based splitting
- **Memoize expensive computations** – useMemo, useCallback
- **Optimize images** – Compress, use modern formats (webp)
- **Minimize bundle** – Tree-shake unused code (Vite does this)

### Backend
- **Index database queries** – Add indexes on frequently queried fields
- **Cache responses** – Redis for session/query caching
- **Paginate lists** – Return 10-50 items, not all 10,000
- **Monitor slow queries** – Log query execution time

### Database
```javascript
// Add indexes to Task model
Task.addIndex({
  fields: ['userId'],
  name: 'idx_tasks_userId'
});
```

## Security Best Practices

✅ **Already implemented:**
- JWT tokens for stateless auth
- Password hashing with bcrypt
- CORS enabled
- Middleware validates tokens

⚠️ **To add:**
- Input validation on all endpoints
- Rate limiting (express-rate-limit)
- Helmet for HTTP headers
- SQL injection prevention (Sequelize ORM handles this)
- XSS prevention (React escapes by default)
- CSRF tokens for state-changing requests (optional)

Add security packages:

```bash
npm install helmet express-rate-limit
```

```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100  // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

## Git Workflow

### Branch naming:
```
feature/add-categories    # New feature
bugfix/fix-logout-bug     # Bug fix
refactor/update-api       # Refactoring
docs/update-readme        # Documentation
```

### Commit messages:
```
feat: Add task categories
fix: Fix logout not clearing token
refactor: Simplify API client
docs: Update deployment guide
```

### Example flow:
```bash
git checkout -b feature/add-task-categories
# Make changes
git add .
git commit -m "feat: Add task categories"
git push origin feature/add-task-categories
# Create pull request on GitHub
```

## Useful Commands

```bash
# Development
npm run dev              # Start server + client
npm run server:dev       # Server only (hot-reload)
npm run client:dev       # Client only (Vite)

# Database
npm run init-db          # Create/reset database

# Building
npm run client:build     # Production build
npm run client:preview   # Test production build locally

# Database inspection (SQLite)
sqlite3 server/models/dev.sqlite

# View server logs
npm run server:dev       # Logs appear in terminal

# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `JWT_SECRET` | `secret_dev` | Signing JWT tokens |
| `PORT` | `4000` | Server port |
| `NODE_ENV` | `development` | Environment |
| `DATABASE_FILE` | `./models/dev.sqlite` | SQLite path |
| `VITE_API_BASE` | `/api` | API base URL (client) |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Module not found | Delete `node_modules`, run `npm install` |
| TypeScript errors | Check `tsconfig.json`, ensure types installed |
| CORS errors | Check `server/app.js` CORS config, ensure API base correct |
| Auth token missing | Check localStorage in DevTools Application tab |
| Database locked | Kill process or delete `dev.sqlite` and re-init |
| Port in use | Change PORT in `.env` or kill process on that port |

## Resources

- [Express docs](https://expressjs.com/)
- [React docs](https://react.dev/)
- [Sequelize docs](https://sequelize.org/)
- [Tailwind CSS docs](https://tailwindcss.com/)
- [JWT explained](https://jwt.io/introduction)
- [REST API best practices](https://restfulapi.net/)

---

**Happy coding! 🚀**

Feel free to reach out with questions or improvements.
