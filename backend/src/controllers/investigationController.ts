import { Request, Response } from 'express';
import { extractEntities } from '../engine/entityExtractor.js';
import { evaluateScamPatterns } from '../engine/patternEngine.js';
import { evaluateOrgConsistency } from '../engine/orgConsistency.js';
import { calculatePotentialExposure } from '../engine/exposureCalculator.js';
import { evaluateConfidence } from '../engine/confidenceEngine.js';
import { aggregateInvestigation } from '../engine/riskAggregator.js';
import { parseDocumentFile } from '../parsers/documentParser.js';
import { extractTextFromImage } from '../parsers/ocrParser.js';
import { analyzeUrlTarget } from '../parsers/urlParser.js';
import { InvestigationReport } from '../engine/types.js';

export async function handleInvestigate(req: Request, res: Response): Promise<void> {
  try {
    let inputSnippet = '';
    let inputMode: 'text' | 'document' | 'image' | 'url' = 'text';

    // 1. Check for File Upload (Document or Image)
    if (req.file) {
      const file = req.file;
      const mime = file.mimetype;

      if (mime.startsWith('image/')) {
        inputMode = 'image';
        inputSnippet = await extractTextFromImage(file.path);
      } else {
        inputMode = 'document';
        inputSnippet = await parseDocumentFile(file.path, mime, file.originalname);
      }
    } else if (req.body.url && typeof req.body.url === 'string' && req.body.url.trim().length > 0) {
      inputMode = 'url';
      const targetUrl = req.body.url.trim();
      const urlAnalysis = await analyzeUrlTarget(targetUrl);
      inputSnippet = urlAnalysis.text;
    } else if (req.body.text && typeof req.body.text === 'string') {
      inputMode = 'text';
      inputSnippet = req.body.text;
    } else {
      res.status(400).json({
        error: 'Invalid Request: Please provide text, upload a document/image, or supply a URL to investigate.'
      });
      return;
    }

    if (!inputSnippet || inputSnippet.trim().length === 0) {
      res.status(400).json({
        error: 'Empty Input: No readable content could be extracted from the submitted opportunity.'
      });
      return;
    }

    // 2. Run Engine Pipeline
    const entities = extractEntities(inputSnippet);
    const signals = evaluateScamPatterns(inputSnippet, entities);
    const orgConsistency = evaluateOrgConsistency(inputSnippet, entities);
    const potentialExposure = calculatePotentialExposure(entities, signals);
    const confidence = evaluateConfidence(inputSnippet, entities, signals, orgConsistency);

    const report: InvestigationReport = aggregateInvestigation(
      inputSnippet,
      inputMode,
      entities,
      signals,
      orgConsistency,
      potentialExposure,
      confidence.confidenceScore,
      confidence.confidenceRationale,
      confidence.uncertainty
    );

    res.status(200).json(report);
  } catch (error: any) {
    console.error('Investigation error:', error);
    res.status(500).json({
      error: 'Investigation Engine Error: An unexpected issue occurred while analyzing the opportunity.',
      details: error.message
    });
  }
}
