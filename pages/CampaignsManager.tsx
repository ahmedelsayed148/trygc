import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../Root';
import { Calendar, Search, Filter, Plus, Edit2, Trash2, ArrowRight, TrendingUp } from 'lucide-react';

export function CampaignsManager() {
  const ctx = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showForm, setShowForm] = useState(false);

  const opsCampaigns = ctx?.opsCampaigns || [];
  const setOpsCampaigns = ctx?.setOpsCampaigns || (() => {});

  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
    return opsCampaigns.filter((campaign: any) => {
      const matchesSearch = campaign.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          campaign.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || campaign.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [opsCampaigns, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: opsCampaigns.length,
      active: opsCampaigns.filter((c: any) => c.status === 'Active').length,
      planning: opsCampaigns.filter((c: any) => c.status === 'Planning').length,
      completed: opsCampaigns.filter((c: any) => c.status === 'Completed').length,
    };
  }, [opsCampaigns]);

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this campaign?')) {
      setOpsCampaigns(opsCampaigns.filter((c: any) => c.id !== id));
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-black to-zinc-800 dark:from-zinc-900 dark:to-black rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-1">Campaigns</h1>
              <p className="text-zinc-300 text-lg font-medium">Manage marketing campaigns and initiatives</p>
            </div>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-2xl hover:shadow-lg transition-all">
            <Plus className="w-5 h-5" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Total</p>
          <p className="text-4xl font-black text-black dark:text-white mt-2">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Active</p>
          <p className="text-4xl font-black text-green-600 dark:text-green-400 mt-2">{stats.active}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Planning</p>
          <p className="text-4xl font-black text-blue-600 dark:text-blue-400 mt-2">{stats.planning}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Completed</p>
          <p className="text-4xl font-black text-purple-600 dark:text-purple-400 mt-2">{stats.completed}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search campaigns..."
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none text-black dark:text-white text-sm font-medium"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none text-black dark:text-white text-sm font-bold min-w-40"
          >
            <option value="All">All Status</option>
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.length > 0 ? (
          filteredCampaigns.map((campaign: any) => (
            <div key={campaign.id} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-800 overflow-hidden hover:shadow-xl transition-shadow">
              {/* Header */}
              <div className={`h-32 bg-gradient-to-br ${
                campaign.status === 'Active'
                  ? 'from-green-400 to-green-600'
                  : campaign.status === 'Planning'
                  ? 'from-blue-400 to-blue-600'
                  : 'from-purple-400 to-purple-600'
              }`} />

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">{campaign.name}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">{campaign.description}</p>

                {/* Status */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                    campaign.status === 'Active'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : campaign.status === 'Planning'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  }`}>
                    {campaign.status}
                  </span>
                </div>

                {/* Meta */}
                <div className="space-y-2 mb-4 text-sm">
                  {campaign.startDate && (
                    <p className="text-zinc-600 dark:text-zinc-400">
                      <span className="font-bold">Start:</span> {campaign.startDate}
                    </p>
                  )}
                  {campaign.endDate && (
                    <p className="text-zinc-600 dark:text-zinc-400">
                      <span className="font-bold">End:</span> {campaign.endDate}
                    </p>
                  )}
                  {campaign.budget && (
                    <p className="text-zinc-600 dark:text-zinc-400">
                      <span className="font-bold">Budget:</span> ${campaign.budget}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors font-bold text-sm">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button onClick={() => handleDelete(campaign.id)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors font-bold text-sm text-red-600 dark:text-red-400">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <Calendar className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-600 dark:text-zinc-400 font-medium text-lg">No campaigns found</p>
            <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-1">Create your first campaign to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
