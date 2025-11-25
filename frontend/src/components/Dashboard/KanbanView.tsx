import React, { useMemo } from 'react';
import type { Task, TaskStatus } from '../../types/Task';
import {
    KanbanBoard,
    KanbanCard,
    KanbanCards,
    KanbanHeader,
    KanbanProvider,
} from '@/components/ui/shadcn-io/kanban';

interface KanbanViewProps {
    tasks: Task[];
    onTaskUpdate: (task: Task) => void;
}

const columns = [
    {
        id: 'TODO',
        name: 'To Do',
        color: '#6B7280',
        gradient: 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900'
    },
    {
        id: 'IN_PROGRESS',
        name: 'In Progress',
        color: '#F59E0B',
        gradient: 'bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/30'
    },
    {
        id: 'DONE',
        name: 'Done',
        color: '#10B981',
        gradient: 'bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/30'
    },
];

const KanbanView: React.FC<KanbanViewProps> = ({ tasks, onTaskUpdate }) => {
    // Transform tasks to Kanban items
    // We need to convert numeric IDs to strings for dnd-kit
    const kanbanData = useMemo(() => {
        return tasks.map(task => ({
            id: task.id?.toString() || '',
            name: task.title,
            column: task.status,
            // Keep original task data for rendering
            originalTask: task
        }));
    }, [tasks]);

    const handleDataChange = (newData: any[]) => {
        // Find the task that changed status
        newData.forEach(item => {
            const originalTask = tasks.find(t => t.id?.toString() === item.id);
            if (originalTask && originalTask.status !== item.column) {
                // Status changed
                onTaskUpdate({
                    ...originalTask,
                    status: item.column as TaskStatus
                });
            }
        });
    };

    return (
        <div className="h-[calc(100vh-200px)] w-full">
            <KanbanProvider
                columns={columns}
                data={kanbanData}
                onDataChange={handleDataChange}
            >
                {(column) => (
                    <KanbanBoard id={column.id} key={column.id} className={column.gradient}>
                        <KanbanHeader>
                            <div className="flex items-center gap-2">
                                <div
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: column.color }}
                                />
                                <span>{column.name}</span>
                                <span className="text-gray-400 text-xs ml-auto">
                                    {kanbanData.filter(item => item.column === column.id).length}
                                </span>
                            </div>
                        </KanbanHeader>
                        <KanbanCards id={column.id}>
                            {(item) => {
                                const task = item.originalTask as Task;
                                return (
                                    <KanbanCard
                                        column={column.id}
                                        id={item.id}
                                        key={item.id}
                                        name={item.name}
                                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                    >
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-start">
                                                <p className="m-0 font-medium text-sm text-gray-800 dark:text-white line-clamp-2">
                                                    {task.title}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between mt-1">
                                                <div className="flex gap-1">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${task.importance === 'high' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' :
                                                        task.importance === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300' :
                                                            'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
                                                        }`}>
                                                        {task.importance}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300">
                                                        {task.category}
                                                    </span>
                                                </div>

                                                {task.dueDate && (
                                                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                                        {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </KanbanCard>
                                );
                            }}
                        </KanbanCards>
                    </KanbanBoard>
                )}
            </KanbanProvider>
        </div>
    );
};

export default KanbanView;
