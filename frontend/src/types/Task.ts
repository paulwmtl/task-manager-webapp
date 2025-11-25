export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskImportance = 'low' | 'medium' | 'high';

export interface Task {
    id?: number;
    title: string;
    description?: string;
    status: TaskStatus;
    importance: TaskImportance;
    category: string;
    dueDate?: string;
    userId?: string;
    createdAt?: string;
}

export interface Category {
    id: number;
    name: string;
    color: string;
    isDefault: boolean;
    userId?: string;
    createdAt?: string;
}
