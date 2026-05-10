# Deployment Guide - TaskFlow

## Deploy to Render + Vercel (Free Tier)

### Prerequisites
- GitHub account
- Render account (https://render.com)
- Vercel account (https://vercel.com)
- Supabase project (free)
- Groq API key (free)

---

## Step 1: Prepare Database (Supabase)

1. Create project at [supabase.com](https://supabase.com)
2. Go to SQL Editor → New Query
3. Run the schema from README.md
4. Save your **Project URL** and **Anon Key** from Settings → API

---

## Step 2: Deploy Backend (Render)

1. Push code to GitHub
```bash
git push origin main
## Step 2: Deploy Backend (Render)

1. Go to Render → New + → Web Service
2. Connect GitHub → Select your repo
3. Configure:

| Setting | Value |
|---------|-------|
| Name | taskflow-backend |
| Environment | Node |
| Build Command | `cd backend && npm install` |
| Start Command | `cd backend && npm start` |

4. Add Environment Variables:

| Variable | Value |
|----------|-------|
| PORT | 5000 |
| JWT_SECRET | generate_random_string_32_chars |
| SUPABASE_URL | your_supabase_url |
| SUPABASE_ANON_KEY | your_supabase_anon_key |
| EMAIL_USER | your_email@gmail.com |
| EMAIL_PASS | your_gmail_app_password |

5. Click "Create Web Service"
6. Copy your backend URL (e.g., https://taskflow-backend.onrender.com)

---

## Step 3: Deploy AI Service (Render)

1. New + → Web Service (same repo)
2. Configure:

| Setting | Value |
|---------|-------|
| Name | taskflow-ai |
| Environment | Python |
| Build Command | `cd ai-service && pip install -r requirements.txt` |
| Start Command | `cd ai-service && uvicorn main:app --host 0.0.0.0 --port 8000` |

3. Add Environment Variables:

| Variable | Value |
|----------|-------|
| GROQ_API_KEY | your_groq_api_key |
| VITE_SUPABASE_URL | your_supabase_url |
| VITE_SUPABASE_API | your_supabase_anon_key |

4. Click "Create Web Service"
5. Copy your AI URL (e.g., https://taskflow-ai.onrender.com)

---

## Step 4: Deploy Frontend (Vercel)

1. Go to Vercel → Add New → Project
2. Import GitHub repository
3. Configure:

| Setting | Value |
|---------|-------|
| Framework Preset | Create React App |
| Root Directory | frontend |

4. Add Environment Variables:

| Variable | Value |
|----------|-------|
| VITE_API_URL | https://taskflow-backend.onrender.com |
| VITE_AI_API_URL | https://taskflow-ai.onrender.com |

5. Click "Deploy"
6. Copy your frontend URL (e.g., https://taskflow.vercel.app)

---

## Done

Your app is live at:

| Service | URL |
|---------|-----|
| Frontend | https://taskflow.vercel.app |
| Backend API | https://taskflow-backend.onrender.com |
| AI Service | https://taskflow-ai.onrender.com |