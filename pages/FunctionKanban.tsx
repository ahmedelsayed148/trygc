import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../Root';
import { Columns3, Plus, GripVertical, X, Edit2 } from 'lucide-react';

export function FunctionKanban() {
  const ctx = useContext(AppContext);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const tasks = ctx?.tasks || [];
  const setTasks = ctx?.setTasks || (() => {});

  // Get unique teams and statuses
  const teams = useMemo(() => {
    const teamSet = new Set(tasks.map((t: any) => t.team).filter(Boolean));
    return Array.from(teamSet);
  }, [tasks]);

  const statuses = ['Pending', 'In Progress', 'Completed'];

  // Get filtered tasks
  const boardTasks = useMemo(() => {
    let filtered = tasks;
    if (selectedTeam) {
      filtered = filtered.filter((t: any) => t.team === selectedTeam);
    }
    return filtered;
  }, [tasks, selectedTeam]);

  // Organize by status
  const columnTasks = useMemo(() => {
    const columns: Record<string, any[]> = {};
    statuses.forEach((status) => {
      columns[status] = boardTasks.filter((t: any) => t.status === status);
    });
    return columns;
  }, [boardTasks, statuses]);

  const handleMoveTask = (taskId: number, newStatus: string) => {
    setTasks(tasks.map((t: any) =>
      t.id === taskId ? { ...t, status: newStatus } : t
    ));
  };

  const handleDeleteTask = (id: number) => {
    if (window.confirm('Delete this task?')) {
      setTasks(tasks.filter((t: any) => t.id !== id));
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-black to-zinc-800 dark:from-zinc-900 dark:to-black rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <Columns3 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-1">Kanban Board</h1>
              <p className="text-zinc-300 text-lg font-medium">Organize tasks by status and team</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-2xl hover:shadow-lg transition-all">
            <Plus className="w-5 h-5" />
            New Task
          </button>
        </div>
      </div>

      {/* Team Selector */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
        <p className="text-sm font-bold text-black dark:text-white mb-4">Filter by Team</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTeam(null)}
            className={`px-4 py-2 rounded-full font-bold transition-all ${
              selectedTeam === null
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            All Teams
          </button>
          {teams.map((team) => (
            <button
              key={team}
              onClick={() => setSelectedTeam(team)}
              className={`px-4 py-2 rounded-full font-bold transition-all ${
                selectedTeam === team
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {team}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statuses.map((status) => {
          const statusTasks = columnTasks[status] || [];
          const statusColors = {
            'Pending': 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700',
            'In Progress': 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800',
            'Completed': 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800',
          };
          const statusBadgeColors = {
            'Pending': 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200',
            'In Progress': 'bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200',
            'Completed': 'bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200',
          };

          return (
            <div key={status} className={`rounded-2xl border p-6 min-h-96 ${statusColors[status as keyof typeof statusColors]}`}>
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-black dark:text-white text-lg">{status}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadgeColors[status as keyof typeof statusBadgeColors]}`}>
                  {statusTasks.length}
                </span>
              </div>

              {/* Add Card */}
              <button className="w-full mb-4 p-4 border-2 border-dashed border-zinc-400 dark:border-zinc-600 rounded-xl hover:border-black dark:hover:border-white transition-colors text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white font-bold">
                <Plus className="w-5 h-5 mx-auto" />
              </button>

              {/* Tasks */}
              <div className="space-y-3">
                {statusTasks.length > 0 ? (
                  statusTasks.map((task: any) => (
                    <div
                      key={task.id}
                      className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('taskId', task.id.toString());
                        e.dataTransfer.setData('fromStatus', status);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.style.opacity = '0.8';
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.style.opacity = '1';
                        const taskId = parseInt(e.dataTransfer.getData('taskId'));
                        handleMoveTask(taskId, status);
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-black dark:text-white text-sm line-clamp-2">{task.title}</h4>
                          {task.team && (
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{task.team}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Card Footer */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">#{task.id}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors">
                            <Edit2 className="w-3 h-3 text-zinc-600 dark:text-zinc-400" />
                          </button>
                          <button onClick={() => handleDeleteTask(task.id)} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors">
                            <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-zinc-500">
                    <p className="text-sm">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
