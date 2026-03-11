import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../Root';
import { BarChart3, Zap, Users, CheckCircle2, AlertCircle, TrendingUp, Calendar, Search, Filter } from 'lucide-react';

export function CriteriaOpsWorkspace() {
  const ctx = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const tasks = ctx?.tasks || [];
  const successLogs = ctx?.successLogs || [];
  const opsCampaigns = ctx?.opsCampaigns || [];
  const mistakes = ctx?.mistakes || [];

  // Calculate stats
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t: any) => t.status === 'Completed').length;
    const inProgressTasks = tasks.filter((t: any) => t.status === 'In Progress').length;
    const totalCampaigns = opsCampaigns.length;
    const activeCampaigns = opsCampaigns.filter((c: any) => c.status === 'Active').length;
    const recentSuccesses = successLogs.slice(0, 5);
    const recentMistakes = mistakes.slice(0, 5);

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      totalCampaigns,
      activeCampaigns,
      recentSuccesses,
      recentMistakes,
    };
  }, [tasks, successLogs, opsCampaigns, mistakes]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task: any) => {
        const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            task.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || task.status === filterStatus;
        return matchesSearch && matchesFilter;
      })
      .slice(0, 10);
  }, [tasks, searchTerm, filterStatus]);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-black to-zinc-800 dark:from-zinc-900 dark:to-black rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black mb-1">Operations Workspace</h1>
            <p className="text-zinc-300 text-lg font-medium">Command center for tasks, campaigns, and team coordination</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tasks Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Total Tasks</p>
              <p className="text-4xl font-black text-black dark:text-white mt-1">{stats.totalTasks}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-green-600 dark:text-green-400">{stats.inProgressTasks} active</span>
            <span className="text-zinc-400">·</span>
            <span className="font-bold text-black dark:text-white">{stats.completionRate}% complete</span>
          </div>
        </div>

        {/* Campaigns Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Campaigns</p>
              <p className="text-4xl font-black text-black dark:text-white mt-1">{stats.totalCampaigns}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-green-600 dark:text-green-400">{stats.activeCampaigns} active</span>
          </div>
        </div>

        {/* Successes Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Successes</p>
              <p className="text-4xl font-black text-black dark:text-white mt-1">{stats.recentSuccesses.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Recent achievements</p>
        </div>

        {/* Issues Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Mistakes</p>
              <p className="text-4xl font-black text-black dark:text-white mt-1">{stats.recentMistakes.length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Items to review</p>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 className="w-6 h-6 text-black dark:text-white" />
          <h2 className="text-2xl font-bold text-black dark:text-white">Recent Tasks</h2>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-12 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-none text-black dark:text-white text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-none text-black dark:text-white text-sm font-medium"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Task List */}
        {filteredTasks.length > 0 ? (
          <div className="space-y-3">
            {filteredTasks.map((task: any) => (
              <div key={task.id} className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-black dark:hover:border-white transition-colors cursor-pointer group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-black dark:text-white truncate group-hover:underline">{task.title}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate mt-1">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                      task.status === 'Completed'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : task.status === 'In Progress'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400 font-medium">No tasks found</p>
          </div>
        )}
      </div>

      {/* Recent Successes & Mistakes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Successes */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
          <h3 className="text-xl font-bold text-black dark:text-white mb-4">Recent Successes</h3>
          {stats.recentSuccesses.length > 0 ? (
            <div className="space-y-3">
              {stats.recentSuccesses.map((success: any, idx: number) => (
                <div key={idx} className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="font-bold text-green-900 dark:text-green-300 text-sm">{success.agent}</p>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-1">{success.detail}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-600 dark:text-zinc-400 text-center py-4">No successes yet</p>
          )}
        </div>

        {/* Mistakes */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
          <h3 className="text-xl font-bold text-black dark:text-white mb-4">Items Needing Attention</h3>
          {stats.recentMistakes.length > 0 ? (
            <div className="space-y-3">
              {stats.recentMistakes.map((mistake: any, idx: number) => (
                <div key={idx} className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="font-bold text-red-900 dark:text-red-300 text-sm">{mistake.agent}</p>
                  <p className="text-xs text-red-700 dark:text-red-400 mt-1">{mistake.detail}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-600 dark:text-zinc-400 text-center py-4">No issues</p>
          )}
        </div>
      </div>
    </div>
  );
}
