import { AcademicField, PaperType, CitationStyle, PaperSectionMeta } from '../types/paper';

export const ACADEMIC_FIELDS: { label: AcademicField; icon: string; description: string }[] = [
  {
    label: 'Computer Science & AI',
    icon: 'Cpu',
    description: 'Machine learning, cyber-physical systems, algorithms, distributed systems',
  },
  {
    label: 'Medicine & Health Sciences',
    icon: 'Stethoscope',
    description: 'Clinical trials, epidemiology, pharmacology, public health, oncology',
  },
  {
    label: 'Environmental & Earth Sciences',
    icon: 'Globe',
    description: 'Climate dynamics, biodiversity, renewable energy, oceanography, geology',
  },
  {
    label: 'Engineering & Technology',
    icon: 'Cog',
    description: 'Robotics, aerospace, civil infrastructure, materials science, nanotechnology',
  },
  {
    label: 'Business, Economics & Management',
    icon: 'TrendingUp',
    description: 'Econometrics, supply chain resilience, organizational behavior, fintech',
  },
  {
    label: 'Social Sciences & Psychology',
    icon: 'Users',
    description: 'Cognitive psychology, sociology, political science, behavioral economics',
  },
  {
    label: 'Physics & Physical Sciences',
    icon: 'Atom',
    description: 'Quantum optics, condensed matter, astrophysics, high energy physics',
  },
  {
    label: 'Biological & Life Sciences',
    icon: 'Dna',
    description: 'Genomics, cellular biology, neuroscience, synthetic biology, ecology',
  },
  {
    label: 'Humanities & Philosophy',
    icon: 'BookOpen',
    description: 'Ethics, epistemology, digital humanities, history of science, linguistics',
  },
  {
    label: 'Education & Pedagogy',
    icon: 'GraduationCap',
    description: 'Curriculum design, cognitive learning theory, educational technology',
  },
  {
    label: 'Interdisciplinary Studies',
    icon: 'Layers',
    description: 'Cross-domain synthesis combining computational, social, and empirical paradigms',
  },
];

export const PAPER_TYPES: { label: PaperType; badge: string; description: string }[] = [
  {
    label: 'Original Empirical Research',
    badge: 'Empirical',
    description: 'Novel hypothesis testing, quantitative/qualitative data analysis, experimental findings',
  },
  {
    label: 'Systematic Literature Review',
    badge: 'Review',
    description: 'PRISMA-aligned structured synthesis, thematic taxonomies, meta-analytical review',
  },
  {
    label: 'Experimental / Applied Study',
    badge: 'Applied',
    description: 'Benchmarking, laboratory protocols, prototype evaluations, empirical validation',
  },
  {
    label: 'Methodological Paper',
    badge: 'Methodology',
    description: 'Novel algorithmic pipeline, statistical framework, instrument design or protocol',
  },
  {
    label: 'Case Study Analysis',
    badge: 'Case Study',
    description: 'In-depth investigation of a single or comparative multi-case context and interventions',
  },
  {
    label: 'Theoretical / Conceptual Framework',
    badge: 'Theoretical',
    description: 'Mathematical proofs, conceptual modeling, ontological foundations, philosophical inquiry',
  },
  {
    label: 'Policy & Position Paper',
    badge: 'Policy',
    description: 'Evidence-based policy critique, socio-technical governance, strategic recommendations',
  },
];

export const CITATION_STYLES: CitationStyle[] = [
  'APA 7th',
  'IEEE',
  'Harvard',
  'MLA 9th',
  'Chicago Author-Date',
];

export const SAMPLE_TOPICS: { title: string; field: AcademicField; type: PaperType }[] = [
  {
    title: 'Evaluating Hallucination Mitigation Strategies in Retrieval-Augmented Generation for Clinical Diagnostic AI',
    field: 'Computer Science & AI',
    type: 'Original Empirical Research',
  },
  {
    title: 'Microbial Degradation of Polyethylene Terephthalate in Marine Ecosystems: Enzymatic Pathways and Bioreactor Optimization',
    field: 'Environmental & Earth Sciences',
    type: 'Experimental / Applied Study',
  },
  {
    title: 'Algorithmic Fairness and Disparate Impact in Autonomous Credit Scoring: A Multi-Jurisdictional Comparative Analysis',
    field: 'Business, Economics & Management',
    type: 'Policy & Position Paper',
  },
  {
    title: 'Longitudinal Effects of Smartphone-Induced Continuous Partial Attention on Adolescent Working Memory',
    field: 'Social Sciences & Psychology',
    type: 'Original Empirical Research',
  },
  {
    title: 'Room-Temperature Superconductivity Candidates in Hydride Compounds under Ultra-High Pressure: A Systematic Review',
    field: 'Physics & Physical Sciences',
    type: 'Systematic Literature Review',
  },
  {
    title: 'CRISPR-Cas12 Targeted Diagnostic Assays for Rapid Multiplex Detection of Antimicrobial-Resistant Pathogens',
    field: 'Medicine & Health Sciences',
    type: 'Methodological Paper',
  },
];

export const PAPER_SECTIONS_META: PaperSectionMeta[] = [
  {
    key: 'title',
    label: 'Research Title',
    description: 'Concise, academic, informative title reflecting variable relationships',
    iconName: 'Heading',
  },
  {
    key: 'abstract',
    label: 'Abstract',
    description: 'High-level synthesis: background, gap, methodology, results, and implications',
    iconName: 'FileText',
  },
  {
    key: 'keywords',
    label: 'Keywords',
    description: 'Academic indexing descriptors for cataloging and search retrieval',
    iconName: 'Tag',
  },
  {
    key: 'introduction',
    label: 'Introduction',
    description: 'Problem background, scientific rationale, research gap, and paper organization',
    iconName: 'BookOpen',
  },
  {
    key: 'literatureReview',
    label: 'Literature Review',
    description: 'Critical analysis of seminal benchmarks and contemporary peer-reviewed studies',
    iconName: 'Library',
  },
  {
    key: 'researchProblem',
    label: 'Research Problem',
    description: 'Formal statement of theoretical bottlenecks, dilemmas, or research questions',
    iconName: 'AlertCircle',
  },
  {
    key: 'researchObjectives',
    label: 'Research Objectives',
    description: 'Explicit, enumerated milestones and primary/secondary hypotheses (RO1, RO2, etc.)',
    iconName: 'Target',
  },
  {
    key: 'researchMethodology',
    label: 'Research Methodology',
    description: 'Experimental setup, data protocols, analytical models, metrics, and validity checks',
    iconName: 'FlaskConical',
  },
  {
    key: 'expectedResults',
    label: 'Expected Results',
    description: 'Anticipated empirical outcomes, comparative metrics, and performance indicators',
    iconName: 'LineChart',
  },
  {
    key: 'conclusion',
    label: 'Conclusion',
    description: 'Synthesis of findings, resolution of research problem, and scholarly contributions',
    iconName: 'CheckCircle2',
  },
  {
    key: 'futureScope',
    label: 'Future Scope',
    description: 'Long-term avenues, scalability vectors, open research dilemmas, and extensions',
    iconName: 'Compass',
  },
  {
    key: 'references',
    label: 'References',
    description: 'Suggested scholarly framework (Verification Required before formal submission)',
    iconName: 'Bookmark',
  },
];
