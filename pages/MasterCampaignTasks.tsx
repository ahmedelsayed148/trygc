import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../Root';
import { GitBranch, Search, Filter, Plus, Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

export function MasterCampaignTasks() {
  const ctx = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedParents, setExpandedParents] = useState<number[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);

  const tasks = ctx?.tasks || [];
  const opsCampaigns = ctx?.opsCampaigns || [];
  const setTasks = ctx?.setTasks || (() => {});

  // Get tasks for selected campaign
  const campaignTasks = useMemo(() => {
    if (!selectedCampaign) return [];
    
    const filtered = tasks.filter((t: any) => t.campaignId === selectedCampaign);
    
    // Group by parent task
    const grouped: Record<number, any[]> = {};
    const parents: any[] = [];

    filtered.forEach((task: any) => {
      if (task.parentTaskId) {
        if (!grouped[task.parentTaskId]) {
          grouped[task.parentTaskId] = [];
        }
        grouped[task.parentTaskId].push(task);
      } else {
        parents.push(task);
      }
    });

    return { parents, subtasks: grouped, total: filtered.length };
  }, [tasks, selectedCampaign]);

  const handleToggleExpand = (id: number) => {
    setExpandedParents(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: number) => {
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
              <GitBranch className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-1">Campaign Tasks</h1>
              <p className="text-zinc-300 text-lg font-medium">Manage task hierarchy and dependencies</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-2xl hover:shadow-lg transition-all">
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>
      </div>

      {/* Campaign Selector */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
        <label className="block text-sm font-bold text-black dark:text-white mb-3">Select Campaign</label>
        <select
          value={selectedCampaign || ''}
          onChange={(e) => setSelectedCampaign(e.target.value ? parseInt(e.target.value) : null)}
          className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none text-black dark:text-white text-sm font-medium"
        >
          <option value="">Choose a campaign...</option>
          {opsCampaigns.map((campaign: any) => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.name} ({campaign.status})
            </option>
          ))}
        </select>
      </div>

      {selectedCampaign ? (
        <>
          {/* Search */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none text-black dark:text-white text-sm font-medium"
              />
            </div>
          </div>

          {/* Task Hierarchy */}
          {campaignTasks.parents && campaignTasks.parents.length > 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 overflow-hidden">
              <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {campaignTasks.parents.map((parentTask: any) => {
                  const subtasks = campaignTasks.subtasks?.[parentTask.id] || [];
                  const isExpanded = expandedParents.includes(parentTask.id);

                  return (
                    <div key={parentTask.id}>
                      {/* Parent Task */}
                      <div className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                        <div className="flex items-center gap-3">
                          {subtasks.length > 0 && (
                            <button
                              onClick={() => handleToggleExpand(parentTask.id)}
                              className="flex-shrink-0 p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-5 h-5 text-black dark:text-white" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-black dark:text-white" />
                              )}
                            </button>
                          )}
                          {subtasks.length === 0 && (
                            <div className="w-7" />
                          )}

                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-black dark:text-white">{parentTask.title}</h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">{parentTask.description}</p>
                          </div>

                          <div className="flex-shrink-0 flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                              parentTask.status === 'Completed'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            }`}>
                              {parentTask.status}
                            </span>
                            <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors">
                              <Edit2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                            </button>
                            <button onClick={() => handleDelete(parentTask.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors">
                              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </button>
                          </div>
                        </div>

                        {subtasks.length > 0 && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2 ml-8">{subtasks.length} subtask{subtasks.length !== 1 ? 's' : ''}</p>
                        )}
                      </div>

                      {/* Subtasks */}
                      {isExpanded && subtasks.length > 0 && (
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 divide-y divide-zinc-200 dark:divide-zinc-700">
                          {subtasks.map((subtask: any) => (
                            <div key={subtask.id} className="p-4 pl-20 hover:bg-white dark:hover:bg-zinc-800 transition-colors">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-black dark:text-white">↳ {subtask.title}</h4>
                                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{subtask.description}</p>
                                </div>
                                <div className="flex-shrink-0 flex items-center gap-2">
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                                    subtask.status === 'Completed'
                                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                      : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                                  }`}>
                                    {subtask.status}
                                  </span>
                                  <button className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors">
                                    <Edit2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                                  </button>
                                  <button onClick={() => handleDelete(subtask.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors">
                                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800">
              <GitBranch className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-600 dark:text-zinc-400 font-medium text-lg">No tasks in this campaign</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800">
          <GitBranch className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-600 dark:text-zinc-400 font-medium text-lg">Select a campaign to view tasks</p>
        </div>
      )}
    </div>
  );
}
