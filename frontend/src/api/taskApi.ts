import { supabase } from '../lib/supabaseClient';
import type { Task } from '../types/Task';

// Database type matching Supabase schema
interface DbTask {
    id: number;
    title: string;
    description: string | null;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    importance: 'low' | 'medium' | 'high';
    category: string;
    due_date: string | null;
    user_id: string | null;
    created_at: string;
}

// Convert database task to app task
const dbToTask = (dbTask: DbTask): Task => ({
    id: dbTask.id,
    title: dbTask.title,
    description: dbTask.description || undefined,
    status: dbTask.status,
    importance: dbTask.importance,
    category: dbTask.category,
    dueDate: dbTask.due_date || undefined,
    userId: dbTask.user_id || undefined,
    createdAt: dbTask.created_at,
});

// Convert app task to database task
const taskToDb = (task: Omit<Task, 'id' | 'createdAt'>): Omit<DbTask, 'id' | 'created_at' | 'user_id'> => ({
    title: task.title,
    description: task.description || null,
    status: task.status,
    importance: task.importance,
    category: task.category,
    due_date: task.dueDate || null,
});

export const taskApi = {
    getAllTasks: async (): Promise<Task[]> => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tasks:', error);
            throw new Error(error.message);
        }

        return (data || []).map(dbToTask);
    },

    getTaskById: async (id: number): Promise<Task> => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching task:', error);
            throw new Error(error.message);
        }

        return dbToTask(data);
    },

    createTask: async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
        const { data, error } = await supabase
            .from('tasks')
            .insert([taskToDb(task)])
            .select()
            .single();

        if (error) {
            console.error('Error creating task:', error);
            throw new Error(error.message);
        }

        return dbToTask(data);
    },

    updateTask: async (id: number, task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
        const { data, error } = await supabase
            .from('tasks')
            .update(taskToDb(task))
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating task:', error);
            throw new Error(error.message);
        }

        return dbToTask(data);
    },

    deleteTask: async (id: number): Promise<void> => {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting task:', error);
            throw new Error(error.message);
        }
    }
};
