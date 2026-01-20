
import React, { useState } from 'react';
import { Task, QuadrantConfig } from '../types';

interface TaskItemProps {
  task: Task;
  config: QuadrantConfig;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, config, onDelete, onToggle }) => {
  const [expanded, setExpanded] = useState(false);

  const addToCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    const title = encodeURIComponent(task.name);
    const details = encodeURIComponent(task.description);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
    window.open(url, '_blank');
  };

  return (
    <div 
      draggable
      onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
      onClick={() => setExpanded(!expanded)}
      className={`group relative mb-3 p-4 rounded-2xl border ${config.border} bg-white shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onToggle(task.id); }}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}
            >
              {task.completed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </button>
            <h4 className={`font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
              {task.name}
            </h4>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
              {task.dueDate}
            </span>
            {task.labels.map((l, i) => (
              <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                {l}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            className="p-1 hover:bg-red-50 rounded-lg text-red-400"
          >
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            {task.description || "No description provided."}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {task.labels.map((l, i) => (
                <span key={i} className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-lg">#{l}</span>
              ))}
            </div>
            <button 
              onClick={addToCalendar}
              className="text-xs font-semibold flex items-center gap-1 text-blue-600 hover:text-blue-700"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Add to Calendar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
