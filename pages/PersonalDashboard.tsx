import React, { useContext, useMemo } from 'react';
import { AppContext } from '../Root';
import { User, CheckCircle2, Target, TrendingUp, Calendar, Award, AlertCircle } from 'lucide-react';

export function PersonalDashboard() {
  const ctx = useContext(AppContext);
  const userEmail = ctx?.userEmail || 'user@example.com';
  const userName = ctx?.userName || 'User';

  const tasks = ctx?.tasks || [];
  const successLogs = ctx?.successLogs || [];

  // Get user's assigned tasks
  const userTasks = useMemo(() => {
    return {
      total: tasks.length,
      completed: tasks.filter((t: any) => t.status === 'Completed').length,
      inProgress: tasks.filter((t: any) => t.status === 'In Progress').length,
      pending: tasks.filter((t: any) => t.status === 'Pending').length,
      completionRate: tasks.length > 0 
        ? Math.round((tasks.filter((t: any) => t.status === 'Completed').length / tasks.length) * 100)
        : 0,
    };
  }, [tasks]);

  const recentSuccesses = useMemo(() => {
    return successLogs.slice(0, 5);
  }, [successLogs]);

  const todaysTasks = useMemo(() => {
    const today = new Date().toDateString();
    return tasks.filter((t: any) => {
      const taskDate = new Date(t.createdAt || new Date()).toDateString();
      return taskDate === today && t.status !== 'Completed';
    });
  }, [tasks]);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-black to-zinc-800 dark:from-zinc-900 dark:to-black rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
            <User className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-4xl font-black mb-2">{userName}</h1>
            <p className="text-zinc-300 text-lg font-medium">{userEmail}</p>
            <p className="text-zinc-400 text-sm mt-2">Member since {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Total Tasks</p>
              <p className="text-4xl font-black text-black dark:text-white mt-2">{userTasks.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Assigned to you</p>
        </div>

        {/* Completed */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Completed</p>
              <p className="text-4xl font-black text-green-600 dark:text-green-400 mt-2">{userTasks.completed}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{userTasks.completionRate}% complete</p>
        </div>

        {/* In Progress */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">In Progress</p>
              <p className="text-4xl font-black text-orange-600 dark:text-orange-400 mt-2">{userTasks.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Currently working</p>
        </div>

        {/* Pending */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Pending</p>
              <p className="text-4xl font-black text-blue-600 dark:text-blue-400 mt-2">{userTasks.pending}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Not started yet</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-black dark:text-white" />
            <h2 className="text-2xl font-bold text-black dark:text-white">Today's Tasks</h2>
          </div>

          {todaysTasks.length > 0 ? (
            <div className="space-y-3">
              {todaysTasks.map((task: any) => (
                <div key={task.id} className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-black dark:hover:border-white transition-colors">
                  <h3 className="font-bold text-black dark:text-white mb-1">{task.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{task.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      task.status === 'In Progress'
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                        : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                    }`}>
                      {task.status}
                    </span>
                    <button className="text-xs font-bold text-black dark:text-white hover:underline">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-zinc-600 dark:text-zinc-400 font-medium">All tasks completed today!</p>
            </div>
          )}
        </div>

        {/* Recent Successes */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-black dark:text-white" />
            <h2 className="text-2xl font-bold text-black dark:text-white">Recent Wins</h2>
          </div>

          {recentSuccesses.length > 0 ? (
            <div className="space-y-3">
              {recentSuccesses.map((success: any, idx: number) => (
                <div key={idx} className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-800">
                  <p className="font-bold text-green-900 dark:text-green-300 mb-1">{success.agent}</p>
                  <p className="text-sm text-green-700 dark:text-green-400">{success.detail}</p>
                  <p className="text-xs text-green-600 dark:text-green-500 mt-2">Type: {success.type}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-2" />
              <p className="text-zinc-600 dark:text-zinc-400 font-medium">No successes logged yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Progress</h2>
        
        <div className="space-y-4">
          {/* Completion Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-black dark:text-white">Overall Completion</p>
              <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">{userTasks.completionRate}%</span>
            </div>
            <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-600 dark:bg-green-400 transition-all"
                style={{ width: `${userTasks.completionRate}%` }}
              />
            </div>
          </div>

          {/* Task Status Breakdown */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-bold mb-2">Completed</p>
              <div className="w-full h-2 bg-green-200 dark:bg-green-900/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 dark:bg-green-400"
                  style={{ width: `${(userTasks.completed / userTasks.total) * 100}%` }}
                />
              </div>
              <p className="text-xs text-zinc-500 mt-1">{userTasks.completed}/{userTasks.total}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-bold mb-2">In Progress</p>
              <div className="w-full h-2 bg-orange-200 dark:bg-orange-900/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-600 dark:bg-orange-400"
                  style={{ width: `${(userTasks.inProgress / userTasks.total) * 100}%` }}
                />
              </div>
              <p className="text-xs text-zinc-500 mt-1">{userTasks.inProgress}/{userTasks.total}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-bold mb-2">Pending</p>
              <div className="w-full h-2 bg-blue-200 dark:bg-blue-900/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 dark:bg-blue-400"
                  style={{ width: `${(userTasks.pending / userTasks.total) * 100}%` }}
                />
              </div>
              <p className="text-xs text-zinc-500 mt-1">{userTasks.pending}/{userTasks.total}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
