 make one file for this .md
markdown
# Testing Guide - TaskFlow

## Test Structure


```text
tests/
├── backend/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── frontend/
│   ├── unit/
│   └── integration/
└── ai-service/
    ├── unit/
    └── integration/
```
---

## Backend Testing (Node.js)

### Setup

```bash
cd backend
npm install --save-dev jest supertest
```
### Package.json Scripts
```bash
json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```
## Example Test
### tests/auth.test.js
```bash
javascript
const request = require('supertest');
const app = require('../server');

describe('Authentication', () => {
  test('POST /auth/signup - creates user', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /auth/login - returns token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
```
### Run Tests
```bash
npm test                 # Run all tests
npm run test:coverage    # With coverage report
```
## Frontend Testing (React)
### Setup
```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```
## Example Test
### tests/TaskList.test.jsx
```bash
import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from '../components/TaskList';

describe('TaskList', () => {
  test('renders tasks', () => {
    const tasks = [
      { id: 1, title: 'Test Task', status: 'Done' }
    ];
    
    render(<TaskList tasks={tasks} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  test('calls onDelete when delete clicked', () => {
    const mockDelete = jest.fn();
    render(<TaskList tasks={[{ id: 1, title: 'Task' }]} onDelete={mockDelete} />);
    
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(mockDelete).toHaveBeenCalledWith(1);
  });
});
```
## Run Tests
```bash
npm test                 # Run tests
npm run test:coverage    # Coverage report
```
## AI Service Testing (Python)
### Setup
``` bash
cd ai-service
pip install pytest pytest-asyncio httpx
```
## Example Test
### tests/test_ai.py
```bash
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_chat_endpoint():
    response = client.post("/api/chat", json={
        "message": "Hello",
        "user_id": "test-user"
    })
    assert response.status_code == 200
    assert "response" in response.json()

def test_ai_summary():
    response = client.post("/api/ai-summary", json={
        "user_id": "test-user",
        "timeframe": "week"
    })
    assert response.status_code == 200
    assert "summary" in response.json()
```
## Run Tests
```bash
pytest                    # Run all tests
pytest -v                 # Verbose output
pytest --cov=.            # Coverage report
```
## E2E Testing (Playwright)
## Setup
```bash
npm install --save-dev @playwright/test
npx playwright install
```
## Example Test
### e2e/login.spec.js
```bash
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.fill('input[type="email"]', 'demo@taskflow.com');
  await page.fill('input[type="password"]', 'demo123');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL(/.*dashboard/);
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

## Run E2E Tests
``` bash
npx playwright test              # Run all E2E tests
npx playwright test --headed     # With browser UI

```