# Task Manager Web App

A modern, full-stack task management application built with React and Supabase.

## 🚀 Features

- ✅ Create, read, update, and delete tasks
- ✅ Task status tracking (To Do, In Progress, Done)
- ✅ Due date management
- ✅ Beautiful, responsive UI with TailwindCSS
- ✅ Real-time database with Supabase
- ✅ TypeScript for type safety

## 🛠️ Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- TailwindCSS
- Supabase Client

**Backend:**
- Supabase (PostgreSQL database + auto-generated REST API)

## 📋 Prerequisites

- Node.js 20.19+ (or 22.12+)
- A Supabase account (free tier available)

## 🔧 Setup Instructions

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd task-manager-webapp
\`\`\`

### 2. Set Up Supabase

Follow the detailed instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
1. Create a Supabase project
2. Create the tasks table
3. Get your credentials

### 3. Configure Environment Variables

\`\`\`bash
cd frontend
cp .env.example .env.local
\`\`\`

Edit `.env.local` and add your Supabase credentials:

\`\`\`env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 4. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 5. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

\`\`\`
task-manager-webapp/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── taskApi.ts          # API client for tasks
│   │   ├── components/
│   │   │   └── TaskList.tsx        # Main task list component
│   │   ├── lib/
│   │   │   └── supabaseClient.ts   # Supabase configuration
│   │   ├── types/
│   │   │   └── Task.ts             # TypeScript types
│   │   ├── App.tsx                 # Main app component
│   │   └── index.css               # Global styles
│   ├── .env.example                # Environment variables template
│   └── package.json
├── SUPABASE_SETUP.md               # Supabase setup guide
└── README.md
\`\`\`

## 🎨 Features Overview

### Task Management
- **Create**: Add new tasks with title, description, status, and due date
- **Read**: View all tasks in a beautiful card layout
- **Update**: Edit existing tasks
- **Delete**: Remove tasks with confirmation

### Task Properties
- **Title** (required, max 100 characters)
- **Description** (optional, max 500 characters)
- **Status**: TODO, IN_PROGRESS, or DONE
- **Due Date** (optional)

## 🔒 Security

The app uses Supabase Row Level Security (RLS) policies. The current setup allows all operations for development purposes. For production, you should implement proper authentication and authorization.

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
