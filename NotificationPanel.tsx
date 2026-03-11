import React, { useContext } from 'react';
import { AppContext } from './Root';
import { X, Check, AlertCircle, Clock } from 'lucide-react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const ctx = useContext(AppContext);
  const taskNotifications = ctx?.taskNotifications || [];
  const userEmail = ctx?.user?.email || '';

  const assignedToMe = taskNotifications.filter(
    (notification: any) => notification.assignedTo?.toLowerCase() === userEmail.toLowerCase(),
  );

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'medium':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default:
        return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'done':
        return <Check className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-zinc-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl z-50">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <h3 className="font-bold text-zinc-900 dark:text-white">Notifications</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-zinc-500" />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {assignedToMe.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              No notifications at the moment
            </div>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {assignedToMe.map((notif: any, idx: number) => (
              <div
                key={idx}
                className="px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getStatusIcon(notif.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                        {notif.title || 'Untitled Task'}
                      </h4>
                      {notif.priority && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getPriorityColor(notif.priority)}`}>
                          {notif.priority}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                      {notif.description || 'No description'}
                    </p>
                    {notif.dueDate && (
                      <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
                        Due: {new Date(notif.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-3 bg-zinc-50 dark:bg-zinc-900 rounded-b-2xl">
        <button className="text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
          View all notifications
        </button>
      </div>
    </div>
  );
}
