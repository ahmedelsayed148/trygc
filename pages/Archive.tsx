import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../Root';
import { Archive, Search, Calendar, Eye, Trash2, Download, Filter } from 'lucide-react';

export function Archive() {
  const ctx = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState('All');

  const tasks = ctx?.tasks || [];

  // Get completed tasks
  const archivedTasks = useMemo(() => {
    const completed = tasks.filter((t: any) => t.status === 'Completed');
    
    return completed.filter((task: any) => {
      const taskDate = new Date(task.completedAt || task.createdAt || new Date());
      const taskYear = taskDate.getFullYear().toString();
      const taskMonth = (taskDate.getMonth() + 1).toString().padStart(2, '0');
      
      const matchesYear = taskYear === selectedYear;
      const matchesMonth = selectedMonth === 'All' || taskMonth === selectedMonth;
      const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesYear && matchesMonth && matchesSearch;
    });
  }, [tasks, searchTerm, selectedYear, selectedMonth]);

  const stats = useMemo(() => {
    const completed = tasks.filter((t: any) => t.status === 'Completed').length;
    return {
      total: tasks.length,
      completed,
      archived: archivedTasks.length,
      completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
    };
  }, [tasks, archivedTasks]);

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const handleExportArchive = () => {
    const data = JSON.stringify(archivedTasks, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `archive-${selectedYear}-${selectedMonth}.json`;
    a.click();
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-black to-zinc-800 dark:from-zinc-900 dark:to-black rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
            <Archive className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black mb-1">Archive</h1>
            <p className="text-zinc-300 text-lg font-medium">Historical records and completed tasks</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Archived Tasks</p>
          <p className="text-4xl font-black text-black dark:text-white mt-2">{stats.completed}</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-3">All time completed</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">In Current View</p>
          <p className="text-4xl font-black text-green-600 dark:text-green-400 mt-2">{archivedTasks.length}</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-3">Filtered results</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Overall Rate</p>
          <p className="text-4xl font-black text-blue-600 dark:text-blue-400 mt-2">{stats.completionRate}%</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-3">Completion rate</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search archived tasks..."
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none text-black dark:text-white text-sm font-medium"
            />
          </div>

          {/* Year */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none text-black dark:text-white text-sm font-bold"
          >
            <option value={new Date().getFullYear().toString()}>This Year</option>
            {[2024, 2023, 2022].map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>

          {/* Month */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none text-black dark:text-white text-sm font-bold"
          >
            <option value="All">All Months</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button onClick={handleExportArchive} className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:shadow-lg transition-all">
          <Download className="w-5 h-5" />
          Export Archive
        </button>
      </div>

      {/* Timeline View */}
      {archivedTasks.length > 0 ? (
        <div className="space-y-4">
          {archivedTasks.map((task: any, idx: number) => (
            <div key={task.id || idx} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-green-100 dark:border-green-900 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-green-600 dark:bg-green-400 rounded-full" />
                    <h3 className="text-lg font-bold text-black dark:text-white line-through opacity-75">{task.title}</h3>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">{task.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-xs">
                    {task.team && (
                      <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                        <span className="font-bold">Team:</span> {task.team}
                      </div>
                    )}
                    {task.completedAt && (
                      <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(task.completedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  </button>
                  <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800">
          <Archive className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-600 dark:text-zinc-400 font-medium text-lg">No archived tasks</p>
          <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-1">Completed tasks will appear here</p>
        </div>
      )}
    </div>
  );
}
