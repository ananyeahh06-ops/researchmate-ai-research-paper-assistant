import React from 'react';
import {
  GraduationCap,
  Sparkles,
  BookmarkCheck,
  PlusCircle,
  ShieldCheck,
  FileText,
} from 'lucide-react';

interface HeaderProps {
  savedCount: number;
  onOpenSaved: () => void;
  onNewDraft: () => void;
  onOpenEthicsModal: () => void;
  hasActivePaper: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  savedCount,
  onOpenSaved,
  onNewDraft,
  onOpenEthicsModal,
  hasActivePaper,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onNewDraft}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-indigo-900 to-purple-800 flex items-center justify-center text-white shadow-md shadow-indigo-950/20">
            <GraduationCap className="w-6 h-6 text-purple-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 font-serif">
                ResearchMate
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-purple-100 text-purple-800 border border-purple-200/60">
                <Sparkles className="w-2.5 h-2.5 text-purple-600" /> AI Assistant
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Rigorous Academic Research Paper Draft Generator
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenEthicsModal}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            title="Read our Academic Integrity Policy"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            Integrity Policy
          </button>

          <button
            onClick={onOpenSaved}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-2xs"
            title="View saved paper drafts"
          >
            <BookmarkCheck className="w-4 h-4 text-purple-600" />
            <span>Saved Drafts</span>
            {savedCount > 0 && (
              <span className="bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          {hasActivePaper && (
            <button
              onClick={onNewDraft}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-indigo-950 rounded-lg transition-all shadow-xs hover:shadow"
            >
              <PlusCircle className="w-4 h-4 text-purple-300" />
              <span>New Paper</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
