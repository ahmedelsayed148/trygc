import React, { useContext, useMemo, useState } from 'react';
import { LogOut, Upload, Trophy, Bell, ClipboardList, Search, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useLocation } from 'react-router';
import { ThemeToggle } from './ThemeToggle';
import { NotificationPanel } from './NotificationPanel';
import { SOPModal } from './SOPModal';
import { AppContext } from './Root';
import { getCurrentNavItem } from '../lib/navigation';

interface TopBarProps {
  connectionState: 'idle' | 'loading' | 'online' | 'syncing' | 'error';
  lastSyncError: string | null;
  onOpenCommandPalette: () => void;
  userName: string;
  userEmail: string;
  isAdmin: boolean;
  onLogout: () => void;
  onRefreshWorkspace: () => void;
  onOpenUpload: () => void;
  onOpenSuccess: () => void;
  saveState: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved: Date | null;
}

export function TopBar({ 
  connectionState,
  lastSyncError,
  onOpenCommandPalette,
  userName, 
  userEmail, 
  isAdmin, 
  onLogout, 
  onRefreshWorkspace,
  onOpenUpload,
  onOpenSuccess,
  saveState,
  lastSaved 
}: TopBarProps) {
  const ctx = useContext(AppContext);
  const taskNotifications = ctx?.taskNotifications || [];
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSOPOpen, setIsSOPOpen] = useState(false);
  const location = useLocation();
  const currentNavItem = getCurrentNavItem(location.pathname);
  const assignmentNotificationCount = useMemo(
    () =>
      taskNotifications.filter(
        (notification: any) => notification.assignedTo?.toLowerCase() === userEmail.toLowerCase(),
      ).length,
    [taskNotifications, userEmail],
  );
  const lastSavedLabel = lastSaved
    ? lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;
  const statusLabel = saveState === 'saving'
    ? 'Syncing changes'
    : saveState === 'error'
    ? 'Sync issue'
    : lastSavedLabel
    ? `Saved ${lastSavedLabel}`
    : 'Ready';
  const isOffline = connectionState === 'error';

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
      <div className="flex flex-col gap-4 px-6 py-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.28em] text-zinc-400 dark:text-zinc-500">
              Connected Workspace
            </div>
            <div className="mt-1 flex items-center gap-3">
              <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                {currentNavItem.label}
              </h2>
              <div className="hidden rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 sm:block">
                {location.pathname}
              </div>
            </div>
            <p className="mt-1 max-w-2xl text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {currentNavItem.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
          <button
            onClick={onOpenCommandPalette}
            className="flex min-w-[220px] items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-left transition-all hover:border-zinc-300 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/80"
            title="Open command palette"
          >
            <div className="flex items-center gap-3">
              <Search className="h-4 w-4 text-zinc-400" />
              <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">Search, jump, or act</span>
            </div>
            <span className="rounded-lg bg-white px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 shadow-sm dark:bg-zinc-950">
              Ctrl K
            </span>
          </button>

          <div className={`flex items-center gap-2 rounded-2xl border px-3 py-2 ${
            isOffline
              ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-black'
              : 'border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
          }`}>
            {isOffline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-[0.18em]">
                {connectionState === 'syncing' ? 'Syncing' : isOffline ? 'Attention' : 'Connected'}
              </span>
              <span className="text-[10px] font-medium opacity-80">
                {lastSyncError || statusLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className={`w-2 h-2 rounded-full ${
              saveState === 'saving'
                ? 'bg-zinc-500 animate-pulse'
                : saveState === 'error'
                ? 'bg-zinc-900 dark:bg-zinc-100'
                : lastSaved
                ? 'bg-black dark:bg-white'
                : 'bg-zinc-300'
            }`}></div>
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
              {statusLabel}
            </span>
          </div>

          <button
            onClick={onRefreshWorkspace}
            className="p-3 rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-500 transition-all hover:border-zinc-300 hover:text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
            title="Refresh workspace"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsSOPOpen(true)}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-black"
            title="SOP & Roles"
          >
            <ClipboardList className="w-4 h-4" />
            <span className="hidden sm:inline">SOP & Roles</span>
          </button>

          <button
            onClick={onOpenSuccess}
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg transition-colors"
            title="Log update"
          >
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">Add Update</span>
          </button>

          {isAdmin && (
            <button
              onClick={onOpenUpload}
              className="px-4 py-2 bg-black text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-md dark:bg-white dark:text-black dark:hover:bg-zinc-100"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </button>
          )}

          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all relative"
            >
              <Bell className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              {assignmentNotificationCount > 0 && (
                <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-black px-1.5 py-0.5 text-[10px] font-black text-white dark:bg-white dark:text-black">
                  {assignmentNotificationCount}
                </span>
              )}
            </button>
            <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>

          <ThemeToggle />

          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black text-xs uppercase">
              {(userName || userEmail).substring(0, 2)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200 max-w-[120px] truncate leading-none">
                {userName || userEmail}
              </span>
              <span className="text-[8px] font-black uppercase tracking-widest leading-none mt-0.5 text-zinc-500 dark:text-zinc-400">
                {isAdmin ? 'Admin' : 'Member'}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-black dark:hover:text-white transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* SOP Modal */}
      <SOPModal isOpen={isSOPOpen} onClose={() => setIsSOPOpen(false)} />
    </header>
  );
}
