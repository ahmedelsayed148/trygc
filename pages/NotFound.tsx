import React from 'react';
import { useNavigate } from 'react-router';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-zinc-50 dark:from-black dark:to-zinc-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-200 dark:border-red-800">
          <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
        </div>

        {/* Content */}
        <h1 className="text-5xl font-black text-black dark:text-white mb-2">404</h1>
        <h2 className="text-2xl font-bold text-black dark:text-white mb-3">Page Not Found</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-bold rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:shadow-lg transition-all"
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-500">
          Error Code: 404 | TRYGC Operations Dashboard
        </p>
      </div>
    </div>
  );
}
