import React from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';
import { SourceItem } from '../types/chat';

interface SourceLinksProps {
  sources?: SourceItem[];
}

export const SourceLinks: React.FC<SourceLinksProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  const parseSource = (source: SourceItem): { url: string; title: string; isW3: boolean } => {
    let url = '';
    let title = '';

    if (typeof source === 'string') {
      url = source;
      try {
        const parsed = new URL(source);
        const pathname = parsed.pathname;
        const lastPart = pathname.split('/').filter(Boolean).pop() || '';
        title = lastPart
          .replace(/\.(asp|html|htm|php)$/i, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        if (!title) {
          title = parsed.hostname;
        }
      } catch {
        title = source;
      }
    } else {
      url = source.url;
      title = source.title || source.url;
    }

    const isW3 = url.toLowerCase().includes('w3schools.com');

    return { url, title, isW3 };
  };

  return (
    <div className="mt-4 pt-3 border-t border-slate-100">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
        <BookOpen className="w-3.5 h-3.5 text-brand-600" />
        <span>Referenced Sources</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {sources.map((item, index) => {
          const { url, title, isW3 } = parseSource(item);
          return (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              title={`Open ${url} in a new tab`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 border border-slate-200 hover:border-brand-300 text-slate-700 hover:text-brand-700 shadow-subtle hover:shadow transition-all group duration-150"
            >
              {isW3 ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
              )}
              <span className="max-w-[220px] sm:max-w-xs truncate">{title}</span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-transform" />
            </a>
          );
        })}
      </div>
    </div>
  );
};
