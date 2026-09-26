import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function parseDocumentFile(
  filePath: string,
  mimetype: string,
  originalName: string
): Promise<string> {
  const extension = originalName.split('.').pop()?.toLowerCase() || '';

  try {
    if (mimetype === 'application/pdf' || extension === 'pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      const text = pdfData.text || '';

      if (text.trim().length === 0) {
        throw new Error('PDF contains no selectable text (scanned image or empty document).');
      }

      return text.trim();
    }

    if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      extension === 'docx'
    ) {
      const dataBuffer = fs.readFileSync(filePath);
      const result = await mammoth.extractRawText({ buffer: dataBuffer });
      const text = result.value || '';

      if (text.trim().length === 0) {
        throw new Error('DOCX document contains no readable text.');
      }

      return text.trim();
    }

    // Plain text / Markdown / CSV / JSON
    const content = fs.readFileSync(filePath, 'utf-8');
    if (content.trim().length === 0) {
      throw new Error('Document file is empty.');
    }

    return content.trim();
  } catch (err: any) {
    // Avoid dumping raw stack traces for expected PDF parsing failures
    const isPdfError = err.name === 'InvalidPDFException' || (err.message && (err.message.includes('Invalid PDF structure') || err.message.includes('bad XRef entry') || err.message.includes('Command token too long')));
    
    if (isPdfError) {
      throw new Error('The uploaded PDF could not be parsed because it is invalid or corrupted. Please upload a valid PDF.');
    }
    
    // Log unexpected errors briefly
    console.error(`Document parsing failed: ${err.message || 'Unknown error'}`);
    throw new Error('Unable to extract readable content from this document. The file might be corrupted, unsupported, or password protected.');
  }
}
