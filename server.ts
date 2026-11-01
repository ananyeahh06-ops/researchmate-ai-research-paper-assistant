import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { synthesizeAcademicPaper, synthesizeRegeneratedSection } from './src/utils/academicSynthesizer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const port = process.env.PORT || 3000;

// Initialize Gemini Client with server User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Resilient call helper with retry and backoff for high-demand spikes
async function generateContentWithRetry(params: any, primaryModel = 'gemini-3.8-flash', retries = 3) {
  let model = primaryModel;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await ai.models.generateContent({
        ...params,
        model,
      });
    } catch (err: any) {
      const errStr = String(err?.message || err);
      console.warn(`Gemini generation attempt ${attempt} with model ${model} failed:`, errStr);
      const isOverloaded =
        err?.status === 503 ||
        errStr.includes('503') ||
        errStr.includes('high demand') ||
        errStr.includes('UNAVAILABLE') ||
        err?.status === 429 ||
        errStr.includes('429') ||
        errStr.includes('RESOURCE_EXHAUSTED');

      if (isOverloaded && attempt < retries) {
        await new Promise((r) => setTimeout(r, attempt * 1500));
        if (attempt === 2) {
          model = model === 'gemini-3.8-flash' ? 'gemini-flash-latest' : 'gemini-3.8-flash';
        }
        continue;
      }
      throw err;
    }
  }
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5);
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    timestamp: new Date().toISOString(),
  });
});

