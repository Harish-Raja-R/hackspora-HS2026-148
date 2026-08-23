import express from 'express';
import multer from 'multer';
import path from 'path';
import os from 'os';
import { handleInvestigate } from '../controllers/investigationController.js';
import { handleCompare } from '../controllers/comparisonController.js';
import { DEMO_CASES } from '../data/demoCases.js';

const router = express.Router();

// Multer storage in OS temp directory
const upload = multer({
  dest: path.join(os.tmpdir(), 'scamcheck-uploads'),
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB file size limit
  }
});

// Primary Investigation Endpoint (Supports text, document upload, screenshot OCR, or URL)
router.post('/investigate', upload.single('file'), handleInvestigate);

// Comparison Endpoint (Side-by-side comparative analysis)
router.post('/compare', handleCompare);

// Demo Opportunities Catalog
router.get('/demos', (_req, res) => {
  res.status(200).json(DEMO_CASES);
});

router.get('/demos/:id', (req, res) => {
  const demo = DEMO_CASES.find((d) => d.id === req.params.id);
  if (!demo) {
    res.status(404).json({ error: 'Demo opportunity not found' });
    return;
  }
  res.status(200).json(demo);
});

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    platform: 'SCAMCHECK AI Opportunity Intelligence',
    version: '1.0.0',
    engineStatus: 'READY',
    timestamp: new Date().toISOString()
  });
});

export default router;
