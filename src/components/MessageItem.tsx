import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Sparkles, Copy, Check } from 'lucide-react';
import { ChatMessage } from '../types/chat';
import { SourceLinks } from './SourceLinks';
import { ErrorMessage } from './ErrorMessage';

interface MessageItemProps {
  message: ChatMessage;
  onRetry?: () => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, onRetry }) => {
  const [copied, setCopied] = useState(false);
  const isStudent = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  if (message.isError) {
    return <ErrorMessage message={message.errorMessage || message.content} onRetry={onRetry} />;
  }

  if (isStudent) {
    return (
      <div className="flex items-start justify-end gap-3 max-w-2xl ml-auto group">
        <div className="flex flex-col items-end">
          <div className="bg-brand-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm text-sm sm:text-[15px] leading-relaxed break-words max-w-full">
            {message.content}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 px-1">
            {message.timestamp}
          </span>
        </div>

        <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shadow-xs flex-shrink-0 mt-0.5">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  // Assistant / EduGuide AI message
  return (
    <div className="flex items-start gap-3.5 max-w-3xl mr-auto group">
      {/* EduGuide Avatar */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5">
        <Sparkles className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-sm p-4 sm:p-5 shadow-subtle hover:border-slate-300/80 transition-colors">
          {/* Top header with name and copy action */}
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-900">EduGuide AI</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                W3Schools RAG
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 hidden sm:inline-block">
                {message.timestamp}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                title="Copy response"
                className="inline-flex items-center gap-1 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors text-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[11px] text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px] hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Formatted Markdown Content */}
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Source Links */}
          <SourceLinks sources={message.sources} />
        </div>
      </div>
    </div>
  );
};
