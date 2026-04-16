# TaskFlow — Kanban Task Board

A drag-and-drop task management board built with React, TypeScript, and Supabase.

Live demo: https://sanket-task-board.netlify.app/

## Features

- Drag and drop tasks across four columns: To Do, In Progress, In Review, Done
- Guest accounts via Supabase anonymous auth — no sign up required
- Tasks persist per user with Row Level Security enabled
- Priority badges (low, normal, high) and due date indicators
- Board stats showing total, completed, and overdue tasks

## Tech Stack

- React + TypeScript + Vite
- Supabase (Auth + PostgreSQL)
- @dnd-kit for drag and drop
- Deployed on Vercel

## Run Locally

```bash
git clone https://github.com/SanketJanger/ToDoList.git
cd ToDoList
npm install
```

Create a `.env` file:
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

```bash
npm run dev
```

## Database Schema

```sql
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'normal',
  due_date DATE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
