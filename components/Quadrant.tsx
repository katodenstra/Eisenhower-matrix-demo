
import React, { useState } from 'react';
import { QuadrantConfig, Task, QuadrantType } from '../types';
import TaskItem from './TaskItem';

interface QuadrantProps {
  config: QuadrantConfig;
  tasks: Task[];
  onAddTask: (q: QuadrantType) => void;
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
  onMoveTask: (taskId: string, targetQuadrant: QuadrantType) => void;
}

const Quadrant: React.FC<QuadrantProps> = ({ 
  config, tasks, onAddTask, onDeleteTask, onToggleTask, onMoveTask 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onMoveTask(taskId, config.type);
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`
        relative flex flex-col rounded-[2.5rem] border-2 h-full min-h-[400px] overflow-hidden transition-all duration-300
        ${config.bg} ${config.border} ${isDragOver ? 'drag-over' : ''}
        ${isMaximized ? 'fixed inset-4 z-50' : ''}
      `}
    >
      <div className="p-6 pb-2 flex items-center justify-between sticky top-0 bg-inherit z-10">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800">{config.label}</h2>
          <p className="text-xs font-medium uppercase tracking-widest opacity-60">{config.sublabel}</p>
        </div>
        <button 
          onClick={() => onAddTask(config.type)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 hover:scale-110 active:scale-95 transition-all text-slate-800"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 scroll-smooth">
        {tasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 select-none">
            <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <p className="text-sm font-medium">Empty quadrant</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              config={config} 
              onDelete={onDeleteTask} 
              onToggle={onToggleTask}
            />
          ))
        )}
      </div>

      <div className="p-4 flex justify-end sticky bottom-0 pointer-events-none">
        <button 
          onClick={() => setIsMaximized(!isMaximized)}
          className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm border border-slate-200 hover:scale-110 transition-all text-slate-600 pointer-events-auto"
        >
          {isMaximized ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Quadrant;
