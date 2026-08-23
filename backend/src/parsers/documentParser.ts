import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function parseDocumentFile(
  filePath: string,
  mimetype: string,
  originalName: string
): Promise<string> {
  const extension = originalName.split('.').pop()?.toLowerCase() || '';

  if (mimetype === 'application/pdf' || extension === 'pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text || '';
  }

  if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    extension === 'docx'
  ) {
    const dataBuffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer: dataBuffer });
    return result.value || '';
  }

  // Fallback for plain text, markdown, csv, or json files
  return fs.readFileSync(filePath, 'utf-8');
}
