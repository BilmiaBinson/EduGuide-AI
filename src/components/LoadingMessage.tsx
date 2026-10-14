import React from 'react';
import { Sparkles } from 'lucide-react';

export const LoadingMessage: React.FC = () => {
  return (
    <div className="flex items-start gap-3.5 max-w-3xl mr-auto animate-fade-in">
      {/* AI Avatar */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5">
        <Sparkles className="w-4 h-4 animate-pulse" />
      </div>

      {/* Bubble / Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-sm px-5 py-4 shadow-subtle text-slate-700 min-w-[240px]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-wide">EduGuide AI</span>
          <span className="text-[11px] text-slate-400">Retrieving W3Schools lessons...</span>
        </div>

        {/* Animated pulse dots */}
        <div className="flex items-center gap-1.5 py-1">
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className="ml-2 text-xs font-normal text-slate-500">Synthesizing answer...</span>
        </div>
      </div>
    </div>
  );
};
