import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  AlertTriangle,
  BookmarkCheck,
  PlusCircle,
  FileText,
  Search,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ResearchPaper, GeneratePaperRequest, PaperSectionKey } from './types/paper';
import {
  getSavedPapers,
  savePaperToStorage,
  deletePaperFromStorage,
  getActivePaperId,
} from './utils/storage';
import { Header } from './components/Header';
import { PaperGeneratorForm } from './components/PaperGeneratorForm';
import { PaperView } from './components/PaperView';
import { LoadingOverlay } from './components/LoadingOverlay';
import { SavedPapersModal } from './components/SavedPapersModal';
import { EthicsModal } from './components/EthicsModal';

export default function App() {
  const [activePaper, setActivePaper] = useState<ResearchPaper | null>(null);
  const [savedPapers, setSavedPapers] = useState<ResearchPaper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState<{
    topic: string;
    field: string;
    paperType: string;
  } | null>(null);

  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratingKey, setRegeneratingKey] = useState<PaperSectionKey | null>(null);

  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isEthicsModalOpen, setIsEthicsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Initialize saved papers and active paper
  useEffect(() => {
    const list = getSavedPapers();
    setSavedPapers(list);

    const lastActiveId = getActivePaperId();
    if (lastActiveId) {
      const match = list.find((p) => p.id === lastActiveId);
      if (match) {
        setActivePaper(match);
      }
    }
  }, []);

  const showToast = (message: string) => {
    setToastNotification(message);
    setTimeout(() => {
      setToastNotification(null);
    }, 3000);
  };

  // Generate full 12-section paper
  const handleGeneratePaper = async (reqData: GeneratePaperRequest) => {
    setIsLoading(true);
    setLoadingDetails({
      topic: reqData.topic,
      field: reqData.field,
      paperType: reqData.paperType,
    });
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate paper from server.');
      }

      const newPaper: ResearchPaper = data.paper;
      setActivePaper(newPaper);
      savePaperToStorage(newPaper);
      setSavedPapers(getSavedPapers());
      showToast('Research Paper Draft generated successfully!');
    } catch (err: any) {
      console.error('Error generating paper:', err);
      setErrorMessage(
        err.message ||
          'Failed to communicate with AI generation engine. Please ensure your Gemini API key is configured.'
      );
    } finally {
      setIsLoading(false);
      setLoadingDetails(null);
    }
  };

  // Regenerate single section
  const handleRegenerateSection = async (
    sectionKey: PaperSectionKey,
    instructions?: string
  ) => {
    if (!activePaper) return;

    setIsRegenerating(true);
    setRegeneratingKey(sectionKey);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/regenerate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: activePaper.topic,
          field: activePaper.field,
          paperType: activePaper.paperType,
          citationStyle: activePaper.citationStyle,
          sectionKey,
          currentContent: (activePaper as any)[sectionKey],
          instructions,
          paperTitle: activePaper.title,
          paperAbstract: activePaper.abstract,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to regenerate section.');
      }

      const updated: ResearchPaper = {
        ...activePaper,
        [sectionKey]: data.updatedContent,
        updatedAt: new Date().toISOString(),
      };

      setActivePaper(updated);
      savePaperToStorage(updated);
      setSavedPapers(getSavedPapers());
      showToast(`Section "${sectionKey}" regenerated successfully.`);
    } catch (err: any) {
      console.error('Error regenerating section:', err);
      setErrorMessage(err.message || 'Failed to regenerate section.');
    } finally {
      setIsRegenerating(false);
      setRegeneratingKey(null);
    }
  };

  const handleUpdatePaper = (updated: ResearchPaper) => {
    setActivePaper(updated);
    savePaperToStorage(updated);
    setSavedPapers(getSavedPapers());
  };

  const handleDeletePaper = (id: string) => {
    const updatedList = deletePaperFromStorage(id);
    setSavedPapers(updatedList);
    if (activePaper?.id === id) {
      setActivePaper(updatedList.length > 0 ? updatedList[0] : null);
    }
    showToast('Paper draft removed.');
  };

  const handleNewDraft = () => {
    setActivePaper(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* Header */}
      <Header
        savedCount={savedPapers.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onNewDraft={handleNewDraft}
        onOpenEthicsModal={() => setIsEthicsModalOpen(true)}
        hasActivePaper={Boolean(activePaper)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                  Generation Error
                </h4>
                <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 underline shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View Switcher: Active Paper View OR Generator Form */}
        {activePaper ? (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={handleNewDraft}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900 hover:underline"
              >
                ← Back to Paper Generator
              </button>
            </div>

            <PaperView
              paper={activePaper}
              onUpdatePaper={handleUpdatePaper}
              onRegenerateSection={handleRegenerateSection}
              isRegenerating={isRegenerating}
              regeneratingKey={regeneratingKey}
            />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Banner */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-purple-50 text-indigo-950 border border-indigo-200/60 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>AI-Assisted Scientific & Academic Manuscript Drafting</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900 tracking-tight">
                Synthesize Rigorous Research Papers with AI
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Generate complete 12-section drafts with formal research problems, literature syntheses, robust methodologies, expected results, and verified citation frameworks.
              </p>
            </div>

            {/* Generator Form */}
            <PaperGeneratorForm
              onGenerate={handleGeneratePaper}
              isLoading={isLoading}
            />

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Full 12 Standard Sections
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  From Abstract and Research Objectives to Methodology and Future Scope, every section is crafted with scholarly rigor.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Section-by-Section Regeneration
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fine-tune any section individually with tailored prompts—expand mathematical detail, condense abstracts, or adjust tone.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Citation Verification Integrity
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  No hallucinated claims. Every suggested reference includes direct CrossRef and Google Scholar verification links.
                </p>
              </div>
            </div>

            {/* Previous Drafts Quick Carousel if any exist */}
            {savedPapers.length > 0 && (
              <div className="pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <BookmarkCheck className="w-4 h-4 text-purple-600" />
                    Resume Previous Paper Drafts ({savedPapers.length})
                  </h3>
                  <button
                    onClick={() => setIsSavedModalOpen(true)}
                    className="text-xs font-semibold text-purple-700 hover:text-purple-900 hover:underline"
                  >
                    View All Drafts →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedPapers.slice(0, 4).map((paper) => (
                    <div
                      key={paper.id}
                      onClick={() => setActivePaper(paper)}
                      className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-xs transition-all cursor-pointer group text-left"
                    >
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        <span className="text-purple-700 font-bold">{paper.field}</span>
                        <span>•</span>
                        <span>{paper.paperType}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-900 transition-colors line-clamp-1">
                        {paper.title || paper.topic}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        {paper.abstract}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Loading Overlay (Requirement #10) */}
      {isLoading && loadingDetails && (
        <LoadingOverlay
          topic={loadingDetails.topic}
          field={loadingDetails.field}
          paperType={loadingDetails.paperType}
        />
      )}

      {/* Saved Papers Modal */}
      <SavedPapersModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedPapers={savedPapers}
        onSelectPaper={(p) => setActivePaper(p)}
        onDeletePaper={handleDeletePaper}
      />

      {/* Academic Ethics Modal */}
      <EthicsModal
        isOpen={isEthicsModalOpen}
        onClose={() => setIsEthicsModalOpen(false)}
      />

      {/* Transient Toast Notification */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-xl border border-slate-800 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastNotification}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-serif font-bold text-slate-800">
            <GraduationCap className="w-4 h-4 text-purple-700" />
            <span>ResearchMate</span>
            <span className="font-sans font-normal text-slate-400 text-[11px]">
              AI Research Paper Assistant
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <button
              onClick={() => setIsEthicsModalOpen(true)}
              className="hover:text-purple-700 transition-colors"
            >
              Academic Verification Policy
            </button>
            <span>•</span>
            <a
              href="https://scholar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-700 transition-colors inline-flex items-center gap-0.5"
            >
              Google Scholar <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="https://search.crossref.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-700 transition-colors inline-flex items-center gap-0.5"
            >
              CrossRef <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="text-[11px] text-slate-400">
            Powered by Google Gemini 3.8 Flash
          </div>
        </div>
      </footer>
    </div>
  );
}
