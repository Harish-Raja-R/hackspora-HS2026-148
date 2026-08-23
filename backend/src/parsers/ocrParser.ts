import { createWorker } from 'tesseract.js';

export async function extractTextFromImage(filePath: string): Promise<string> {
  let worker = null;
  try {
    worker = await createWorker('eng');
    const ret = await worker.recognize(filePath);
    await worker.terminate();
    return ret.data.text || '';
  } catch (error) {
    if (worker) {
      try {
        await worker.terminate();
      } catch {
        // ignore
      }
    }
    console.error('OCR Extraction error:', error);
    throw new Error('Failed to extract text from image through OCR.');
  }
}
