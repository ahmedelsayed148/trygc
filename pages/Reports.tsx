import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../Root';
import { FileText, Download, Calendar, Filter, Eye, Plus } from 'lucide-react';

export function Reports() {
  const ctx = useContext(AppContext);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedTeam, setSelectedTeam] = useState('All');

  const tasks = ctx?.tasks || [];
  const teamMembers = ctx?.teamMembers || [];

  // Get unique teams
  const teams = useMemo(() => {
    const teamSet = new Set(tasks.map((t: any) => t.team).filter(Boolean));
    return Array.from(teamSet);
  }, [tasks]);

  // Generate report data
  const reportData = useMemo(() => {
    const filtered = selectedTeam === 'All' 
      ? tasks 
      : tasks.filter((t: any) => t.team === selectedTeam);

    const total = filtered.length;
    const completed = filtered.filter((t: any) => t.status === 'Completed').length;
    const inProgress = filtered.filter((t: any) => t.status === 'In Progress').length;

    return {
      period: selectedPeriod,
      team: selectedTeam,
      total,
      completed,
      inProgress,
      pending: total - completed - inProgress,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      averageTasksPerMember: teamMembers.length > 0 ? Math.ceil(total / teamMembers.length) : 0,
    };
  }, [tasks, selectedTeam, selectedPeriod, teamMembers]);

  const reports = [
    {
      id: 1,
      name: 'Weekly Summary',
      period: 'Last 7 days',
      generated: 'Today',
      type: 'Summary',
    },
    {
      id: 2,
      name: 'Monthly Performance',
      period: 'Last 30 days',
      generated: 'Today',
      type: 'Performance',
    },
    {
      id: 3,
      name: 'Team Velocity',
      period: 'Last 30 days',
      generated: 'Yesterday',
      type: 'Velocity',
    },
    {
      id: 4,
      name: 'Individual Contributions',
      period: 'Last 30 days',
      generated: 'Today',
      type: 'Contributions',
    },
  ];

  const handleDownloadReport = (reportId: number) => {
    console.log('[v0] Downloading report:', reportId);
    // In a real app, this would trigger a download
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-black to-zinc-800 dark:from-zinc-900 dark:to-black rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-1">Reports</h1>
              <p className="text-zinc-300 text-lg font-medium">Performance reports and insights</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-2xl hover:shadow-lg transition-all">
            <Plus className="w-5 h-5" />
            New Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-black dark:text-white mb-3">Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none text-black dark:text-white text-sm font-bold"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-black dark:text-white mb-3">Team</label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none text-black dark:text-white text-sm font-bold"
            >
              <option value="All">All Teams</option>
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Total Tasks</p>
          <p className="text-4xl font-black text-black dark:text-white mt-2">{reportData.total}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Completion</p>
          <p className="text-4xl font-black text-green-600 dark:text-green-400 mt-2">{reportData.completionRate}%</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">In Progress</p>
          <p className="text-4xl font-black text-orange-600 dark:text-orange-400 mt-2">{reportData.inProgress}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Avg/Member</p>
          <p className="text-4xl font-black text-blue-600 dark:text-blue-400 mt-2">{reportData.averageTasksPerMember}</p>
        </div>
      </div>

      {/* Available Reports */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black dark:text-white">Available Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white">{report.name}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{report.period}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white">
                  {report.type}
                </span>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="font-bold">Generated:</span> {report.generated}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors font-bold text-sm">
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button onClick={() => handleDownloadReport(report.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:shadow-lg transition-all font-bold text-sm">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-3xl shadow-lg border border-blue-200 dark:border-blue-800 p-8">
        <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-4">Quick Insights</h3>
        <ul className="space-y-2 text-blue-800 dark:text-blue-200">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">•</span>
            <span>Completion rate is <strong>{reportData.completionRate}%</strong> - {reportData.completionRate > 70 ? 'great progress!' : 'keep pushing!'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">•</span>
            <span>Average of <strong>{reportData.averageTasksPerMember}</strong> tasks per team member this {selectedPeriod}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">•</span>
            <span>Currently <strong>{reportData.inProgress}</strong> tasks in progress - stay focused!</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
