import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from typing import Optional, List
from datetime import datetime, date
from supabase import create_client, Client
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("VITE_SUPABASE_API")
if not GROQ_API_KEY:
    print(" Warning: GROQ_API_KEY not found in .env file")
if not SUPABASE_URL or not SUPABASE_API_KEY:
    print(" Warning: Supabase credentials not found in .env file")
try:
    groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None
    print(" Groq client initialized")
except Exception as e:
    print(f"Groq initialization failed: {e}")
    groq_client = None

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_API_KEY) if SUPABASE_URL and SUPABASE_API_KEY else None
    print(" Supabase client initialized")
except Exception as e:
    print(f" Supabase initialization failed: {e}")
    supabase = None

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "Doing"
    date_logged: Optional[date] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class SummaryRequest(BaseModel):
    user_id: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
def get_user_tasks_supabase(user_id: str, start_date: date = None, end_date: date = None):
    """Fetch tasks from Supabase"""
    try:
        query = supabase.table("tasks").select("*").eq("user_id", user_id)
        
        if start_date:
            query = query.gte("date_logged", start_date.isoformat())
        if end_date:
            query = query.lte("date_logged", end_date.isoformat())
        
        response = query.order("date_logged", desc=True).execute()
        return response.data
    except Exception as e:
        print(f"Supabase query error: {e}")
        return []
@app.get("/")
async def root():
    return {
        "message": "AI Task Management API is running",
        "status": "online",
        "services": {
            "groq": groq_client is not None,
            "supabase": supabase is not None
        }
    }

@app.get("/api/tasks")
async def get_tasks(user_id: str, start_date: Optional[date] = None, end_date: Optional[date] = None):
    """Get tasks for a specific user"""
    if not supabase:
        raise HTTPException(status_code=503, detail="Supabase client not initialized")
    
    try:
        tasks = get_user_tasks_supabase(user_id, start_date, end_date)
        return tasks
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/tasks")
async def create_task(task: TaskCreate, user_id: str):
    """Create a new task"""
    if not supabase:
        raise HTTPException(status_code=503, detail="Supabase client not initialized")
    
    try:
        task_data = {
            "user_id": user_id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "date_logged": task.date_logged.isoformat() if task.date_logged else date.today().isoformat()
        }
        
        response = supabase.table("tasks").insert(task_data).execute()
        return response.data[0] if response.data else {"message": "Task created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/tasks/{task_id}")
