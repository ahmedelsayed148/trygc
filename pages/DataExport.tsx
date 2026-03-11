import React, { useContext, useState } from 'react';
import { AppContext } from '../Root';
import { Download, FileJson, FileText, Copy, Check, AlertCircle } from 'lucide-react';

export function DataExport() {
  const ctx = useContext(AppContext);
  const [exportFormat, setExportFormat] = useState('json');
  const [selectedData, setSelectedData] = useState({
    tasks: true,
    successLogs: true,
    mistakes: true,
    notifications: true,
  });
  const [copied, setCopied] = useState(false);

  const tasks = ctx?.tasks || [];
  const successLogs = ctx?.successLogs || [];
  const mistakes = ctx?.mistakes || [];
  const taskNotifications = ctx?.taskNotifications || [];

  const getExportData = () => {
    const data: any = {};
    if (selectedData.tasks) data.tasks = tasks;
    if (selectedData.successLogs) data.successLogs = successLogs;
    if (selectedData.mistakes) data.mistakes = mistakes;
    if (selectedData.notifications) data.taskNotifications = taskNotifications;
    return data;
  };

  const handleExport = () => {
    const data = getExportData();
    let content = '';
    let filename = '';

    if (exportFormat === 'json') {
      content = JSON.stringify(data, null, 2);
      filename = `export-${new Date().toISOString().split('T')[0]}.json`;
    } else if (exportFormat === 'csv') {
      // Convert to CSV format
      const rows = [['Type', 'ID', 'Title', 'Status', 'Data']];
      if (selectedData.tasks) {
        tasks.forEach((t: any) => {
          rows.push(['Task', t.id, t.title, t.status, JSON.stringify(t)]);
        });
      }
      content = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
      filename = `export-${new Date().toISOString().split('T')[0]}.csv`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const handleCopyToClipboard = () => {
    const data = getExportData();
    const text = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-black to-zinc-800 dark:from-zinc-900 dark:to-black rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
            <Download className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black mb-1">Data Export</h1>
            <p className="text-zinc-300 text-lg font-medium">Backup and export your workspace data</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-3xl p-6 flex gap-4">
        <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        <div>
          <p className="font-bold text-blue-900 dark:text-blue-300 mb-1">Secure Export</p>
          <p className="text-sm text-blue-800 dark:text-blue-200">Your data is exported securely. No external servers are involved. The export is generated locally in your browser.</p>
        </div>
      </div>

      {/* Export Format */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-bold text-black dark:text-white mb-4">Export Format</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="relative cursor-pointer">
            <input
              type="radio"
              name="format"
              value="json"
              checked={exportFormat === 'json'}
              onChange={(e) => setExportFormat(e.target.value)}
              className="absolute opacity-0"
            />
            <div className={`p-6 rounded-2xl border-2 transition-all ${
              exportFormat === 'json'
                ? 'border-black dark:border-white bg-zinc-50 dark:bg-zinc-800'
                : 'border-zinc-200 dark:border-zinc-700 hover:border-black dark:hover:border-white'
            }`}>
              <FileJson className={`w-8 h-8 mb-2 ${
                exportFormat === 'json'
                  ? 'text-black dark:text-white'
                  : 'text-zinc-400'
              }`} />
              <p className="font-bold text-black dark:text-white">JSON</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Structured format, best for re-import</p>
            </div>
          </label>

          <label className="relative cursor-pointer">
            <input
              type="radio"
              name="format"
              value="csv"
              checked={exportFormat === 'csv'}
              onChange={(e) => setExportFormat(e.target.value)}
              className="absolute opacity-0"
            />
            <div className={`p-6 rounded-2xl border-2 transition-all ${
              exportFormat === 'csv'
                ? 'border-black dark:border-white bg-zinc-50 dark:bg-zinc-800'
                : 'border-zinc-200 dark:border-zinc-700 hover:border-black dark:hover:border-white'
            }`}>
              <FileText className={`w-8 h-8 mb-2 ${
                exportFormat === 'csv'
                  ? 'text-black dark:text-white'
                  : 'text-zinc-400'
              }`} />
              <p className="font-bold text-black dark:text-white">CSV</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Spreadsheet format, compatible with Excel</p>
            </div>
          </label>
        </div>
      </div>

      {/* Select Data */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-bold text-black dark:text-white mb-4">Include Data</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedData.tasks}
              onChange={(e) => setSelectedData({ ...selectedData, tasks: e.target.checked })}
              className="w-5 h-5 rounded"
            />
            <div>
              <p className="font-bold text-black dark:text-white">Tasks ({tasks.length})</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">All task records</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedData.successLogs}
              onChange={(e) => setSelectedData({ ...selectedData, successLogs: e.target.checked })}
              className="w-5 h-5 rounded"
            />
            <div>
              <p className="font-bold text-black dark:text-white">Success Logs ({successLogs.length})</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Win and achievement records</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedData.mistakes}
              onChange={(e) => setSelectedData({ ...selectedData, mistakes: e.target.checked })}
              className="w-5 h-5 rounded"
            />
            <div>
              <p className="font-bold text-black dark:text-white">Mistakes ({mistakes.length})</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Issue and mistake tracking</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedData.notifications}
              onChange={(e) => setSelectedData({ ...selectedData, notifications: e.target.checked })}
              className="w-5 h-5 rounded"
            />
            <div>
              <p className="font-bold text-black dark:text-white">Notifications ({taskNotifications.length})</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Task alerts and notifications</p>
            </div>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:shadow-lg transition-all text-lg"
        >
          <Download className="w-6 h-6" />
          Download Export
        </button>

        <button
          onClick={handleCopyToClipboard}
          className={`flex items-center justify-center gap-2 px-6 py-4 font-bold rounded-2xl transition-all text-lg ${
            copied
              ? 'bg-green-600 dark:bg-green-400 text-white dark:text-black'
              : 'bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-6 h-6" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-6 h-6" />
              Copy to Clipboard
            </>
          )}
        </button>
      </div>

      {/* Summary */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-bold text-black dark:text-white mb-4">Export Summary</h3>
        <div className="space-y-2 text-sm">
          <p className="flex items-center justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Format:</span>
            <span className="font-bold text-black dark:text-white">{exportFormat.toUpperCase()}</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Total Records:</span>
            <span className="font-bold text-black dark:text-white">
              {(selectedData.tasks ? tasks.length : 0) +
               (selectedData.successLogs ? successLogs.length : 0) +
               (selectedData.mistakes ? mistakes.length : 0) +
               (selectedData.notifications ? taskNotifications.length : 0)}
            </span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Generated:</span>
            <span className="font-bold text-black dark:text-white">{new Date().toLocaleString()}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
