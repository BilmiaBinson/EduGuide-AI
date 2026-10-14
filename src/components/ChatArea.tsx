import React, { useRef, useEffect } from 'react';
import { Menu, Trash2, ShieldCheck } from 'lucide-react';
import { ChatMessage } from '../types/chat';
import { WelcomeHero } from './WelcomeHero';
import { MessageItem } from './MessageItem';
import { LoadingMessage } from './LoadingMessage';
import { MessageInput } from './MessageInput';

interface ChatAreaProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (question: string) => void;
  onClearChat: () => void;
  onToggleSidebar: () => void;
  onRetryLastQuestion?: () => void;
  currentTitle?: string;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onClearChat,
  onToggleSidebar,
  onRetryLastQuestion,
  currentTitle,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom(messages.length <= 1 ? 'auto' : 'smooth');
  }, [messages, isLoading]);

  const isEmpty = messages.length === 0;

  return (
    <main className="flex-1 flex flex-col h-full bg-slate-50/70 overflow-hidden relative">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-200/80 bg-white/95 backdrop-blur-xs px-4 sm:px-6 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-md">
                {isEmpty ? 'New Learning Session' : currentTitle || 'Python Tutoring Session'}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Grounded in W3Schools Python Guides</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEmpty && (
            <button
              type="button"
              onClick={onClearChat}
              title="Clear current conversation"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ready</span>
          </div>
        </div>
      </header>

      {/* Chat Messages or Empty State Welcome Hero */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
        {isEmpty ? (
          <WelcomeHero onSelectQuestion={onSendMessage} />
        ) : (
          <div className="max-w-4xl mx-auto space-y-6 pb-4">
            {messages.map((msg, index) => {
              const isLast = index === messages.length - 1;
              return (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  onRetry={isLast && msg.isError ? onRetryLastQuestion : undefined}
                />
              );
            })}

            {isLoading && <LoadingMessage />}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Bottom Input Section */}
      <div className="border-t border-slate-200/80 bg-gradient-to-t from-white via-white/95 to-white/70 backdrop-blur-xs flex-shrink-0">
        <MessageInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </main>
  );
};
