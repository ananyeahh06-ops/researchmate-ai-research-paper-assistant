import React from 'react';
import {
  X,
  BookOpen,
  Trash2,
  Calendar,
  FileText,
  Download,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import { ResearchPaper } from '../types/paper';
import { calculateWordCount, formatPaperAsText, downloadTextFile } from '../utils/paperExport';

interface SavedPapersModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPapers: ResearchPaper[];
  onSelectPaper: (paper: ResearchPaper) => void;
  onDeletePaper: (id: string) => void;
}

export const SavedPapersModal: React.FC<SavedPapersModalProps> = ({
  isOpen,
  onClose,
  savedPapers,
  onSelectPaper,
  onDeletePaper,
}) => {
  if (!isOpen) return null;

  const handleDownload = (e: React.MouseEvent, paper: ResearchPaper) => {
    e.stopPropagation();
    const filename = `${paper.title.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 40)}_draft.txt`;
    downloadTextFile(filename, formatPaperAsText(paper));
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this paper draft?')) {
      onDeletePaper(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Saved Paper Drafts
              </h3>
              <p className="text-xs text-slate-500">
                {savedPapers.length} {savedPapers.length === 1 ? 'draft' : 'drafts'} saved locally in browser
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {savedPapers.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-600">No saved drafts yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Generated research papers will be stored here automatically.
              </p>
            </div>
          ) : (
            savedPapers.map((paper) => {
              const words = calculateWordCount(paper);
              const date = new Date(paper.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={paper.id}
                  onClick={() => {
                    onSelectPaper(paper);
                    onClose();
                  }}
                  className="p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                          {paper.field}
                        </span>
                        <span>•</span>
                        <span className="text-purple-700">{paper.paperType}</span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 font-serif group-hover:text-purple-900 transition-colors line-clamp-2">
                        {paper.title || paper.topic}
                      </h4>

                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {date}
                        </span>
                        <span>•</span>
                        <span className="font-mono">{words} words</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 pt-1">
                      <button
                        onClick={(e) => handleDownload(e, paper)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Download as Text File"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, paper.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Draft"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="p-1.5 text-slate-300 group-hover:text-purple-700 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
