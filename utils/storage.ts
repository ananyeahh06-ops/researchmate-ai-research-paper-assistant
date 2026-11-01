import { ResearchPaper } from '../types/paper';

const STORAGE_KEY = 'researchmate_saved_papers_v1';
const CURRENT_ACTIVE_KEY = 'researchmate_active_paper_id_v1';

export function getSavedPapers(): ResearchPaper[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse saved papers from localStorage', e);
    return [];
  }
}

export function savePaperToStorage(paper: ResearchPaper): void {
  try {
    const list = getSavedPapers();
    const existingIdx = list.findIndex((p) => p.id === paper.id);
    let updated: ResearchPaper[];
    if (existingIdx >= 0) {
      updated = [...list];
      updated[existingIdx] = { ...paper, updatedAt: new Date().toISOString() };
    } else {
      updated = [paper, ...list];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 30)));
    localStorage.setItem(CURRENT_ACTIVE_KEY, paper.id);
  } catch (e) {
    console.error('Failed to save paper to storage', e);
  }
}

export function deletePaperFromStorage(id: string): ResearchPaper[] {
  try {
    const list = getSavedPapers().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list;
  } catch (e) {
    console.error('Failed to delete paper from storage', e);
    return [];
  }
}

export function getActivePaperId(): string | null {
  try {
    return localStorage.getItem(CURRENT_ACTIVE_KEY);
  } catch {
    return null;
  }
}
