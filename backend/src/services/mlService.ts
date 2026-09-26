import axios from 'axios';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export interface MLAnalysisResult {
  available: boolean;
  model?: string;
  version?: string;
  score?: number;
  confidence?: number;
  reason?: string;
}

export async function analyzeWithML(text: string, deterministicRisk: number): Promise<MLAnalysisResult> {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/api/ai/analyze`, {
      text,
      deterministic_risk: deterministicRisk
    }, {
      timeout: 3000 // 3 seconds timeout to prevent hanging the main investigation
    });

    if (response.data && response.data.classification) {
      return {
        available: true,
        model: response.data.model?.name || 'scam-text-classifier',
        version: response.data.model?.version || '1.0.0',
        score: response.data.classification.score,
        confidence: response.data.language?.confidence || 0.9,
      };
    }

    return {
      available: false,
      reason: 'INVALID_RESPONSE'
    };
  } catch (error: any) {
    console.error('ML Service Error:', error.message, error.config?.url);
    if (error.response && error.response.status === 503) {
      return { available: false, reason: 'MODEL_NOT_READY' };
    }
    return {
      available: false,
      reason: error.code === 'ECONNABORTED' ? 'TIMEOUT' : 'SERVICE_UNAVAILABLE'
    };
  }
}
