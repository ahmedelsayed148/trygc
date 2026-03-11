import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../Root';
import { Search, Filter, SortAsc, CheckCircle2, Plus, Edit2, Trash2, Copy } from 'lucide-react';

export function AllTasks() {
  const ctx = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterTeam, setFilterTeam] = useState('All');
  const [sortBy, setSortBy] = useState('created');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const tasks = ctx?.tasks || [];
  const tasksPerTeam = ctx?.tasksPerTeam || {};
  const setTasks = ctx?.setTasks || (() => {});

  // Get unique teams
  const teams = useMemo(() => {
    const uniqueTeams = new Set(tasks.map((t: any) => t.team).filter(Boolean));
    return Array.from(uniqueTeams);
  }, [tasks]);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let result = tasks.filter((task: any) => {
      const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.id?.toString().includes(searchTerm);
      const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
      const matchesTeam = filterTeam === 'All' || task.team === filterTeam;
      return matchesSearch && matchesStatus && matchesTeam;
    });

    // Sort
    result.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'title':
          return a.title?.localeCompare(b.title) || 0;
        case 'status':
          return a.status?.localeCompare(b.status) || 0;
        case 'team':
          return (a.team || '').localeCompare(b.team || '') || 0;
        case 'created':
        default:
          return (b.id || 0) - (a.id || 0);
      }
    });

    return result;
  }, [tasks, searchTerm, filterStatus, filterTeam, sortBy]);

  const handleToggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredTasks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTasks.map((t: any) => t.id));
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this task?')) {
      setTasks(tasks.filter((t: any) => t.id !== id));
      setSelectedIds(prev => prev.filter(x => x !== id));
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-black to-zinc-800 dark:from-zinc-900 dark:to-black rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-1">All Tasks</h1>
              <p className="text-zinc-300 text-lg font-medium">{filteredTasks.length} tasks</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-2xl hover:shadow-lg transition-all">
            <Plus className="w-5 h-5" />
            New Task
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks, ID, description..."
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none text-black dark:text-white text-sm font-medium"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none text-black dark:text-white text-sm font-bold"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Team Filter */}
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none text-black dark:text-white text-sm font-bold"
          >
            <option value="All">All Teams</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none text-black dark:text-white text-sm font-bold"
          >
            <option value="created">Created (New)</option>
            <option value="title">Title A-Z</option>
            <option value="status">Status</option>
            <option value="team">Team</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex items-center justify-between">
          <p className="font-bold text-blue-900 dark:text-blue-300">{selectedIds.length} selected</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors">
              Mark Complete
            </button>
            <button className="px-4 py-2 text-sm font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors">
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Tasks Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 overflow-hidden">
        {filteredTasks.length > 0 ? (
          <>
            {/* Table Header */}
            <div className="hidden lg:grid grid-cols-12 gap-4 p-6 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 sticky top-0 font-bold text-sm">
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredTasks.length && filteredTasks.length > 0}
                  onChange={handleSelectAll}
                  className="w-5 h-5 rounded"
                />
              </div>
              <div className="col-span-2">ID</div>
              <div className="col-span-3">Title</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Team</div>
              <div className="col-span-2">Actions</div>
            </div>

            {/* Mobile and Table Rows */}
            <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {filteredTasks.map((task: any) => (
                <div key={task.id} className="p-4 lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  <div className="col-span-1 mb-3 lg:mb-0">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(task.id)}
                      onChange={() => handleToggleSelect(task.id)}
                      className="w-5 h-5 rounded"
                    />
                  </div>

                  {/* Mobile view */}
                  <div className="lg:hidden space-y-2 mb-4">
                    <p className="font-bold text-black dark:text-white">{task.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">ID:</span>
                      <span className="text-sm font-bold text-black dark:text-white">{task.id}</span>
                    </div>
                  </div>

                  <div className="col-span-2 hidden lg:block">
                    <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">#{task.id}</span>
                  </div>

                  <div className="col-span-3 hidden lg:block">
                    <p className="font-bold text-black dark:text-white truncate">{task.title}</p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate">{task.description}</p>
                  </div>

                  <div className="col-span-2 hidden lg:block">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                      task.status === 'Completed'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : task.status === 'In Progress'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                    }`}>
                      {task.status}
                    </span>
                  </div>

                  <div className="col-span-2 hidden lg:block">
                    <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">{task.team || '-'}</span>
                  </div>

                  <div className="col-span-2 flex items-center gap-2">
                    <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    </button>
                    <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                      <Copy className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    </button>
                    <button onClick={() => handleDelete(task.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-zinc-600 dark:text-zinc-400 font-medium">No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
}
