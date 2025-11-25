import { supabase } from '../lib/supabaseClient';
import type { Category } from '../types/Task';

// Database type matching Supabase schema
interface DbCategory {
    id: number;
    name: string;
    color: string;
    is_default: boolean;
    user_id: string | null;
    created_at: string;
}

// Convert database category to app category
const dbToCategory = (dbCategory: DbCategory): Category => ({
    id: dbCategory.id,
    name: dbCategory.name,
    color: dbCategory.color,
    isDefault: dbCategory.is_default,
    userId: dbCategory.user_id || undefined,
    createdAt: dbCategory.created_at,
});

// Convert app category to database category
const categoryToDb = (category: Omit<Category, 'id' | 'createdAt' | 'isDefault'>): Omit<DbCategory, 'id' | 'created_at' | 'is_default' | 'user_id'> => ({
    name: category.name,
    color: category.color,
});

export const categoryApi = {
    getAllCategories: async (): Promise<Category[]> => {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('is_default', { ascending: false })
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching categories:', error);
            throw new Error(error.message);
        }

        return (data || []).map(dbToCategory);
    },

    createCategory: async (category: Omit<Category, 'id' | 'createdAt' | 'isDefault' | 'userId'>): Promise<Category> => {
        const { data, error } = await supabase
            .from('categories')
            .insert([categoryToDb(category)])
            .select()
            .single();

        if (error) {
            console.error('Error creating category:', error);
            throw new Error(error.message);
        }

        return dbToCategory(data);
    },

    updateCategory: async (id: number, category: Omit<Category, 'id' | 'createdAt' | 'isDefault' | 'userId'>): Promise<Category> => {
        const { data, error } = await supabase
            .from('categories')
            .update(categoryToDb(category))
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating category:', error);
            throw new Error(error.message);
        }

        return dbToCategory(data);
    },

    deleteCategory: async (id: number): Promise<void> => {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting category:', error);
            throw new Error(error.message);
        }
    }
};
