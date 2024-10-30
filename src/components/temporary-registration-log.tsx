import { useState, useEffect } from 'react';
import { ClipboardCopy } from 'lucide-react';
import toast from 'react-hot-toast';

interface LogEntry {
  timestamp: string;
  type: 'info' | 'error' | 'success';
  message: string;
}

export function TemporaryRegistrationLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const handleLog = (event: CustomEvent<LogEntry>) => {
      setLogs(prev => [...prev, event.detail]);
    };

    window.addEventListener('registration-log' as any, handleLog);
    return () => window.removeEventListener('registration-log' as any, handleLog);
  }, []);

  const copyLogs = () => {
    const logText = logs
      .map(log => `[${log.timestamp}] ${log.type.toUpperCase()}: ${log.message}`)
      .join('\n');
    navigator.clipboard.writeText(logText);
    toast.success('Logs copied to clipboard');
  };

  if (logs.length === 0) return null;

  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">Registration Log</h3>
        <button
          onClick={copyLogs}
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
        >
          <ClipboardCopy className="w-3 h-3" />
          Copy
        </button>
      </div>
      <div className="space-y-1 text-xs font-mono">
        {logs.map((log, index) => (
          <div
            key={index}
            className={`py-1 ${
              log.type === 'error'
                ? 'text-red-600'
                : log.type === 'success'
                ? 'text-emerald-600'
                : 'text-gray-600'
            }`}
          >
            [{log.timestamp}] {log.type.toUpperCase()}: {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}