import React from 'react';
import { AlertCircle, RefreshCw, Server, Terminal } from 'lucide-react';
import { getApiBaseUrl } from '../services/api';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  const backendUrl = getApiBaseUrl();
  const isConnectionIssue =
    message.toLowerCase().includes('connect') ||
    message.toLowerCase().includes('failed to fetch') ||
    message.toLowerCase().includes('backend');

  return (
    <div className="max-w-3xl mr-auto rounded-2xl border border-red-200 bg-red-50/70 p-4 sm:p-5 shadow-subtle text-slate-800">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-red-100 text-red-600 flex-shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-red-900">
              {isConnectionIssue ? 'Backend Connection Required' : 'Request Error'}
            </h4>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-100/80 text-red-700">
              POST /chat
            </span>
          </div>

          <p className="text-xs sm:text-sm text-red-700 leading-relaxed">
            {message}
          </p>

          {isConnectionIssue && (
            <div className="mt-3 p-3 rounded-xl bg-white/80 border border-red-200/80 text-xs text-slate-700 space-y-2">
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <Server className="w-3.5 h-3.5 text-brand-600" />
                <span>Backend target: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px] text-brand-700">{backendUrl}</code></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                <span>To connect your FastAPI server, run:</span>
              </div>
              <pre className="bg-slate-900 text-emerald-400 p-2 rounded-lg font-mono text-[11px] overflow-x-auto select-all">
                uvicorn main:app --reload --port 8001
              </pre>
            </div>
          )}

          {onRetry && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-red-700 border border-red-300 hover:bg-red-50 hover:border-red-400 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Question</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
