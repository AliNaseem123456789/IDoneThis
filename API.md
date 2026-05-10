# API Documentation - iDoneThis Clone

## Base URLs

| Service | URL |
|---------|-----|
| Backend API | `http://localhost:5000` |
| AI Service | `http://localhost:8000` |

## Authentication

All protected endpoints require JWT token in Authorization header:


## REST Endpoints

### Authentication Routes (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | User registration | No |
| POST | `/auth/login` | User login | No |
| GET | `/auth/me` | Get current user | Yes |

### Task Routes (`/tasks`)

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/tasks` | Get tasks | `?date=YYYY-MM-DD` or `?month=YYYY-MM` or `?start=&end=` |
| POST | `/tasks` | Create task | - |
| PUT | `/tasks/:id` | Update task | - |
| DELETE | `/tasks/:id` | Delete task | - |

### Email/Reminder Routes (`/email`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/email/send-reminder` | Send immediate reminder |
| POST | `/email/set-reminder` | Create/update reminder schedule |
| GET | `/email/my-reminders` | Get user's reminders |
| PUT | `/email/reminders/:id/toggle` | Toggle reminder active status |

### AI Service Routes (Port 8000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | AI chat assistant |
| POST | `/api/ai-summary` | Generate productivity insights |
| GET | `/api/tasks` | Fetch tasks for analysis |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## Request/Response Examples

### Signup

**Request:**
```json
POST /auth/signup
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```
**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```
### Login
**Request:**
```json
POST /auth/login
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Get Tasks
**Request:**
```json
GET /tasks?date=2024-01-15
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write API docs",
    "status": "Done",
    "date_logged": "2024-01-15"
  }
]
```

### Create Task
**Request:**
```json
POST /tasks
Authorization: Bearer <token>
{
  "title": "Fix login bug",
  "description": "Resolve JWT issue",
  "status": "Doing",
  "date_logged": "2024-01-15"
}
```
**Response:**
```json
{
  "id": 2,
  "user_id": "uuid",
  "title": "Fix login bug",
  "description": "Resolve JWT issue",
  "status": "Doing",
  "date_logged": "2024-01-15"
}
```
### Update Task
**Request:**
```json
PUT /tasks/2
Authorization: Bearer <token>
{
  "title": "Updated title",
  "status": "Done"
}
```
**Response:**
```json
{
  "id": 2,
  "title": "Updated title",
  "status": "Done",
  "updated_at": "2024-01-15T14:30:00Z"
}
```
### Delete Task
**Request:**
```json
DELETE /tasks/2
Authorization: Bearer <token>
```
**Response:**
```json
{
  "message": "Task deleted successfully"
}
```
### Set Reminder

**Request:**
```json
POST /email/set-reminder
Authorization: Bearer <token>
{
  "type": "reminder",
  "time": "09:00 AM",
  "days": ["Mon", "Wed", "Fri"],
  "delivery_method": ["email"]
}
```
**Response:**
```json
{
  "id": 1,
  "type": "reminder",
  "time": "09:00 AM",
  "days": ["Mon", "Wed", "Fri"],
  "is_active": true
}
```
### Get My Reminders

**Request:**
```json
GET /email/my-reminders
Authorization: Bearer <token>
```
**Response:**
```json
[
  {
    "id": 1,
    "type": "reminder",
    "time": "09:00 AM",
    "days": ["Mon", "Wed", "Fri"],
    "delivery_method": ["email"],
    "is_active": true
  }
]
```
### AI Chat

**Request:**
```json
POST /api/chat
{
  "message": "How can I be more productive?",
  "user_id": "uuid"
}
```
**Response:**
```json
{
  "response": "Here are some productivity tips based on your task history...",
  "suggested_actions": ["Break down large tasks", "Set specific deadlines"]
}
```
### AI Summary

**Request:**
```json
POST /api/ai-summary
{
  "user_id": "uuid",
  "date_range": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  }
}
```
**Response:**
```json
{
  "summary": "Great progress this week! You've completed 12 out of 15 tasks.",
  "insights": {
    "dones": ["Write documentation", "Fix login bug"],
    "doing": ["Design homepage"],
    "delayed": ["Integration testing"]
  },
  "recommendations": [
    {
      "title": "Priority Action",
      "text": "Address your delayed task"
    }
  ],
  "stats": {
    "total_tasks": 15,
    "completion_rate": 80,
    "delayed_count": 1,
    "productivity_score": 85
  }
}
```
