import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../Root';
import { Users, Search, Plus, UserPlus, AlertCircle, CheckCircle2, Zap } from 'lucide-react';

export function CommunityTeam() {
  const ctx = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const tasks = ctx?.tasks || [];
  const teamMembers = ctx?.teamMembers || [];
  const tasksPerTeam = ctx?.tasksPerTeam || {};

  // Get unique teams
  const teams = useMemo(() => {
    const teamSet = new Set(tasks.map((t: any) => t.team).filter(Boolean));
    return Array.from(teamSet);
  }, [tasks]);

  // Get tasks by team
  const teamTasksMap = useMemo(() => {
    const map: Record<string, any[]> = {};
    teams.forEach((team) => {
      map[team] = tasks.filter((t: any) => t.team === team);
    });
    return map;
  }, [tasks, teams]);

  // Filter team members
  const filteredMembers = useMemo(() => {
    let members = teamMembers;
    if (selectedTeam) {
      members = members.filter((m: any) => m.team === selectedTeam);
    }
    if (searchTerm) {
      members = members.filter((m: any) =>
        m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return members;
  }, [teamMembers, selectedTeam, searchTerm]);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-black to-zinc-800 dark:from-zinc-900 dark:to-black rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-1">Community & Teams</h1>
              <p className="text-zinc-300 text-lg font-medium">Manage team assignments and coverage</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-2xl hover:shadow-lg transition-all">
            <UserPlus className="w-5 h-5" />
            Add Member
          </button>
        </div>
      </div>

      {/* Teams Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={() => setSelectedTeam(null)}
          className={`p-6 rounded-2xl shadow-lg border transition-all text-left ${
            selectedTeam === null
              ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
              : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-black dark:text-white hover:border-black dark:hover:border-white'
          }`}
        >
          <p className="font-bold text-sm uppercase opacity-75">All Teams</p>
          <p className="text-3xl font-black mt-2">{teamMembers.length}</p>
        </button>

        {teams.map((team) => {
          const teamTaskCount = teamTasksMap[team]?.length || 0;
          const completedCount = teamTasksMap[team]?.filter((t: any) => t.status === 'Completed').length || 0;

          return (
            <button
              key={team}
              onClick={() => setSelectedTeam(team)}
              className={`p-6 rounded-2xl shadow-lg border transition-all text-left ${
                selectedTeam === team
                  ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                  : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-black dark:text-white hover:border-black dark:hover:border-white'
              }`}
            >
              <p className="font-bold text-sm uppercase opacity-75">{team}</p>
              <p className="text-3xl font-black mt-2">{teamTaskCount}</p>
              <p className="text-xs opacity-75 mt-1">{completedCount} completed</p>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search team members..."
            className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none text-black dark:text-white text-sm font-medium"
          />
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member: any) => {
            const memberTasks = tasks.filter((t: any) => t.assignee === member.email);
            const completedTasks = memberTasks.filter((t: any) => t.status === 'Completed').length;
            const completionRate = memberTasks.length > 0 
              ? Math.round((completedTasks / memberTasks.length) * 100)
              : 0;

            return (
              <div key={member.id} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-800 overflow-hidden hover:shadow-xl transition-shadow">
                {/* Header */}
                <div className="h-24 bg-gradient-to-br from-blue-400 to-blue-600" />

                {/* Content */}
                <div className="p-6 -mt-12 relative">
                  <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center border-4 border-white dark:border-zinc-900 mx-auto mb-4">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-black dark:text-white text-center mb-1">{member.name}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center mb-4">{member.team}</p>

                  {/* Stats */}
                  <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3 mb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Tasks</span>
                      <span className="font-bold text-black dark:text-white">{memberTasks.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Completion</span>
                      <span className="font-bold text-green-600 dark:text-green-400">{completionRate}%</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-600 dark:bg-green-400"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Active Tasks */}
                  <div className="mb-4">
                    <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-2">Active Tasks</p>
                    <div className="space-y-1">
                      {memberTasks
                        .filter((t: any) => t.status === 'In Progress')
                        .slice(0, 2)
                        .map((task: any) => (
                          <p key={task.id} className="text-xs text-zinc-700 dark:text-zinc-300 line-clamp-1">
                            • {task.title}
                          </p>
                        ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <p className="text-xs text-zinc-500 text-center border-t border-zinc-200 dark:border-zinc-700 pt-3">
                    {member.email}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-16">
            <Users className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-600 dark:text-zinc-400 font-medium text-lg">No team members found</p>
          </div>
        )}
      </div>
    </div>
  );
}
