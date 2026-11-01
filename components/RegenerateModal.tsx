import React, { useState } from 'react';
import { RefreshCw, X, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { PaperSectionKey, PaperSectionMeta } from '../types/paper';

interface RegenerateModalProps {
  sectionKey: PaperSectionKey;
  sectionMeta?: PaperSectionMeta;
  isOpen: boolean;
  onClose: () => void;
  onRegenerate: (sectionKey: PaperSectionKey, customInstructions?: string) => Promise<void>;
  isRegenerating: boolean;
}

const PRESET_INSTRUCTIONS: Record<string, string[]> = {
  abstract: [
    'Make more concise (under 250 words) adhering to strict journal limits',
    'Emphasize the novel methodological contribution and quantitative results',
    'Structure explicitly with: Background, Objective, Method, Results, Conclusion',
  ],
  introduction: [
    'Deepen the historical context and societal/technological significance',
    'Articulate a stronger research gap emphasizing why existing solutions fail',
    'Add an explicit paragraph mapping the organizational roadmap of the paper',
  ],
  literatureReview: [
    'Organize chronologically and thematically into distinct sub-schools of thought',
    'Include critical comparative benchmarks highlighting key tensions in the literature',
    'Strengthen theoretical foundations and contrast prevailing paradigms',
  ],
  researchMethodology: [
    'Detail algorithmic steps, mathematical formulations, or experimental protocols',
    'Specify validation criteria, cross-validation metrics, and sample sizing',
    'Add a robust section on error analysis, threat to validity, and control groups',
  ],
  expectedResults: [
    'Include hypothetical comparative metric tables, baseline models, and statistical significance',
    'Elaborate on edge cases, sensitivity analysis, and failure mode behaviors',
    'Provide structured qualitative and quantitative outcome projections',
  ],
  conclusion: [
    'Synthesize core theoretical and practical takeaways with greater scholarly punch',
    'Directly answer the primary research questions defined in the Introduction',
    'Keep concise while highlighting broader paradigm shifts',
  ],
  futureScope: [
    'Identify emerging interdisciplinary intersections (e.g., AI ethics, hardware constraints)',
    'Formulate 3 concrete open research questions for doctoral follow-up',
    'Discuss scalability and real-world deployment bottlenecks',
  ],
  references: [
    'Focus on seminal landmark papers and top-tier recent peer-reviewed sources',
    'Provide more recent journal articles from the last 3 years',
    'Ensure comprehensive coverage of both theoretical and empirical studies',
  ],
};

export const RegenerateModal: React.FC<RegenerateModalProps> = ({
  sectionKey,
  sectionMeta,
  isOpen,
  onClose,
  onRegenerate,
  isRegenerating,
}) => {
  const [customInstructions, setCustomInstructions] = useState('');

  if (!isOpen) return null;

  const title = sectionMeta?.label || sectionKey;
  const presets = PRESET_INSTRUCTIONS[sectionKey] || [
    'Make this section more detailed and academically rigorous',
    'Make this section more concise and focused',
    'Strengthen empirical and theoretical grounding',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegenerate(sectionKey, customInstructions.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Regenerate {title}
              </h3>
              <p className="text-xs text-slate-500">
                Refine, expand, or redirect this specific section
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isRegenerating}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                Quick Academic Directives
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Click to insert</span>
            </label>
            <div className="flex flex-col gap-1.5">
              {presets.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setCustomInstructions(preset)}
                  className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-900 border border-slate-200/80 hover:border-purple-300 transition-colors"
                >
                  "{preset}"
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
              Custom Instructions (Optional)
            </label>
            <textarea
              rows={3}
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g., Focus more on mathematical formulations, expand on the limitations, or adopt an IEEE journal format..."
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-slate-800 placeholder:text-slate-400 resize-none"
            />
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
            <span>
              The regenerated text will remain fully aligned with your paper's original title, academic field, and abstract.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isRegenerating}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRegenerating}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg transition-all shadow-xs disabled:opacity-50"
            >
              {isRegenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Regenerating Section...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Regenerate Now
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
