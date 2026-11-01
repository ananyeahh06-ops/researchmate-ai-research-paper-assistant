import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

interface EthicsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EthicsModal: React.FC<EthicsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Academic Integrity & Verification Standards
              </h3>
              <p className="text-xs text-slate-500">
                Ethical AI usage guidelines for researchers and students
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

        <div className="mt-4 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-950 rounded-xl space-y-1">
            <h4 className="font-bold flex items-center gap-1.5 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Core Rule on AI-Generated Citations
            </h4>
            <p className="text-xs text-amber-900/90 leading-normal">
              ResearchMate adheres to strict scientific anti-hallucination standards. The AI synthesizes real thematic frameworks and prominent seminal authors. However, before citing any literature in published or graded academic work, researchers <strong>must</strong> independently verify the DOI, publication year, journal title, and page numbers.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Best Practices for Using ResearchMate
            </h4>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Scaffolding & Structural Ideation:</strong>
                <p className="text-xs text-slate-500 mt-0.5">
                  Use the generated draft as an intellectual blueprint: refine the problem statement, challenge the hypotheses, and customize the research questions with your unique experimental context.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">One-Click DOI & Scholar Verification:</strong>
                <p className="text-xs text-slate-500 mt-0.5">
                  Every reference item in ResearchMate includes direct lookup links to Google Scholar and CrossRef so you can quickly retrieve the exact peer-reviewed paper and bibtex.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Iterative Section Regeneration:</strong>
                <p className="text-xs text-slate-500 mt-0.5">
                  Need a more rigorous methodology or a more concise abstract? Use the Regenerate tool with custom instructions to steer the manuscript toward your target journal's requirements.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Powered by Google Gemini 3.8 Flash
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
