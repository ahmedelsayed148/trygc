import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../Root';
import { Zap, Play, Pause, CheckCircle2, AlertCircle, Clock, Users, Plus } from 'lucide-react';

export function OpsCommand() {
  const ctx = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<'executing' | 'pending' | 'completed'>('executing');

  const tasks = ctx?.tasks || [];
  const setTasks = ctx?.setTasks || (() => {});

  const tasksByStatus = useMemo(() => {
    return {
      executing: tasks.filter((t: any) => t.status === 'In Progress'),
      pending: tasks.filter((t: any) => t.status === 'Pending'),
      completed: tasks.filter((t: any) => t.status === 'Completed').slice(0, 20),
    };
  }, [tasks]);

  const handleStartTask = (id: number) => {
    setTasks(tasks.map((t: any) =>
      t.id === id ? { ...t, status: 'In Progress' } : t
    ));
  };

  const handleCompleteTask = (id: number) => {
    setTasks(tasks.map((t: any) =>
      t.id === id ? { ...t, status: 'Completed' } : t
    ));
  };

  const handlePauseTask = (id: number) => {
    setTasks(tasks.map((t: any) =>
      t.id === id ? { ...t, status: 'Pending' } : t
    ));
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-black to-zinc-800 dark:from-zinc-900 dark:to-black rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-1">Operations Command</h1>
              <p className="text-zinc-300 text-lg font-medium">Execute and manage active operations</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-2xl hover:shadow-lg transition-all">
            <Plus className="w-5 h-5" />
            New Task
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-2 inline-flex gap-2">
        <button
          onClick={() => setActiveTab('executing')}
          className={`px-6 py-2 rounded-2xl font-bold transition-all ${
            activeTab === 'executing'
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Now ({tasksByStatus.executing.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-2 rounded-2xl font-bold transition-all ${
            activeTab === 'pending'
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending ({tasksByStatus.pending.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-2 rounded-2xl font-bold transition-all ${
            activeTab === 'completed'
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Done ({tasksByStatus.completed.length})
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'executing' && (
          <>
            {tasksByStatus.executing.length > 0 ? (
              tasksByStatus.executing.map((task: any) => (
                <div key={task.id} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border-2 border-green-200 dark:border-green-800 p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <h3 className="text-xl font-bold text-black dark:text-white">{task.title}</h3>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 mb-4">{task.description}</p>
                      {task.team && (
                        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                          <Users className="w-4 h-4" />
                          <span className="font-medium">{task.team}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold rounded-xl hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handlePauseTask(task.id)}
                        className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-bold rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                      >
                        Pause
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-800">
                <Play className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-600 dark:text-zinc-400 font-medium text-lg">No tasks executing</p>
                <p className="text-zinc-500 text-sm mt-1">Start a pending task to begin operations</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'pending' && (
          <>
            {tasksByStatus.pending.length > 0 ? (
              tasksByStatus.pending.map((task: any) => (
                <div key={task.id} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <h3 className="text-xl font-bold text-black dark:text-white">{task.title}</h3>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 mb-4">{task.description}</p>
                      {task.team && (
                        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                          <Users className="w-4 h-4" />
                          <span className="font-medium">{task.team}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleStartTask(task.id)}
                      className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:shadow-lg transition-all"
                    >
                      Start
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-800">
                <Clock className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-600 dark:text-zinc-400 font-medium text-lg">No pending tasks</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'completed' && (
          <>
            {tasksByStatus.completed.length > 0 ? (
              tasksByStatus.completed.map((task: any) => (
                <div key={task.id} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-green-100 dark:border-green-900 p-6 opacity-75 hover:opacity-100 transition-opacity">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-black dark:text-white line-through">{task.title}</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{task.description}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-800">
                <CheckCircle2 className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-600 dark:text-zinc-400 font-medium text-lg">No completed tasks yet</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
