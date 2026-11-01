import React, { useState } from 'react';
import {
  Copy,
  Check,
  RefreshCw,
  Edit3,
  Save,
  X,
  ExternalLink,
  ShieldAlert,
  Search,
  BookOpen,
  FileText,
  Tag,
  Library,
  AlertCircle,
  Target,
  FlaskConical,
  LineChart,
  CheckCircle2,
  Compass,
  Bookmark,
  Heading,
} from 'lucide-react';
import { PaperSectionKey, PaperSectionMeta, ReferenceItem } from '../types/paper';
import { getScholarSearchUrl, getCrossrefSearchUrl } from '../utils/paperExport';
import { CitationVerificationBanner } from './CitationVerificationBanner';

const ICONS_MAP: Record<string, React.ElementType> = {
  Heading,
  FileText,
  Tag,
  BookOpen,
  Library,
  AlertCircle,
  Target,
  FlaskConical,
  LineChart,
  CheckCircle2,
  Compass,
  Bookmark,
};

interface SectionCardProps {
  sectionKey: PaperSectionKey;
  meta: PaperSectionMeta;
  content: string | string[] | ReferenceItem[];
  onRegenerateClick: (key: PaperSectionKey) => void;
  onUpdateContent: (key: PaperSectionKey, newContent: any) => void;
  citationStyle: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  sectionKey,
  meta,
  content,
  onRegenerateClick,
  onUpdateContent,
  citationStyle,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');

  const Icon = ICONS_MAP[meta.iconName] || FileText;

  // Compute text representation for copying and word counting
  const getTextToCopy = (): string => {
    if (sectionKey === 'keywords') {
      return (content as string[]).join(', ');
    } else if (sectionKey === 'references') {
      return (content as ReferenceItem[])
        .map((r, i) => `[${i + 1}] ${r.citation}`)
        .join('\n\n');
    }
    return String(content || '');
  };

  const wordCount = getTextToCopy()
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getTextToCopy());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const startEditing = () => {
    if (sectionKey === 'keywords') {
      setEditedText((content as string[]).join(', '));
    } else if (sectionKey === 'references') {
      setEditedText(JSON.stringify(content, null, 2));
    } else {
      setEditedText(String(content));
    }
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (sectionKey === 'keywords') {
      const keywordsArray = editedText
        .split(/[,;\n]/)
        .map((k) => k.trim())
        .filter((k) => k.length > 0);
      onUpdateContent(sectionKey, keywordsArray);
    } else if (sectionKey === 'references') {
      try {
        const parsed = JSON.parse(editedText);
        onUpdateContent(sectionKey, parsed);
      } catch (e) {
        alert('Invalid JSON structure for references.');
        return;
      }
    } else {
      onUpdateContent(sectionKey, editedText);
    }
    setIsEditing(false);
  };

  return (
    <section
      id={`section-${sectionKey}`}
      className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-sm transition-shadow duration-200 overflow-hidden"
    >
      {/* Section Header */}
      <div className="bg-slate-50/80 px-4 sm:px-6 py-3.5 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/50">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 font-serif">
                {meta.label}
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {wordCount} {wordCount === 1 ? 'word' : 'words'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              {meta.description}
            </p>
          </div>
        </div>

        {/* Section Actions: Copy, Regenerate, Edit */}
        <div className="flex items-center gap-1.5">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              copied
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border-slate-200'
            }`}
            title="Copy this section"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Regenerate Button */}
          <button
            onClick={() => onRegenerateClick(sectionKey)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100/70 border border-purple-200 rounded-lg transition-colors"
            title="Regenerate this section with AI"
          >
            <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
            <span>Regenerate</span>
          </button>

          {/* Edit Button */}
          {!isEditing ? (
            <button
              onClick={startEditing}
              className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Edit section text"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={handleSaveEdit}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs"
                title="Save changes"
              >
                <Save className="w-3 h-3" />
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Section Content */}
      <div className="p-4 sm:p-6 text-slate-800">
        {isEditing ? (
          <div>
            <textarea
              rows={8}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full text-xs font-mono p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-800 resize-y"
            />
            {sectionKey === 'keywords' && (
              <p className="text-[11px] text-slate-400 mt-1">
                Separate keywords with commas or newlines.
              </p>
            )}
          </div>
        ) : (
          <div>
            {/* Title Section Special Display */}
            {sectionKey === 'title' && (
              <div className="py-2">
                <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight leading-snug">
                  {String(content)}
                </h1>
              </div>
            )}

            {/* Keywords Section Special Display */}
            {sectionKey === 'keywords' && (
              <div>
                <div className="flex flex-wrap gap-2 items-center">
                  {(content as string[]).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-slate-100 hover:bg-purple-50 text-slate-800 hover:text-purple-900 border border-slate-200/80 transition-colors"
                    >
                      <Tag className="w-3 h-3 text-purple-600" />
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* References Section Special Display */}
            {sectionKey === 'references' && (
              <div className="space-y-4">
                <CitationVerificationBanner compact={false} />

                <div className="space-y-3 pt-2">
                  {(content as ReferenceItem[]).map((ref, idx) => {
                    const scholarUrl = getScholarSearchUrl(ref.doiQuery || ref.citation);
                    const crossrefUrl = getCrossrefSearchUrl(ref.doiQuery || ref.citation);

                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all text-xs text-slate-700"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <span className="font-mono font-bold text-slate-500 bg-slate-200/80 text-[11px] px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                              [{idx + 1}]
                            </span>
                            <div className="space-y-1">
                              <p className="leading-relaxed font-sans text-slate-900">
                                {ref.citation}
                              </p>
                              {ref.suggestedSourceType && (
                                <span className="inline-block text-[10px] uppercase font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/50 px-1.5 py-0.2 rounded mr-2">
                                  {ref.suggestedSourceType}
                                </span>
                              )}
                              {ref.verificationNote && (
                                <p className="text-[11px] text-amber-800/90 italic flex items-center gap-1">
                                  <ShieldAlert className="w-3 h-3 text-amber-600 shrink-0" />
                                  <span>{ref.verificationNote}</span>
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <a
                              href={scholarUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-indigo-700 bg-white hover:bg-indigo-50 border border-slate-200 rounded transition-colors"
                              title="Search on Google Scholar"
                            >
                              <Search className="w-3 h-3 text-indigo-600" />
                              <span>Scholar</span>
                            </a>
                            <a
                              href={crossrefUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-amber-700 bg-white hover:bg-amber-50 border border-slate-200 rounded transition-colors"
                              title="Verify DOI on CrossRef"
                            >
                              <ExternalLink className="w-3 h-3 text-amber-600" />
                              <span>CrossRef</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Standard Text Sections: Abstract, Intro, Lit Review, etc. */}
            {sectionKey !== 'title' &&
              sectionKey !== 'keywords' &&
              sectionKey !== 'references' && (
                <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 whitespace-pre-line space-y-3 font-sans">
                  {String(content)}
                </div>
              )}
          </div>
        )}
      </div>
    </section>
  );
};
