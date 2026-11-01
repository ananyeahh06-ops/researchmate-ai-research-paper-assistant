export type AcademicField =
  | 'Computer Science & AI'
  | 'Medicine & Health Sciences'
  | 'Environmental & Earth Sciences'
  | 'Engineering & Technology'
  | 'Business, Economics & Management'
  | 'Social Sciences & Psychology'
  | 'Physics & Physical Sciences'
  | 'Humanities & Philosophy'
  | 'Education & Pedagogy'
  | 'Biological & Life Sciences'
  | 'Interdisciplinary Studies';

export type PaperType =
  | 'Original Empirical Research'
  | 'Systematic Literature Review'
  | 'Experimental / Applied Study'
  | 'Methodological Paper'
  | 'Case Study Analysis'
  | 'Theoretical / Conceptual Framework'
  | 'Policy & Position Paper';

export type CitationStyle = 'APA 7th' | 'IEEE' | 'Harvard' | 'MLA 9th' | 'Chicago Author-Date';

export interface ReferenceItem {
  citation: string;
  doiQuery?: string;
  verificationNote?: string;
  suggestedSourceType?: 'Journal Article' | 'Conference Proceedings' | 'Book' | 'Report';
}

export interface PaperSectionMeta {
  key: PaperSectionKey;
  label: string;
  description: string;
  iconName: string;
}

export type PaperSectionKey =
  | 'title'
  | 'abstract'
  | 'keywords'
  | 'introduction'
  | 'literatureReview'
  | 'researchProblem'
  | 'researchObjectives'
  | 'researchMethodology'
  | 'expectedResults'
  | 'conclusion'
  | 'futureScope'
  | 'references';

export interface ResearchPaper {
  id: string;
  topic: string;
  field: string;
  paperType: string;
  citationStyle: CitationStyle;
  targetAudience?: string;
  createdAt: string;
  updatedAt: string;

  // 12 Standard Sections
  title: string;
  abstract: string;
  keywords: string[];
  introduction: string;
  literatureReview: string;
  researchProblem: string;
  researchObjectives: string;
  researchMethodology: string;
  expectedResults: string;
  conclusion: string;
  futureScope: string;
  references: ReferenceItem[];
}

export interface GeneratePaperRequest {
  topic: string;
  field: string;
  paperType: string;
  citationStyle: CitationStyle;
  additionalNotes?: string;
  targetAudience?: string;
}

export interface RegenerateSectionRequest {
  topic: string;
  field: string;
  paperType: string;
  citationStyle: CitationStyle;
  sectionKey: PaperSectionKey;
  currentContent: string | string[] | ReferenceItem[];
  instructions?: string;
  paperTitle?: string;
  paperAbstract?: string;
}
