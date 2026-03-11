import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../Root';
import { Users, Search, Plus, Edit2, Trash2, Shield, Ban, CheckCircle2 } from 'lucide-react';

export function UserManagement() {
  const ctx = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'member', team: '' });

  const teamMembers = ctx?.teamMembers || [];
  const setTeamMembers = ctx?.setTeamMembers || (() => {});

  const teams = useMemo(() => {
    const teamSet = new Set(teamMembers.map((m: any) => m.team).filter(Boolean));
    return Array.from(teamSet);
  }, [teamMembers]);

  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member: any) => {
      const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'All' || member.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [teamMembers, searchTerm, filterRole]);

  const stats = useMemo(() => {
    return {
      total: teamMembers.length,
      admins: teamMembers.filter((m: any) => m.role === 'admin').length,
      members: teamMembers.filter((m: any) => m.role === 'member').length,
      active: teamMembers.filter((m: any) => m.status === 'active').length,
    };
  }, [teamMembers]);

  const handleAddUser = () => {
    if (formData.name && formData.email) {
      const newUser = {
        id: Math.max(...teamMembers.map((m: any) => m.id || 0), 0) + 1,
        ...formData,
        status: 'active',
      };
      setTeamMembers([newUser, ...teamMembers]);
      setFormData({ name: '', email: '', role: 'member', team: '' });
      setShowForm(false);
    }
  };

  const handleChangeRole = (id: number, newRole: string) => {
    setTeamMembers(teamMembers.map((m: any) =>
      m.id === id ? { ...m, role: newRole } : m
    ));
  };

  const handleToggleStatus = (id: number) => {
    setTeamMembers(teamMembers.map((m: any) =>
      m.id === id ? { ...m, status: m.status === 'active' ? 'suspended' : 'active' } : m
    ));
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this user?')) {
      setTeamMembers(teamMembers.filter((m: any) => m.id !== id));
    }
  };

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
              <h1 className="text-4xl font-black mb-1">User Management</h1>
              <p className="text-zinc-300 text-lg font-medium">Manage users, roles, and permissions</p>
            </div>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-2xl hover:shadow-lg transition-all">
            <Plus className="w-5 h-5" />
            Add User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Total Users</p>
          <p className="text-4xl font-black text-black dark:text-white mt-2">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Admins</p>
          <p className="text-4xl font-black text-blue-600 dark:text-blue-400 mt-2">{stats.admins}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Members</p>
          <p className="text-4xl font-black text-green-600 dark:text-green-400 mt-2">{stats.members}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold uppercase">Active</p>
          <p className="text-4xl font-black text-purple-600 dark:text-purple-400 mt-2">{stats.active}</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
          <h3 className="text-xl font-bold text-black dark:text-white mb-4">Add New User</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-none text-black dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-none text-black dark:text-white text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-none text-black dark:text-white text-sm"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">Team</label>
                <input
                  type="text"
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  placeholder="Team name"
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-none text-black dark:text-white text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddUser}
                className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg hover:shadow-lg transition-all"
              >
                Add User
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
              placeholder="Search users..."
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none text-black dark:text-white text-sm font-medium"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none text-black dark:text-white text-sm font-bold min-w-40"
          >
            <option value="All">All Roles</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 overflow-hidden">
        {filteredMembers.length > 0 ? (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {filteredMembers.map((member: any) => (
              <div key={member.id} className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-black dark:text-white">{member.name}</h3>
                      {member.role === 'admin' && (
                        <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{member.email}</p>
                    {member.team && (
                      <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">{member.team}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={member.role}
                        onChange={(e) => handleChangeRole(member.id, e.target.value)}
                        className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-none text-black dark:text-white text-xs font-bold"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleToggleStatus(member.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        member.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-red-100 dark:hover:bg-red-900/30'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-green-100 dark:hover:bg-green-900/30'
                      }`}
                    >
                      {member.status === 'active' ? 'Active' : 'Suspended'}
                    </button>

                    <button onClick={() => handleDelete(member.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-600 dark:text-zinc-400 font-medium text-lg">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
