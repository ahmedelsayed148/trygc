import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../Root';
import { AlertTriangle, Search, Plus, Edit2, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export function MistakeLogger() {
  const ctx = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ agent: '', detail: '', severity: 'Medium' });

  const mistakes = ctx?.mistakes || [];
  const setMistakes = ctx?.setMistakes || (() => {});

  const filteredMistakes = useMemo(() => {
    return mistakes.filter((mistake: any) => {
      const matchesSearch = mistake.agent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          mistake.detail?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || mistake.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [mistakes, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: mistakes.length,
      open: mistakes.filter((m: any) => m.status !== 'Resolved').length,
      resolved: mistakes.filter((m: any) => m.status === 'Resolved').length,
      critical: mistakes.filter((m: any) => m.severity === 'Critical').length,
    };
  }, [mistakes]);

  const handleAddMistake = () => {
    if (formData.agent && formData.detail) {
      const newMistake = {
        id: Math.max(...mistakes.map((m: any) => m.id || 0), 0) + 1,
        ...formData,
        status: 'Open',
        timestamp: new Date().toISOString(),
      };
      setMistakes([newMistake, ...mistakes]);
      setFormData({ agent: '', detail: '', severity: 'Medium' });
      setShowForm(false);
    }
  };

  const handleResolveMistake = (id: number) => {
    setMistakes(mistakes.map((m: any) =>
      m.id === id ? { ...m, status: 'Resolved', resolvedAt: new Date().toISOString() } : m
    ));
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this mistake log?')) {
      setMistakes(mistakes.filter((m: any) => m.id !== id));
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-black to-zinc-800 dark:from-zinc-900 dark:to-black rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-1">Mistake Logger</h1>
              <p className="text-zinc-300 text-lg font-medium">Track and resolve issues and mistakes</p>
            </div>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-2xl hover:shadow-lg transition-all">
            <Plus className="w-5 h-5" />
            Log Mistake
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Total</p>
          <p className="text-4xl font-black text-black dark:text-white mt-2">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Open</p>
          <p className="text-4xl font-black text-red-600 dark:text-red-400 mt-2">{stats.open}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Critical</p>
          <p className="text-4xl font-black text-orange-600 dark:text-orange-400 mt-2">{stats.critical}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Resolved</p>
          <p className="text-4xl font-black text-green-600 dark:text-green-400 mt-2">{stats.resolved}</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
          <h3 className="text-xl font-bold text-black dark:text-white mb-4">Log New Mistake</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-black dark:text-white mb-2">Agent/Team</label>
              <input
                type="text"
                value={formData.agent}
                onChange={(e) => setFormData({ ...formData, agent: e.target.value })}
                placeholder="Who made the mistake?"
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-none text-black dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black dark:text-white mb-2">Details</label>
              <textarea
                value={formData.detail}
                onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                placeholder="What went wrong?"
                rows={3}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-none text-black dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black dark:text-white mb-2">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-none text-black dark:text-white text-sm"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddMistake}
                className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg hover:shadow-lg transition-all"
              >
                Log Mistake
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-bold rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search mistakes..."
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none text-black dark:text-white text-sm font-medium"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none text-black dark:text-white text-sm font-bold min-w-40"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Mistakes List */}
      <div className="space-y-4">
        {filteredMistakes.length > 0 ? (
          filteredMistakes.map((mistake: any) => (
            <div
              key={mistake.id}
              className={`rounded-2xl shadow-lg border p-6 transition-all ${
                mistake.status === 'Resolved'
                  ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                  : mistake.severity === 'Critical'
                  ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                  : mistake.severity === 'High'
                  ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800'
                  : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {mistake.severity === 'Critical' ? (
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    )}
                    <span className="font-bold text-black dark:text-white">{mistake.agent}</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      mistake.severity === 'Critical'
                        ? 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-200'
                        : 'bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-200'
                    }`}>
                      {mistake.severity}
                    </span>
                    {mistake.status === 'Resolved' && (
                      <span className="px-2 py-1 rounded text-xs font-bold bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-200">
                        Resolved
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 mb-2">{mistake.detail}</p>
                  <p className="text-xs text-zinc-500">{new Date(mistake.timestamp).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  {mistake.status !== 'Resolved' && (
                    <button
                      onClick={() => handleResolveMistake(mistake.id)}
                      className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Resolve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(mistake.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-800">
            <AlertTriangle className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-600 dark:text-zinc-400 font-medium text-lg">No mistakes logged</p>
          </div>
        )}
      </div>
    </div>
  );
}
