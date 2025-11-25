import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import { Auth } from './components/Auth';
import { isSupabaseConfigured } from './lib/supabaseClient';
import { ThemeProvider } from './components/theme-provider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './index.css';

function AppContent() {
  const [showWarning, setShowWarning] = useState(!isSupabaseConfigured);
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('App mounted, Supabase configured:', isSupabaseConfigured);
  }, []);

  if (showWarning) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl">
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">⚠️ Supabase Not Configured</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The Supabase credentials are missing. Please follow these steps:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
            <li>Create a <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">.env.local</code> file in the <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">frontend/</code> directory</li>
            <li>Add your Supabase credentials:
              <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded mt-2 text-sm">
                {`VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key`}
              </pre>
            </li>
            <li>Restart the dev server</li>
          </ol>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            See <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">SUPABASE_SETUP.md</code> for detailed instructions.
          </p>
          <button
            onClick={() => setShowWarning(false)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            I've configured it, continue anyway
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return <TaskList />;
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="task-manager-theme">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
