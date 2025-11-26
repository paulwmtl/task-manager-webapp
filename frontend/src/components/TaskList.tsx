import React, { useState, useEffect } from 'react';
import type { Task, TaskStatus } from '../types/Task';
import { taskApi } from '../api/taskApi';

import { LayoutList, Kanban, LogOut } from 'lucide-react';
import KanbanView from './Dashboard/KanbanView';
import { ModeToggle } from './mode-toggle';
import { useAuth } from '../contexts/AuthContext';

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterImportance, setFilterImportance] = useState('All');
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
    const { signOut, user } = useAuth();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await taskApi.getAllTasks();
            setTasks(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch tasks');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            await taskApi.deleteTask(id);
            setTasks(tasks.filter(task => task.id !== id));
        } catch (err) {
            setError('Failed to delete task');
            console.error(err);
        }
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setIsCreating(false);
    };

    const handleCreate = () => {
        setEditingTask({
            title: '',
            description: '',
            status: 'TODO',
            importance: 'medium',
            category: 'Allgemein',
            dueDate: ''
        });
        setIsCreating(true);
    };

    const handleSave = async (task: Omit<Task, 'id'>) => {
        try {
            if (isCreating) {
                const newTask = await taskApi.createTask(task);
                setTasks([...tasks, newTask]);
            } else if (editingTask?.id) {
                const updatedTask = await taskApi.updateTask(editingTask.id, task);
                setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t));
            }
            setEditingTask(null);
            setIsCreating(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save task');
            console.error(err);
        }
    };

    const handleTaskUpdate = async (updatedTask: Task) => {
        try {
            if (updatedTask.id) {
                const result = await taskApi.updateTask(updatedTask.id, updatedTask);
                setTasks(tasks.map(t => t.id === updatedTask.id ? result : t));
            }
        } catch (err) {
            setError('Failed to update task status');
            console.error(err);
        }
    };

    const handleCancel = () => {
        setEditingTask(null);
        setIsCreating(false);
    };

    const getStatusColor = (status: TaskStatus) => {
        switch (status) {
            case 'TODO': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
            case 'IN_PROGRESS': return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300';
            case 'DONE': return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
        }
    };

    const getStatusLabel = (status: TaskStatus) => {
        switch (status) {
            case 'TODO': return 'To Do';
            case 'IN_PROGRESS': return 'In Progress';
            case 'DONE': return 'Done';
        }
    };

    const filteredTasks = tasks.filter(task =>
        (filterCategory === 'All' || task.category === filterCategory) &&
        (filterImportance === 'All' || task.importance === filterImportance)
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-gray-600">Loading tasks...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Task Manager</h1>
                        <p className="text-gray-600 dark:text-gray-300">Organize and track your tasks efficiently</p>
                    </div>

                    <div className="flex gap-3 items-center">
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <span>{user?.email}</span>
                            <button
                                onClick={() => signOut()}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                                title="Logout"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>

                        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${viewMode === 'list'
                                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <LayoutList size={18} />
                                List
                            </button>
                            <button
                                onClick={() => setViewMode('kanban')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${viewMode === 'kanban'
                                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Kanban size={18} />
                                Kanban
                            </button>
                        </div>
                        <ModeToggle />
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={handleCreate}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        + Create New Task
                    </button>

                    <div className="flex gap-4">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 dark:text-white shadow-sm"
                        >
                            <option value="All">All Categories</option>
                            <option value="Allgemein">Allgemein</option>
                            <option value="Haushalt">Haushalt</option>
                            <option value="Uni">Uni</option>
                            <option value="Arbeit">Arbeit</option>
                            <option value="Finanzen">Finanzen</option>
                        </select>

                        <select
                            value={filterImportance}
                            onChange={(e) => setFilterImportance(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 dark:text-white shadow-sm"
                        >
                            <option value="All">All Importance</option>
                            <option value="low">🟢 Low</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="high">🔴 High</option>
                        </select>
                    </div>
                </div>

                {(editingTask || isCreating) && (
                    <TaskForm
                        task={editingTask}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                )}

                {viewMode === 'list' ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredTasks.map(task => (
                            <div
                                key={task.id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100 dark:border-gray-700"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex-1">
                                        {task.title}
                                    </h3>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 whitespace-nowrap">
                                            {task.category}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${task.importance === 'high' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' :
                                            task.importance === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300' :
                                                'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
                                            }`}>
                                            {task.importance === 'high' ? 'High' : task.importance === 'medium' ? 'Medium' : 'Low'}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(task.status)}`}>
                                            {getStatusLabel(task.status)}
                                        </span>
                                    </div>
                                </div>

                                {task.description && (
                                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                        {task.description}
                                    </p>
                                )}

                                {task.dueDate && (
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {new Date(task.dueDate).toLocaleDateString()}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(task)}
                                        className="flex-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors duration-200"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => task.id && handleDelete(task.id)}
                                        className="flex-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors duration-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <KanbanView tasks={filteredTasks} onTaskUpdate={handleTaskUpdate} />
                )}

                {filteredTasks.length === 0 && !editingTask && (
                    <div className="text-center py-12">
                        <svg className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-xl text-gray-500 dark:text-gray-400">No tasks found matching your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

interface TaskFormProps {
    task: Task | null;
    onSave: (task: Omit<Task, 'id'>) => void;
    onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: task?.title || '',
        description: task?.description || '',
        status: task?.status || 'TODO' as TaskStatus,
        importance: task?.importance || 'medium' as Task['importance'],
        category: task?.category || 'Allgemein',
        dueDate: task?.dueDate || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6 border-2 border-indigo-200 dark:border-indigo-800">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                {task?.id ? 'Edit Task' : 'Create New Task'}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="flex gap-4 mb-3">
                    <div className="flex-1">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                            Title <span className="text-red-500 dark:text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm bg-white dark:bg-gray-700 dark:text-white"
                            required
                            maxLength={100}
                        />
                    </div>
                    <div className="w-1/3">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                            Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm bg-white dark:bg-gray-700 dark:text-white"
                        >
                            <option value="Allgemein">Allgemein</option>
                            <option value="Haushalt">Haushalt</option>
                            <option value="Uni">Uni</option>
                            <option value="Arbeit">Arbeit</option>
                            <option value="Finanzen">Finanzen</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                            Status
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm bg-white dark:bg-gray-700 dark:text-white"
                        >
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                            Importance
                        </label>
                        <select
                            value={formData.importance}
                            onChange={(e) => setFormData({ ...formData, importance: e.target.value as Task['importance'] })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm bg-white dark:bg-gray-700 dark:text-white"
                        >
                            <option value="low">🟢 Low</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="high">🔴 High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                            Due Date
                        </label>
                        <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm bg-white dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm bg-white dark:bg-gray-700 dark:text-white"
                        rows={2}
                        maxLength={500}
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm"
                    >
                        Save Task
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskList;