// Full paper generation endpoint
app.post('/api/generate-paper', async (req: Request, res: Response) => {
  try {
    const { topic, field, paperType, citationStyle, additionalNotes, targetAudience } = req.body;

    if (!topic || !field || !paperType) {
      return res.status(400).json({ error: 'Missing required parameters: topic, field, and paperType are required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key is not configured. Please check Settings > Secrets.',
      });
    }

    const systemInstruction = `You are a distinguished research professor, senior academic editor, and grant reviewer for premier journals (Nature, IEEE Transactions, ACM Computing Surveys, The Lancet, Science, etc.).
Your job is to generate a comprehensive, highly rigorous, and structured research paper draft according to the user's research topic.

ACADEMIC EXCELLENCE & SCHOLARLY STANDARDS:
1. Tone: Formal, objective, authoritative scholarly English. Avoid conversational fluff or superficial generalities.
2. Structure: Follow high-standard IMRaD (Introduction, Methods, Results, Discussion) and standard disciplinary conventions.
3. Depth: Provide rich, multi-paragraph scholarly reasoning. Formulate concrete hypotheses, systematic research questions, explicit methodological protocols, and nuanced implications.
4. Methodology: Detail data sources, experimental/sampling paradigms, computational frameworks or metrics, and validation procedures.
5. Objectives: Provide clearly stated, numbered research objectives (e.g., RO1, RO2, RO3).

CRITICAL CITATION & REFERENCE INTEGRITY NOTICE:
- DO NOT invent or fabricate fake DOIs or fictional citations as verified truths.
- Provide real foundational seminal authors, standard benchmark papers, and real conceptual literature relevant to this domain where widely known.
- In every reference entry, provide:
  - "citation": Formal citation formatted in the requested citation style (${citationStyle || 'APA 7th'}).
  - "doiQuery": A search query string with authors + key terms for automated CrossRef/Google Scholar verification.
  - "verificationNote": Explicit instruction to verify exact publication year, volume, and DOI prior to submission.
  - "suggestedSourceType": One of 'Journal Article', 'Conference Proceedings', 'Book', or 'Report'.`;

    const userPrompt = `Generate a complete, high-quality academic research paper draft with all 12 standard sections:
- Topic: "${topic}"
- Academic Field: "${field}"
- Paper Type: "${paperType}"
- Citation Style: "${citationStyle || 'APA 7th'}"
${targetAudience ? `- Target Audience / Journal tier: "${targetAudience}"` : ''}
${additionalNotes ? `- Specific Researcher Notes / Focus Areas: "${additionalNotes}"` : ''}

Generate all required sections with intellectual depth, rigorous terminology, and coherent academic narrative connecting the problem, methodology, and future implications.`;

    let parsedData: any = null;
    let fallbackUsed = false;

    try {
      const response = await generateContentWithRetry({
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: 'Clear, concise, professional academic research paper title.',
              },
              abstract: {
                type: Type.STRING,
                description: 'A comprehensive, single- or two-paragraph academic abstract (250-350 words) stating context, problem, methodology, key findings/contributions, and significance.',
              },
              keywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '5 to 8 specific academic index keywords and indexing descriptors.',
              },
              introduction: {
                type: Type.STRING,
                description: 'Structured introduction establishing background, context, societal or technological significance, gap in current understanding, and paper roadmap.',
              },
              literatureReview: {
                type: Type.STRING,
                description: 'Thematic review of existing scholarly literature, key theoretical paradigms, historical benchmarks, and critically identified gaps.',
              },
              researchProblem: {
                type: Type.STRING,
                description: 'Formal statement of the research problem, including specific research questions, theoretical bottlenecks, or empirical ambiguities being addressed.',
              },
              researchObjectives: {
                type: Type.STRING,
                description: 'Enumerated primary and secondary research objectives (e.g. RO1, RO2, RO3) with clear measurable milestones.',
              },
              researchMethodology: {
                type: Type.STRING,
                description: 'Detailed methodology: research design, data collection/generation, mathematical formulation or experimental setup, analytical tools, and validation strategies.',
              },
              expectedResults: {
                type: Type.STRING,
                description: 'Anticipated empirical outcomes, comparative metrics, theoretical proofs, qualitative findings, and performance indicators.',
              },
              conclusion: {
                type: Type.STRING,
                description: 'Academic conclusion summarizing main insights, core theoretical/practical contributions, and answering the primary research questions.',
              },
              futureScope: {
                type: Type.STRING,
                description: 'Future directions, scalability opportunities, unresolved questions, edge cases, and recommendations for subsequent research.',
              },
              references: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    citation: {
                      type: Type.STRING,
                      description: 'Full citation formatted in requested citation style.',
                    },
                    doiQuery: {
                      type: Type.STRING,
                      description: 'Search string for CrossRef / Google Scholar lookup (e.g., author names + title terms).',
                    },
                    verificationNote: {
                      type: Type.STRING,
                      description: 'Clarifying verification recommendation for authors.',
                    },
                    suggestedSourceType: {
                      type: Type.STRING,
                      description: 'Type of academic source (Journal Article, Conference Proceedings, Book, Report).',
                    },
                  },
                  required: ['citation'],
                },
                description: 'Curated scholarly references and literature citations representing foundational and contemporary work.',
              },
            },
            required: [
              'title',
              'abstract',
              'keywords',
              'introduction',
              'literatureReview',
              'researchProblem',
              'researchObjectives',
              'researchMethodology',
              'expectedResults',
              'conclusion',
              'futureScope',
              'references',
            ],
          },
        },
      });

      const text = response?.text;
      if (text) {
        parsedData = JSON.parse(text);
      }
    } catch (apiError: any) {
      console.warn('Gemini live call unavailable/quota exhausted, employing academic synthesizer:', apiError?.message);
      fallbackUsed = true;
      parsedData = synthesizeAcademicPaper({
        topic,
        field,
        paperType,
        citationStyle,
        targetAudience,
        additionalNotes,
      });
    }

    if (!parsedData) {
      parsedData = synthesizeAcademicPaper({
        topic,
        field,
        paperType,
        citationStyle,
        targetAudience,
        additionalNotes,
      });
      fallbackUsed = true;
    }

    // Add metadata
    const fullPaper = {
      id: 'paper_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7),
      topic,
      field,
      paperType,
      citationStyle: citationStyle || 'APA 7th',
      targetAudience: targetAudience || 'Academic Peers & Researchers',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...parsedData,
    };

    return res.json({
      success: true,
      paper: fullPaper,
      fallbackUsed,
      notice: fallbackUsed
        ? 'Generated using Academic Synthesizer Engine (Gemini free tier quota exhausted). To use live Gemini 3.8 Flash generation, select a billing-enabled key in Settings > Secrets.'
        : undefined,
    });
  } catch (error: any) {
    console.error('Error in generate-paper route:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate research paper. Please try again.',
    });
  }
});

