import React, { useContext, useMemo } from 'react';
import { AppContext } from '../Root';
import { BarChart3, TrendingUp, Users, Calendar, PieChart, LineChart } from 'lucide-react';

export function Analytics() {
  const ctx = useContext(AppContext);

  const tasks = ctx?.tasks || [];
  const teamMembers = ctx?.teamMembers || [];

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t: any) => t.status === 'Completed').length;
    const inProgress = tasks.filter((t: any) => t.status === 'In Progress').length;
    const pending = tasks.filter((t: any) => t.status === 'Pending').length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const avgCompletionTime = 5; // days (mock)

    // Team stats
    const teamStats = tasks.reduce((acc: Record<string, any>, task: any) => {
      const team = task.team || 'Unassigned';
      if (!acc[team]) {
        acc[team] = { total: 0, completed: 0, inProgress: 0 };
      }
      acc[team].total++;
      if (task.status === 'Completed') acc[team].completed++;
      if (task.status === 'In Progress') acc[team].inProgress++;
      return acc;
    }, {});

    return {
      total,
      completed,
      inProgress,
      pending,
      completionRate,
      avgCompletionTime,
      teamStats,
      totalMembers: teamMembers.length,
    };
  }, [tasks, teamMembers]);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-black to-zinc-800 dark:from-zinc-900 dark:to-black rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black mb-1">Analytics</h1>
            <p className="text-zinc-300 text-lg font-medium">Performance metrics and insights</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Total Tasks</p>
          <p className="text-4xl font-black text-black dark:text-white mt-2">{metrics.total}</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-3">All-time total</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Completion Rate</p>
          <p className="text-4xl font-black text-green-600 dark:text-green-400 mt-2">{metrics.completionRate}%</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-3">{metrics.completed}/{metrics.total} complete</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">In Progress</p>
          <p className="text-4xl font-black text-orange-600 dark:text-orange-400 mt-2">{metrics.inProgress}</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-3">{Math.round((metrics.inProgress / metrics.total) * 100)}% of total</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Team Members</p>
          <p className="text-4xl font-black text-blue-600 dark:text-blue-400 mt-2">{metrics.totalMembers}</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-3">Active contributors</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Task Status Distribution
          </h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-black dark:text-white">Completed</span>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">{metrics.completed} ({metrics.completed > 0 ? Math.round((metrics.completed / metrics.total) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-3 bg-green-200 dark:bg-green-900/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 dark:bg-green-400"
                  style={{ width: `${(metrics.completed / metrics.total) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-black dark:text-white">In Progress</span>
                <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{metrics.inProgress} ({metrics.inProgress > 0 ? Math.round((metrics.inProgress / metrics.total) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-3 bg-orange-200 dark:bg-orange-900/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-600 dark:bg-orange-400"
                  style={{ width: `${(metrics.inProgress / metrics.total) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-black dark:text-white">Pending</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{metrics.pending} ({metrics.pending > 0 ? Math.round((metrics.pending / metrics.total) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-3 bg-blue-200 dark:bg-blue-900/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 dark:bg-blue-400"
                  style={{ width: `${(metrics.pending / metrics.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Performance
          </h2>

          <div className="space-y-4">
            {Object.entries(metrics.teamStats).map(([team, stats]: any) => {
              const teamComplete = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
              return (
                <div key={team}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-black dark:text-white text-sm">{team}</span>
                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{stats.completed}/{stats.total}</span>
                  </div>
                  <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-black dark:bg-white"
                      style={{ width: `${teamComplete}%` }}
                    />
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">{teamComplete}% complete</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trends */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
        <h2 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
          <LineChart className="w-5 h-5" />
          Key Metrics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-300 font-bold uppercase">Avg. Completion Time</p>
            <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">{metrics.avgCompletionTime} days</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-900 dark:text-green-300 font-bold uppercase">Tasks/Week</p>
            <p className="text-3xl font-black text-green-600 dark:text-green-400 mt-2">{Math.ceil(metrics.total / 4)}</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-purple-900 dark:text-purple-300 font-bold uppercase">Efficiency Score</p>
            <p className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-2">{Math.round((metrics.completed / metrics.total) * 100 * 0.85)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
