import React, { useContext, useMemo } from 'react';
import { AppContext } from '../Root';
import { BarChart3, TrendingUp, CheckCircle2, Clock, AlertCircle, Users, Calendar } from 'lucide-react';

export function Dashboard() {
  const ctx = useContext(AppContext);

  const tasks = ctx?.tasks || [];
  const successLogs = ctx?.successLogs || [];
  const mistakes = ctx?.mistakes || [];
  const teamMembers = ctx?.teamMembers || [];

  // Calculate dashboard metrics
  const dashboardData = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t: any) => t.status === 'Completed').length;
    const inProgress = tasks.filter((t: any) => t.status === 'In Progress').length;
    const pending = tasks.filter((t: any) => t.status === 'Pending').length;

    return {
      total,
      completed,
      inProgress,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      successCount: successLogs.length,
      mistakeCount: mistakes.length,
      teamSize: teamMembers.length,
      recentTasks: tasks.slice(0, 5),
      recentSuccesses: successLogs.slice(0, 3),
    };
  }, [tasks, successLogs, mistakes, teamMembers]);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-black to-zinc-800 dark:from-zinc-900 dark:to-black rounded-3xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-black mb-2">Dashboard</h1>
        <p className="text-zinc-300 text-lg font-medium">Your operations overview</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Total Tasks</p>
              <p className="text-4xl font-black text-black dark:text-white mt-3">{dashboardData.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-4">Active workspace</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Completed</p>
              <p className="text-4xl font-black text-green-600 dark:text-green-400 mt-3">{dashboardData.completed}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-4">{dashboardData.completionRate}% complete</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">In Progress</p>
              <p className="text-4xl font-black text-orange-600 dark:text-orange-400 mt-3">{dashboardData.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-4">Currently executing</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Team</p>
              <p className="text-4xl font-black text-purple-600 dark:text-purple-400 mt-3">{dashboardData.teamSize}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-4">Active members</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold text-black dark:text-white mb-4">Recent Tasks</h2>
          <div className="space-y-3">
            {dashboardData.recentTasks.length > 0 ? (
              dashboardData.recentTasks.map((task: any) => (
                <div key={task.id} className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-black dark:hover:border-white transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-black dark:text-white text-sm truncate">{task.title}</p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{task.team || 'Unassigned'}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${
                      task.status === 'Completed'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : task.status === 'In Progress'
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                        : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-zinc-600 dark:text-zinc-400 py-4">No tasks yet</p>
            )}
          </div>
        </div>

        {/* Recent Wins */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold text-black dark:text-white mb-4">Recent Wins</h2>
          <div className="space-y-3">
            {dashboardData.recentSuccesses.length > 0 ? (
              dashboardData.recentSuccesses.map((success: any, idx: number) => (
                <div key={idx} className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="font-bold text-green-900 dark:text-green-300 text-sm">{success.agent}</p>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-1">{success.detail}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-zinc-600 dark:text-zinc-400 py-4">No wins logged yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <p className="text-blue-900 dark:text-blue-300 font-bold text-sm uppercase mb-2">Success Rate</p>
          <p className="text-4xl font-black text-blue-600 dark:text-blue-400">{dashboardData.completionRate}%</p>
          <p className="text-xs text-blue-800 dark:text-blue-200 mt-2">Of all tasks completed</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
          <p className="text-green-900 dark:text-green-300 font-bold text-sm uppercase mb-2">Wins</p>
          <p className="text-4xl font-black text-green-600 dark:text-green-400">{dashboardData.successCount}</p>
          <p className="text-xs text-green-800 dark:text-green-200 mt-2">Team achievements</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
          <p className="text-red-900 dark:text-red-300 font-bold text-sm uppercase mb-2">Items</p>
          <p className="text-4xl font-black text-red-600 dark:text-red-400">{dashboardData.mistakeCount}</p>
          <p className="text-xs text-red-800 dark:text-red-200 mt-2">Needing attention</p>
        </div>
      </div>
    </div>
  );
}
