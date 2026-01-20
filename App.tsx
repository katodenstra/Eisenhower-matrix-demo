
import React, { useState, useEffect, useCallback } from 'react';
import { QuadrantType, Task, AISuggestion } from './types';
import { QUADRANTS } from './constants';
import Quadrant from './components/Quadrant';
import AuthView from './components/AuthView';
import { GeminiService } from './services/geminiService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [showNewTaskModal, setShowNewTaskModal] = useState<QuadrantType | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Initialize data
  useEffect(() => {
    const saved = localStorage.getItem('eisenhower_tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse tasks");
      }
    }
  }, []);

  // Persist data
  useEffect(() => {
    localStorage.setItem('eisenhower_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const runAIAnalysis = useCallback(async () => {
    if (tasks.length === 0) return;
    setAnalyzing(true);
    const service = new GeminiService();
    const result = await service.analyzeTasks(tasks);
    setSuggestions(result);
    setAnalyzing(false);
  }, [tasks]);

  const addTask = (name: string, quadrant: QuadrantType) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description: '',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      labels: [],
      completed: false,
      quadrant,
      createdAt: Date.now()
    };
    setTasks(prev => [...prev, newTask]);
    setShowNewTaskModal(null);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const moveTask = (taskId: string, targetQuadrant: QuadrantType) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, quadrant: targetQuadrant } : t));
  };

  if (!isAuthenticated) {
    return <AuthView onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Eisenhower <span className="text-blue-600">AI</span></h1>
          <p className="text-slate-500 font-medium">Smart task prioritization for high performance</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={runAIAnalysis}
            disabled={analyzing}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl bg-white shadow-sm border border-slate-200 hover:shadow-md transition-all font-semibold text-slate-700 ${analyzing ? 'opacity-50' : ''}`}
          >
            {analyzing ? (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
            )}
            Analyze Matrix
          </button>
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <img key={i} src={`https://picsum.photos/seed/${i}/40/40`} className="w-10 h-10 rounded-full border-2 border-white" alt="Team member" />
            ))}
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500">+4</div>
          </div>
        </div>
      </header>

      {/* AI Suggestions Bar */}
      {suggestions.length > 0 && (
        <div className="max-w-7xl mx-auto mb-8 flex gap-4 overflow-x-auto pb-2">
          {suggestions.map((s, i) => (
            <div key={i} className="flex-shrink-0 flex items-center gap-3 bg-white border border-blue-100 rounded-2xl px-5 py-3 shadow-sm animate-in fade-in slide-in-from-top-4">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.336 16.336a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM16.336 6.664a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0z" /></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">AI Suggestion</p>
                <p className="text-sm text-slate-700 font-medium">{s.message}</p>
              </div>
              <button 
                onClick={() => setSuggestions(prev => prev.filter((_, idx) => idx !== i))}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        <Quadrant 
          config={QUADRANTS[QuadrantType.DO_NOW]} 
          tasks={tasks.filter(t => t.quadrant === QuadrantType.DO_NOW)}
          onAddTask={(q) => setShowNewTaskModal(q)}
          onDeleteTask={deleteTask}
          onToggleTask={toggleTask}
          onMoveTask={moveTask}
        />
        <Quadrant 
          config={QUADRANTS[QuadrantType.DO_LATER]} 
          tasks={tasks.filter(t => t.quadrant === QuadrantType.DO_LATER)}
          onAddTask={(q) => setShowNewTaskModal(q)}
          onDeleteTask={deleteTask}
          onToggleTask={toggleTask}
          onMoveTask={moveTask}
        />
        <Quadrant 
          config={QUADRANTS[QuadrantType.DELEGATE]} 
          tasks={tasks.filter(t => t.quadrant === QuadrantType.DELEGATE)}
          onAddTask={(q) => setShowNewTaskModal(q)}
          onDeleteTask={deleteTask}
          onToggleTask={toggleTask}
          onMoveTask={moveTask}
        />
        <Quadrant 
          config={QUADRANTS[QuadrantType.ELIMINATE]} 
          tasks={tasks.filter(t => t.quadrant === QuadrantType.ELIMINATE)}
          onAddTask={(q) => setShowNewTaskModal(q)}
          onDeleteTask={deleteTask}
          onToggleTask={toggleTask}
          onMoveTask={moveTask}
        />
      </main>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">New Task for {QUADRANTS[showNewTaskModal].label}</h3>
            <form onSubmit={(e: any) => {
              e.preventDefault();
              addTask(e.target.taskName.value, showNewTaskModal);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Task Name</label>
                <input 
                  name="taskName"
                  autoFocus
                  required
                  placeholder="What needs to be done?"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowNewTaskModal(null)}
                  className="flex-1 p-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 p-4 rounded-2xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
