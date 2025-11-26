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
/**
 * Convert an app task to the shape expected by the database.
 * Optionally include a user_id when creating a new task.
 */
const taskToDb = (
    task: Omit<Task, 'id' | 'createdAt'>,
    userId?: string
): Omit<DbTask, 'id' | 'created_at'> => ({
    title: task.title,
    description: task.description || null,
    status: task.status,
    importance: task.importance,
    category: task.category,
    due_date: task.dueDate || null,
    user_id: userId || null // Ensure it's null if undefined/empty string
});

export const taskApi = {
    /**
     * Returns the currently authenticated user's UUID.
     * Throws an error if no user is logged in.
     */
    getCurrentUserId: async (): Promise<string> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error('You must be logged in to perform this action');
        }
        return user.id;
    },

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
        const userId = await taskApi.getCurrentUserId();
        console.log('Creating task', { task, userId });
        const dbTask = taskToDb(task, userId);
        console.log('Creating task with DB object:', dbTask);
        const { data, error } = await supabase
            .from('tasks')
            .insert([dbTask])
            .select()
            .single();

        if (error) {
            console.error('Error creating task:', error);
            throw new Error(`${error.message} (User: ${userId}, Payload UserID: ${dbTask.user_id})`);
        }

        return dbToTask(data);
    },

    updateTask: async (id: number, task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
        console.log('Updating task', { id, task });
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
        const userId = await taskApi.getCurrentUserId();
        const { data, error: selectError } = await supabase
            .from('tasks')
            .select('id') // Only need to select id to confirm existence and ownership
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (selectError) {
            console.error('Error fetching task for deletion:', selectError);
            throw new Error(selectError.message);
        }

        if (!data) {
            // This case should ideally be covered by selectError if single() fails to find a row
            // but it's good for explicit clarity or if single() returns null data without error on no match
            throw new Error('Task not found or you do not have permission to delete it.');
        }

        const { error: deleteError } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id); // Ownership already confirmed by the select query

        if (deleteError) {
            console.error('Error deleting task:', deleteError);
            throw new Error(deleteError.message);
        }
    }
};
