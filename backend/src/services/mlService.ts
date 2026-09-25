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
    const response = await axios.post(`${ML_SERVICE_URL}/analyze`, {
      text,
      deterministic_risk: deterministicRisk
    }, {
      timeout: 3000 // 3 seconds timeout to prevent hanging the main investigation
    });

    if (response.data && response.data.status === 'success') {
      return {
        available: true,
        model: 'scam-text-classifier', // Defaulting based on requirements
        version: response.data.model_version,
        score: response.data.ml_risk_score,
        confidence: response.data.ml_confidence
      };
    }

    return {
      available: false,
      reason: 'INVALID_RESPONSE'
    };
  } catch (error: any) {
    if (error.response && error.response.status === 503) {
      return { available: false, reason: 'MODEL_NOT_READY' };
    }
    return {
      available: false,
      reason: error.code === 'ECONNABORTED' ? 'TIMEOUT' : 'SERVICE_UNAVAILABLE'
    };
  }
}