async def update_task(task_id: int, task_update: TaskUpdate, user_id: str):
    """Update a task"""
    if not supabase:
        raise HTTPException(status_code=503, detail="Supabase client not initialized")
    
    try:
        update_data = {k: v for k, v in task_update.dict().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        response = supabase.table("tasks").update(update_data).eq("id", task_id).eq("user_id", user_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Task not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: int, user_id: str):
    """Delete a task"""
    if not supabase:
        raise HTTPException(status_code=503, detail="Supabase client not initialized")
    
    try:
        response = supabase.table("tasks").delete().eq("id", task_id).eq("user_id", user_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Task not found")
        
        return {"message": "Task deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai-summary")
async def get_ai_summary(request: SummaryRequest):
    """Generate AI-powered summary using Groq"""
    if not groq_client:
        return {
            "summary": "AI service is not configured. Please check your GROQ_API_KEY",
            "insights": {"dones": [], "doing": [], "delayed": []},
            "recommendations": [{"title": "Setup Required", "text": "Add valid GROQ_API_KEY to .env file"}],
            "stats": {"total_tasks": 0, "completion_rate": 0, "delayed_count": 0}
        }
    
    if not supabase:
        return {
            "summary": "Database connection failed. Please check Supabase credentials.",
            "insights": {"dones": [], "doing": [], "delayed": []},
            "recommendations": [{"title": "Database Error", "text": "Check Supabase URL and API key"}],
            "stats": {"total_tasks": 0, "completion_rate": 0, "delayed_count": 0}
        }    
    try:
        tasks = get_user_tasks_supabase(request.user_id, request.start_date, request.end_date)        
        if not tasks:
            return {
                "summary": "No tasks found for the selected period. Start by creating your first task to get AI-powered insights!",
                "insights": {"dones": [], "doing": [], "delayed": []},
                "recommendations": [
                    {"title": "Get Started", "text": "Create your first task to begin tracking progress"},
                    {"title": "Pro Tip", "text": "Add detailed descriptions to get better AI insights"}
                ],
                "stats": {"total_tasks": 0, "completion_rate": 0, "delayed_count": 0}
            }        
        dones = [t for t in tasks if t.get('status') == 'Done']
        doing = [t for t in tasks if t.get('status') == 'Doing']
        delayed = [t for t in tasks if t.get('status') == 'Delayed']        
        task_context = f"""
        Task Analytics:
        Completed: {len(dones)} tasks
        In Progress: {len(doing)} tasks
        Delayed: {len(delayed)} tasks
        Total Tasks: {len(tasks)}
        Recent Accomplishments:
        {chr(10).join([f'  • {t["title"]}' for t in dones[:5]]) if dones else '  • No completed tasks yet'}
        
        Current Focus:
        {chr(10).join([f'  • {t["title"]}' for t in doing[:5]]) if doing else '  • No active tasks'}
        
        {' Delayed Items:' + chr(10).join([f'  • {t["title"]}' for t in delayed[:5]]) if delayed else ''}
        """        
        completion = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": """You are an expert productivity coach. Analyze task data and provide:
                
                1. **Key Wins** (2-3 sentences celebrating achievements)
                2. **Growth Areas** (1-2 sentences on what needs attention) 
                3. **Actionable Tips** (2-3 specific, practical recommendations)
                
                Be encouraging, specific, and data-driven. Use emojis sparingly for tone."""},
                {"role": "user", "content": task_context}
            ],
            temperature=0.7,
            max_tokens=600
        )
        ai_summary = completion.choices[0].message.content        
        recommendations = []
        if len(delayed) > 2:
            recommendations.append({
                "title": "Priority Action",
                "text": f"Address {len(delayed)} delayed tasks. Break them into smaller, 15-minute micro-tasks."
            })
        
        if len(dones) == 0 and len(tasks) > 0:
            recommendations.append({
                "title": "Build Momentum",
                "text": "Complete your easiest task first to build confidence and momentum."
            })
        
        if len(doing) > 5:
            recommendations.append({
                "title": "Limit WIP",
                "text": f"Too many active tasks ({len(doing)}). Focus on completing 2-3 before starting new ones."
            })
        
        if len(dones) > 5:
            recommendations.append({
                "title": "Great Progress!",
                "text": f"Completed {len(dones)} tasks! Celebrate wins and maintain this momentum."
            })
        
        if len(recommendations) == 0:
            recommendations.append({
                "title": "On Track",
                "text": "You're making steady progress. Keep up the good work!"
            })
        
        # Calculate stats
        completion_rate = round((len(dones) / len(tasks)) * 100) if tasks else 0
        
        return {
            "summary": ai_summary,
            "insights": {
                "dones": [t['title'] for t in dones],
                "doing": [t['title'] for t in doing],
                "delayed": [t['title'] for t in delayed]
            },
            "recommendations": recommendations,
            "stats": {
                "total_tasks": len(tasks),
                "completion_rate": completion_rate,
                "delayed_count": len(delayed),
                "productivity_score": min(100, completion_rate + (10 if len(dones) > 0 else 0))
            }
        }
        
    except Exception as e:
        print(f"Error generating AI summary: {e}")
        raise HTTPException(status_code=500, detail=f"AI summary generation failed: {str(e)}")

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """General chat with AI assistant"""
    if not groq_client:
        return {"response": "AI service unavailable. Please check GROQ_API_KEY configuration."}
    
    try:
        context = ""
        if supabase and request.user_id:
            tasks = get_user_tasks_supabase(request.user_id)
            if tasks:
                recent_tasks = [t['title'] for t in tasks[:3]]
                context = f"\n\nUser's recent tasks: {', '.join(recent_tasks)}"
        
        completion = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": f"You are a friendly productivity assistant. Help users manage tasks and stay productive.{context}"},
                {"role": "user", "content": request.message}
            ],
            temperature=0.7,
            max_tokens=1024
        )        
        return {
            "response": completion.choices[0].message.content,
            "status": "success"
        }
        
    except Exception as e:
        return {
            "response": f"Error: {str(e)}",
            "status": "error"
        }

if __name__ == "__main__":
    import uvicorn
    print("AI Task Management API")
    print("="*50)
    print(f"Server: http://0.0.0.0:8000")
    print(f"API Docs: http://localhost:8000/docs")
    print(f" Groq: {' Connected' if groq_client else ' Not configured'}")
    print(f" Supabase: {'Connected' if supabase else ' Not configured'}")
    print("="*50 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)