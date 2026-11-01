import React from 'react';
import { ShieldAlert, ExternalLink, HelpCircle } from 'lucide-react';

interface CitationVerificationBannerProps {
  compact?: boolean;
}

export const CitationVerificationBanner: React.FC<CitationVerificationBannerProps> = ({
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="font-medium">
          Verification Required: AI-suggested citations represent theoretical frameworks. Verify exact DOIs and dates on Google Scholar / CrossRef prior to formal submission.
        </span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 via-amber-50/70 to-orange-50 border border-amber-200/90 rounded-xl p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5 sm:mt-0">
            <ShieldAlert className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-950 flex items-center gap-1.5">
              Academic Integrity & Citation Verification Policy
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded">
                Required
              </span>
            </h4>
            <p className="text-xs text-amber-900/90 mt-1 leading-relaxed max-w-2xl">
              ResearchMate adheres to strict academic ethics. AI suggestions provide foundational literature pathways, key author themes, and methodological structures. You must independently confirm publication years, journal volumes, and author rosters against official indexes (CrossRef, PubMed, IEEE Xplore, Google Scholar) before formal publication.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
          <a
            href="https://search.crossref.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-amber-900 hover:text-amber-950 bg-white hover:bg-amber-100/60 px-3 py-1.5 rounded-md border border-amber-300 transition-colors shadow-2xs"
          >
            CrossRef
            <ExternalLink className="w-3 h-3 text-amber-700" />
          </a>
          <a
            href="https://scholar.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-amber-900 hover:text-amber-950 bg-white hover:bg-amber-100/60 px-3 py-1.5 rounded-md border border-amber-300 transition-colors shadow-2xs"
          >
            Google Scholar
            <ExternalLink className="w-3 h-3 text-amber-700" />
          </a>
        </div>
      </div>
    </div>
  );
};
