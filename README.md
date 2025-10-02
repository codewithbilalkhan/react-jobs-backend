# React Jobs API

Express.js backend API for the React Jobs application.

## API Endpoints

### Base URL: `http://localhost:8000/api`

### Jobs Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Get all jobs |
| GET | `/api/jobs/:id` | Get single job by ID |
| POST | `/api/jobs` | Create new job |
| PUT | `/api/jobs/:id` | Update existing job |
| DELETE | `/api/jobs/:id` | Delete job |
| GET | `/api/health` | Health check |

### Example Requests

#### Get All Jobs
```
GET /api/jobs
```

#### Get Single Job
```
GET /api/jobs/1
```

#### Create New Job
```
POST /api/jobs
Content-Type: application/json

{
  "title": "Senior React Developer",
  "type": "Full-Time",
  "description": "We are seeking a talented Front-End Developer...",
  "location": "Boston, MA",
  "salary": "$70K - $80K",
  "company": {
    "name": "NewTek Solutions",
    "description": "NewTek Solutions is a leading technology company...",
    "contactEmail": "contact@newteksolutions.com",
    "contactPhone": "555-555-5555"
  }
}
```

#### Update Job
```
PUT /api/jobs/1
Content-Type: application/json

{
  "title": "Updated Job Title",
  "type": "Full-Time",
  ...
}
```

#### Delete Job
```
DELETE /api/jobs/1
```

## Development

### Run the API server
```bash
# Using nodemon (auto-restart on changes)
npm run api:dev

# Using node (manual restart needed)
npm run api
```

### Run both frontend and backend
```bash
# Terminal 1: Start API server
npm run api:dev

# Terminal 2: Start React app
npm run dev
```

## Deployment

For deployment, you can:

1. **Heroku**: Deploy the Express app directly
2. **Vercel**: Use Vercel Functions
3. **Netlify**: Use Netlify Functions
4. **Railway**: Deploy the Express app
5. **Any VPS**: Deploy using PM2 or Docker

### Environment Variables

For production, set:
- `PORT`: Server port (default: 8000)
- `NODE_ENV`: Set to "production"

## Data Storage

Currently uses the local `src/jobs.json` file. For production, consider:
- MongoDB
- PostgreSQL
- MySQL
- Any cloud database