import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Cpu,
  Stethoscope,
  Globe,
  Cog,
  TrendingUp,
  Users,
  Atom,
  Dna,
  GraduationCap,
  Layers,
  ChevronDown,
  HelpCircle,
  Lightbulb,
  FileCheck2,
  SlidersHorizontal,
} from 'lucide-react';
import { AcademicField, PaperType, CitationStyle, GeneratePaperRequest } from '../types/paper';
import { ACADEMIC_FIELDS, PAPER_TYPES, CITATION_STYLES, SAMPLE_TOPICS } from '../constants/presets';

interface PaperGeneratorFormProps {
  onGenerate: (data: GeneratePaperRequest) => void;
  isLoading: boolean;
}

const FIELD_ICONS: Record<string, React.ElementType> = {
  Cpu,
  Stethoscope,
  Globe,
  Cog,
  TrendingUp,
  Users,
  Atom,
  Dna,
  BookOpen,
  GraduationCap,
  Layers,
};

export const PaperGeneratorForm: React.FC<PaperGeneratorFormProps> = ({
  onGenerate,
  isLoading,
}) => {
  const [topic, setTopic] = useState('');
  const [field, setField] = useState<AcademicField>('Computer Science & AI');
  const [paperType, setPaperType] = useState<PaperType>('Original Empirical Research');
  const [citationStyle, setCitationStyle] = useState<CitationStyle>('APA 7th');
  const [targetAudience, setTargetAudience] = useState('Doctoral & Peer-Reviewed Journal');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSampleClick = (sample: (typeof SAMPLE_TOPICS)[0]) => {
    setTopic(sample.title);
    setField(sample.field);
    setPaperType(sample.type);
    setValidationError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setValidationError('Please enter a research topic or select one of the suggested topics.');
      return;
    }
    if (topic.trim().length < 6) {
      setValidationError('Research topic should be descriptive (at least 6 characters).');
      return;
    }

    setValidationError('');
    onGenerate({
      topic: topic.trim(),
      field,
      paperType,
      citationStyle,
      targetAudience,
      additionalNotes: additionalNotes.trim() || undefined,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
      {/* Form Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md w-fit border border-purple-200/50">
          <Sparkles className="w-3.5 h-3.5" />
          Academic Manuscript Drafter
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 mt-2">
          Start a New Research Paper
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Specify your research topic, academic domain, and paper methodology to synthesize a structured 12-section manuscript draft.
        </p>
      </div>

      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-6">
        {/* Research Topic Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="topic-input" className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Research Topic or Working Title <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {topic.length} characters
            </span>
          </div>

          <div className="relative">
            <textarea
              id="topic-input"
              rows={3}
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                if (validationError) setValidationError('');
              }}
              placeholder="e.g. Assessing the Impact of Retrieval-Augmented Generation on Diagnostic Accuracy in Clinical Medicine: A Comparative Evaluation"
              className={`w-full text-sm p-3.5 rounded-xl border bg-slate-50/40 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all resize-none ${
                validationError
                  ? 'border-rose-400 focus:ring-rose-500'
                  : 'border-slate-300 focus:ring-purple-600 focus:border-purple-600'
              }`}
            />
          </div>

          {validationError && (
            <p className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1">
              {validationError}
            </p>
          )}

          {/* Sample Topic Pills */}
          <div className="mt-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Or click to test with a curated research topic:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_TOPICS.map((sample, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => handleSampleClick(sample)}
                  className="text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-purple-100/70 text-slate-700 hover:text-purple-900 border border-slate-200/80 transition-colors line-clamp-1 max-w-xs"
                  title={sample.title}
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dropdowns Grid: Academic Field & Paper Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
          {/* Academic Field */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              2. Academic Field <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={field}
                onChange={(e) => setField(e.target.value as AcademicField)}
                className="w-full text-xs sm:text-sm font-medium p-3 pr-10 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 appearance-none shadow-2xs"
              >
                {ACADEMIC_FIELDS.map((f) => (
                  <option key={f.label} value={f.label}>
                    {f.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {ACADEMIC_FIELDS.find((f) => f.label === field)?.description}
            </p>
          </div>

          {/* Paper Type */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              3. Research Paper Type <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={paperType}
                onChange={(e) => setPaperType(e.target.value as PaperType)}
                className="w-full text-xs sm:text-sm font-medium p-3 pr-10 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 appearance-none shadow-2xs"
              >
                {PAPER_TYPES.map((t) => (
                  <option key={t.label} value={t.label}>
                    {t.label} ({t.badge})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {PAPER_TYPES.find((t) => t.label === paperType)?.description}
            </p>
          </div>
        </div>

        {/* Citation Style Selector */}
        <div className="pt-1">
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            4. Primary Citation Format
          </label>
          <div className="flex flex-wrap gap-2">
            {CITATION_STYLES.map((style) => (
              <button
                type="button"
                key={style}
                onClick={() => setCitationStyle(style)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                  citationStyle === style
                    ? 'bg-indigo-900 text-white border-indigo-950 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Options Accordion */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-purple-700 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Advanced Research Scope & Methodology Focus</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            />
          </button>

          {showAdvanced && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Target Venue / Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="Doctoral & Peer-Reviewed Journal">
                    Doctoral / High-Impact Peer-Reviewed Journal (Nature, IEEE, ACM, Lancet)
                  </option>
                  <option value="Master's Thesis / Graduate Research">
                    Master's Thesis / Graduate Dissertation
                  </option>
                  <option value="Undergraduate Capstone / Senior Thesis">
                    Undergraduate Capstone / Senior Research Thesis
                  </option>
                  <option value="International Conference Proceedings">
                    International Conference Proceedings
                  </option>
                  <option value="Industry R&D Whitepaper">
                    Industry R&D Whitepaper & Applied Framework
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Specific Hypothesis, Datasets, or Analytical Methods (Optional)
                </label>
                <textarea
                  rows={2}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="e.g. Focus on semi-supervised learning algorithms, assume sample size N=1,200, emphasize ethical constraints..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Generates complete 12 sections with verified citation guidelines</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-bold text-white bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-800 hover:from-slate-950 hover:via-indigo-950 hover:to-purple-900 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>Generate Research Paper</span>
            <span className="hidden sm:inline text-[10px] text-purple-200/80 font-mono ml-1">
              (⌘+Enter)
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