// Regenerate single section endpoint
app.post('/api/regenerate-section', async (req: Request, res: Response) => {
  try {
    const {
      topic,
      field,
      paperType,
      citationStyle,
      sectionKey,
      currentContent,
      instructions,
      paperTitle,
      paperAbstract,
    } = req.body;

    if (!topic || !sectionKey) {
      return res.status(400).json({ error: 'Missing required parameters: topic and sectionKey.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key is not configured. Please check Settings > Secrets.',
      });
    }

    const systemInstruction = `You are a distinguished academic editor and research specialist.
Your task is to rewrite, expand, or regenerate a specific section of an academic research paper.
Ensure the regenerated section remains completely cohesive with the paper's title, field, and abstract.
Maintain scholarly tone, formal academic prose, clear transitions, and rigorous research terminology.
If instructions are given by the user, follow them strictly.

CRITICAL INTEGRITY NOTICE:
- Do not fabricate fake citations or fake metrics.
- Keep the content intellectually sound, verifiable, and academically appropriate.`;

    const promptText = `Please regenerate the section "${sectionKey}" for the following research paper:
- Topic: ${topic}
- Academic Field: ${field}
- Paper Type: ${paperType}
- Citation Style: ${citationStyle || 'APA 7th'}
- Paper Title: ${paperTitle || topic}
${paperAbstract ? `- Paper Abstract context: ${paperAbstract}` : ''}

CURRENT SECTION CONTENT:
${typeof currentContent === 'object' ? JSON.stringify(currentContent, null, 2) : currentContent}

${instructions ? `USER'S SPECIAL REGENERATION INSTRUCTIONS:\n${instructions}` : 'Please provide a refreshed, academically refined, and thorough revision of this section.'}

Return ONLY the updated content for this section.`;

    // Handle distinct schemas depending on section type
    if (sectionKey === 'keywords') {
      const resp = await generateContentWithRetry({
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              keywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of 5 to 8 academic keywords and search descriptors.',
              },
            },
            required: ['keywords'],
          },
        },
      });
      const parsed = JSON.parse(resp?.text || '{"keywords":[]}');
      return res.json({ success: true, updatedContent: parsed.keywords });
    } else if (sectionKey === 'references') {
      const resp = await generateContentWithRetry({
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              references: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    citation: { type: Type.STRING },
                    doiQuery: { type: Type.STRING },
                    verificationNote: { type: Type.STRING },
                    suggestedSourceType: { type: Type.STRING },
                  },
                  required: ['citation'],
                },
              },
            },
            required: ['references'],
          },
        },
      });
      const parsed = JSON.parse(resp?.text || '{"references":[]}');
      return res.json({ success: true, updatedContent: parsed.references });
    } else {
      const resp = await generateContentWithRetry({
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              content: {
                type: Type.STRING,
                description: 'The complete regenerated academic text for this section.',
              },
            },
            required: ['content'],
          },
        },
      });
      const parsed = JSON.parse(resp?.text || '{"content":""}');
      return res.json({ success: true, updatedContent: parsed.content });
    }
  } catch (error: any) {
    console.warn('Gemini regenerate failed, falling back to academic synthesizer:', error?.message);
    try {
      const { sectionKey, topic, field, paperType, instructions } = req.body;
      const fallbackContent = synthesizeRegeneratedSection(
        sectionKey,
        topic,
        field || 'General Sciences',
        paperType || 'Original Empirical Research',
        instructions
      );
      return res.json({
        success: true,
        updatedContent: fallbackContent,
        fallbackUsed: true,
      });
    } catch (fallbackErr) {
      return res.status(500).json({
        error: error?.message || 'Failed to regenerate section.',
      });
    }
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`ResearchMate server running on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
