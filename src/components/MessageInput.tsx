import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isLoading,
  disabled = false,
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading || disabled) return;

    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 sm:pb-6 pt-2">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-2xl border border-slate-200/90 shadow-card focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all"
      >
        <div className="flex items-end px-3 py-2 sm:px-4 sm:py-3 gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || isLoading}
            placeholder="Ask anything about Python, syntax, functions, or W3Schools guides..."
            className="w-full resize-none border-0 bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 text-sm sm:text-base leading-relaxed max-h-44 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading || disabled}
            aria-label="Send question"
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 text-white disabled:text-slate-400 shadow-sm transition-all flex-shrink-0 cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            ) : (
              <Send className="w-4 h-4 translate-x-0.5" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between px-4 pb-2 pt-0 text-[11px] text-slate-400">
          <span className="hidden sm:inline">
            Press <kbd className="px-1 py-0.5 rounded bg-slate-100 font-mono text-slate-600 border border-slate-200">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-slate-100 font-mono text-slate-600 border border-slate-200">Shift + Enter</kbd> for new line
          </span>
          <span className="sm:ml-auto">
            Grounded in W3Schools documentation
          </span>
        </div>
      </form>
    </div>
  );
};
