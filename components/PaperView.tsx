import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Printer,
  Sparkles,
  BookOpen,
  Bookmark,
  Calendar,
  Clock,
  FileText,
  Layers,
  ChevronRight,
  RefreshCw,
  Share2,
  Tag,
  Type as TypeIcon,
  CheckCircle2,
} from 'lucide-react';
import { ResearchPaper, PaperSectionKey } from '../types/paper';
import { PAPER_SECTIONS_META } from '../constants/presets';
import {
  calculateWordCount,
  estimateReadingTimeMinutes,
  formatPaperAsText,
  formatPaperAsMarkdown,
  downloadTextFile,
} from '../utils/paperExport';
import { SectionCard } from './SectionCard';
import { RegenerateModal } from './RegenerateModal';

interface PaperViewProps {
  paper: ResearchPaper;
  onUpdatePaper: (updated: ResearchPaper) => void;
  onRegenerateSection: (
    sectionKey: PaperSectionKey,
    customInstructions?: string
  ) => Promise<void>;
  isRegenerating: boolean;
  regeneratingKey: PaperSectionKey | null;
}

export const PaperView: React.FC<PaperViewProps> = ({
  paper,
  onUpdatePaper,
  onRegenerateSection,
  isRegenerating,
  regeneratingKey,
}) => {
  const [selectedRegenerateKey, setSelectedRegenerateKey] = useState<PaperSectionKey | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('sans');
  const [activeSectionId, setActiveSectionId] = useState<string>('title');

  const totalWords = calculateWordCount(paper);
  const readingTime = estimateReadingTimeMinutes(totalWords);

  // Copy Entire Paper
  const handleCopyAll = async () => {
    try {
      const fullText = formatPaperAsText(paper);
      await navigator.clipboard.writeText(fullText);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    } catch (err) {
      console.error('Failed to copy entire paper', err);
    }
  };

  // Download as Plain Text (.txt) - Prompt Requirement #9
  const handleDownloadTxt = () => {
    const filename = `${paper.title.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 45)}_draft.txt`;
    const content = formatPaperAsText(paper);
    downloadTextFile(filename, content, 'text/plain;charset=utf-8');
  };

  // Download as Markdown (.md)
  const handleDownloadMd = () => {
    const filename = `${paper.title.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 45)}_draft.md`;
    const content = formatPaperAsMarkdown(paper);
    downloadTextFile(filename, content, 'text/markdown;charset=utf-8');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleUpdateSectionContent = (key: PaperSectionKey, newContent: any) => {
    const updated = {
      ...paper,
      [key]: newContent,
      updatedAt: new Date().toISOString(),
    };
    onUpdatePaper(updated);
  };

  const scrollToSection = (sectionKey: string) => {
    setActiveSectionId(sectionKey);
    const element = document.getElementById(`section-${sectionKey}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Paper Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200/60 px-2.5 py-0.5 rounded-full">
                {paper.field}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                {paper.paperType}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2.5 py-0.5 rounded-full">
                {paper.citationStyle}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-slate-900 tracking-tight leading-snug">
              {paper.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3 font-medium">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-400" />
                <strong className="text-slate-800 font-mono">{totalWords.toLocaleString()}</strong> words
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                ~{readingTime} min read
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                Generated {new Date(paper.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Global Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Download as TXT (Requirement #9) */}
            <button
              onClick={handleDownloadTxt}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs cursor-pointer"
              title="Download entire paper as a clean .txt file"
            >
              <Download className="w-3.5 h-3.5 text-purple-300" />
              <span>Download Text File</span>
            </button>

            {/* Download as Markdown */}
            <button
              onClick={handleDownloadMd}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs cursor-pointer"
              title="Download as formatted Markdown"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Markdown</span>
            </button>

            {/* Copy Entire Paper */}
            <button
              onClick={handleCopyAll}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                copiedAll
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
              title="Copy entire paper to clipboard"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Paper Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Paper</span>
                </>
              )}
            </button>

            {/* Print / Save PDF */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Serif / Sans Toggle */}
            <button
              onClick={() => setFontFamily((f) => (f === 'serif' ? 'sans' : 'serif'))}
              className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
              title={`Switch typography (Currently: ${fontFamily})`}
            >
              <TypeIcon className="w-3.5 h-3.5 text-purple-600" />
              <span className="text-[11px] uppercase tracking-wider">{fontFamily}</span>
            </button>
          </div>
        </div>

        {/* Paper Target info pill */}
        {paper.targetAudience && (
          <div className="pt-3 text-xs text-slate-500 flex items-center gap-2">
            <span className="font-semibold text-slate-700">Target Venue:</span>
            <span>{paper.targetAudience}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Sticky Navigation Outline + 12 Section Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sticky Table of Contents / Outline Sidebar (3 cols) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-20 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              Paper Structure
            </h3>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              12 sections
            </span>
          </div>

          <nav className="space-y-1">
            {PAPER_SECTIONS_META.map((sec, idx) => {
              const isActive = activeSectionId === sec.key;
              const isBeingRegenerated = regeneratingKey === sec.key;

              return (
                <button
                  key={sec.key}
                  onClick={() => scrollToSection(sec.key)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-purple-50 text-purple-900 font-semibold border-l-2 border-purple-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 w-4">
                      {idx + 1}.
                    </span>
                    <span className="truncate">{sec.label}</span>
                  </span>

                  {isBeingRegenerated ? (
                    <RefreshCw className="w-3 h-3 text-purple-600 animate-spin shrink-0 ml-1" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-slate-300 shrink-0 ml-1" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={handleDownloadTxt}
              className="w-full text-center text-xs font-semibold py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export .txt Draft
            </button>
          </div>
        </aside>

        {/* 12 Sections Main Column (9 cols) */}
        <main className={`lg:col-span-9 space-y-6 ${fontFamily === 'serif' ? 'font-serif' : 'font-sans'}`}>
          {PAPER_SECTIONS_META.map((sec) => {
            const content = (paper as any)[sec.key];

            return (
              <SectionCard
                key={sec.key}
                sectionKey={sec.key}
                meta={sec}
                content={content}
                citationStyle={paper.citationStyle}
                onRegenerateClick={(key) => setSelectedRegenerateKey(key)}
                onUpdateContent={handleUpdateSectionContent}
              />
            );
          })}
        </main>
      </div>

      {/* Regeneration Modal */}
      {selectedRegenerateKey && (
        <RegenerateModal
          isOpen={Boolean(selectedRegenerateKey)}
          sectionKey={selectedRegenerateKey}
          sectionMeta={PAPER_SECTIONS_META.find((m) => m.key === selectedRegenerateKey)}
          isRegenerating={isRegenerating}
          onClose={() => setSelectedRegenerateKey(null)}
          onRegenerate={async (key, instructions) => {
            await onRegenerateSection(key, instructions);
            setSelectedRegenerateKey(null);
          }}
        />
      )}
    </div>
  );
};
