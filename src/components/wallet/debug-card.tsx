import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface DebugCardProps {
  logs: string[];
}

export function DebugCard({ logs }: DebugCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(logs.join('\n'));
    toast.success('Debug logs copied to clipboard');
  };

  return (
    <div className="mt-6 p-4 bg-gray-900 rounded-lg text-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <h3 className="text-sm font-medium">Debug Logs</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLogs}
            className="p-1 hover:bg-gray-800 rounded"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-800 rounded"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-1 font-mono text-xs max-h-60 overflow-auto">
          {logs.map((log, index) => (
            <div
              key={index}
              className="py-1 border-b border-gray-800 last:border-0"
            >
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}