import React from 'react';
import {
  GraduationCap,
  Plus,
  MessageSquare,
  Trash2,
  ExternalLink,
  BookMarked,
  X,
  Sparkles,
} from 'lucide-react';
import { ChatSession } from '../types/chat';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 lg:static w-72 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Logo */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-base tracking-tight">EduGuide AI</span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200/60">
                  RAG
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Interactive Learning Assistant</p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            type="button"
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold shadow-sm hover:shadow transition-all group focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Recent Chats Section */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-2 pb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Recent Chats</span>
            <span className="text-[11px] font-normal normal-case text-slate-400">
              {sessions.length}
            </span>
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-8 px-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
              <MessageSquare className="w-6 h-6 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-600">No chat history yet</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Ask your first question to start a learning session.
              </p>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === currentSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                    isActive
                      ? 'bg-brand-50/80 text-brand-900 border border-brand-200/80 font-semibold shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-6">
                    <MessageSquare
                      className={`w-3.5 h-3.5 flex-shrink-0 ${
                        isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span className="truncate">{session.title}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => onDeleteSession(session.id, e)}
                    title="Delete chat"
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all absolute right-2"
                    aria-label="Delete chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Knowledge Source: W3Schools Section */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-subtle">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100 flex-shrink-0" />
                <span>Knowledge source</span>
              </div>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                W3Schools
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal mb-2.5">
              Responses are scraped and grounded in authentic W3Schools web tutorials and code examples.
            </p>

            <a
              href="https://www.w3schools.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full text-[11px] font-semibold text-brand-600 hover:text-brand-700 py-1 px-2 rounded-lg bg-brand-50/60 hover:bg-brand-50 border border-brand-100 transition-colors"
            >
              <span className="flex items-center gap-1">
                <BookMarked className="w-3 h-3 text-brand-600" />
                Browse W3Schools
              </span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <Sparkles className="w-3 h-3 text-brand-500" />
            <span>EduGuide AI • v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
