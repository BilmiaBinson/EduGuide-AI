import React from 'react';
import { BookOpen, Sparkles, ArrowRight, Code2, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';

interface WelcomeHeroProps {
  onSelectQuestion: (question: string) => void;
}

interface SuggestedPrompt {
  title: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({ onSelectQuestion }) => {
  const suggestedQuestions: SuggestedPrompt[] = [
    {
      title: 'What is Python?',
      category: 'Fundamentals',
      icon: Code2,
    },
    {
      title: 'Why is Python easy to learn?',
      category: 'Language Design',
      icon: CheckCircle2,
    },
    {
      title: 'What can Python do?',
      category: 'Capabilities',
      icon: Layers,
    },
    {
      title: 'Explain Python indentation.',
      category: 'Core Syntax',
      icon: HelpCircle,
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto px-4 py-8 sm:py-12 text-center animate-fade-in">
      {/* Brand badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-semibold mb-6 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-brand-600" />
        <span>W3Schools Knowledge-Grounded AI</span>
      </div>

      {/* Main Welcoming Heading */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
        Learn anything, <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          one question at a time.
        </span>
      </h1>

      <p className="mt-4 text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
        Ask any programming question. EduGuide AI retrieves clear explanations, syntax examples, and verified tutorial links directly from W3Schools.
      </p>

      {/* Suggested Questions Grid */}
      <div className="mt-8 sm:mt-10 w-full text-left">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Suggested starter questions
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-emerald-600" />
            W3Schools Python Tutorial
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestedQuestions.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                type="button"
                onClick={() => onSelectQuestion(item.title)}
                className="flex items-start justify-between p-4 rounded-xl bg-white border border-slate-200/90 hover:border-brand-400 hover:shadow-card text-left transition-all group duration-150"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-brand-50 text-slate-500 group-hover:text-brand-600 transition-colors mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-800 group-hover:text-brand-700 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
