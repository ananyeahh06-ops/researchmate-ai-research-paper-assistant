import React, { useEffect, useState } from 'react';
import { Sparkles, BookOpen, Layers, CheckCircle2, FlaskConical, Atom } from 'lucide-react';

interface LoadingOverlayProps {
  topic: string;
  field: string;
  paperType: string;
}

const GENERATION_STAGES = [
  {
    title: 'Deconstructing Research Scope',
    subtitle: 'Analyzing disciplinary boundaries, taxonomy, and core domain variables',
    icon: Atom,
  },
  {
    title: 'Synthesizing Literature & Epistemic Gaps',
    subtitle: 'Mapping theoretical foundations, existing debates, and benchmark paradigms',
    icon: BookOpen,
  },
  {
    title: 'Formulating Problem & Methodological Framework',
    subtitle: 'Structuring research objectives (ROs), data protocols, and analytical procedures',
    icon: FlaskConical,
  },
  {
    title: 'Compiling 12-Section Academic Paper',
    subtitle: 'Refining scholarly prose, abstract, expected results, and citation guidelines',
    icon: Layers,
  },
];

const SCHOLARLY_TIPS = [
  'A rigorous Abstract acts as a standalone microcosm of the entire paper (Context → Gap → Method → Key Finding → Contribution).',
  'Academic peer reviewers prioritize methodological reproducibility, clear operational variables, and explicit delimitation of scope.',
  'Well-defined Research Objectives (RO1, RO2) provide clear measurable criteria to validate the expected results.',
  'Remember to verify all candidate references against official indexes such as CrossRef, IEEE Xplore, or Google Scholar.',
  'Precision in scientific language: prefer specific quantitative and ontological metrics over subjective descriptions.',
];

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ topic, field, paperType }) => {
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setActiveStageIdx((prev) => (prev < GENERATION_STAGES.length - 1 ? prev + 1 : prev));
    }, 4500);

    const tipTimer = setInterval(() => {
      setTipIdx((prev) => (prev + 1) % SCHOLARLY_TIPS.length);
    }, 6000);

    return () => {
      clearInterval(stageTimer);
      clearInterval(tipTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200/80 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top gradient glow bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 animate-pulse" />

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-900 to-purple-800 text-purple-200 mb-4 shadow-lg shadow-purple-900/30 relative">
            <Atom className="w-8 h-8 animate-spin text-purple-300" style={{ animationDuration: '6s' }} />
            <div className="absolute inset-0 rounded-2xl border border-purple-400/30 animate-ping opacity-25" />
          </div>

          <h3 className="text-xl font-bold font-serif text-slate-900 tracking-tight">
            Synthesizing Research Paper Draft
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto line-clamp-2 italic">
            "{topic}"
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-xs font-medium text-slate-500">
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              {field}
            </span>
            <span>•</span>
            <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
              {paperType}
            </span>
          </div>
        </div>

        {/* Stepper Progress */}
        <div className="mt-6 space-y-3">
          {GENERATION_STAGES.map((stage, idx) => {
            const isCompleted = idx < activeStageIdx;
            const isCurrent = idx === activeStageIdx;
            const isPending = idx > activeStageIdx;
            const Icon = stage.icon;

            return (
              <div
                key={stage.title}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-purple-50/70 border-purple-300/80 shadow-2xs'
                    : isCompleted
                      ? 'bg-slate-50/70 border-slate-200 text-slate-700'
                      : 'border-transparent text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 mt-0.5 transition-colors ${
                    isCurrent
                      ? 'bg-purple-600 text-white animate-pulse'
                      : isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${
                        isCurrent
                          ? 'text-purple-950 font-bold'
                          : isCompleted
                            ? 'text-slate-800'
                            : 'text-slate-400'
                      }`}
                    >
                      {stage.title}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] uppercase font-bold tracking-wider text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded">
                        Synthesizing...
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {stage.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scholarly tip footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50/60 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-4 px-6 sm:px-8 text-center rounded-b-2xl">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Academic Writing Tip</span>
          </div>
          <p className="text-xs text-slate-500 italic max-w-md mx-auto min-h-[32px] flex items-center justify-center">
            "{SCHOLARLY_TIPS[tipIdx]}"
          </p>
        </div>
      </div>
    </div>
  );
};
