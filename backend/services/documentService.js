import fs from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { createWorker } from 'tesseract.js';

export async function extractTextFromFile(filePath, originalname) {
  try {
    const ext = path.extname(originalname).toLowerCase();
    
    // 1. Plain Text (.txt)
    if (ext === '.txt') {
      const text = await fs.readFile(filePath, 'utf8');
      return { text: text.trim(), pages: 1, info: {} };
    }

    // 2. Word Document (.docx)
    if (ext === '.docx' || ext === '.doc') {
      const dataBuffer = await fs.readFile(filePath);
      const result = await mammoth.extractRawText({ buffer: dataBuffer });
      const text = result.value.trim();
      
      if (!text || text.length < 50) {
        throw new Error('Could not extract sufficient text from the Word document.');
      }
      return { text, pages: 1, info: {} };
    }

    // 3. Image (PNG, JPG) -> OCR
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      console.log('Running OCR on image resume...');
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(filePath);
      await worker.terminate();
      
      const cleanedText = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
      if (!cleanedText || cleanedText.length < 50) {
        throw new Error('Could not extract sufficient text from the image. Please ensure the text is legible.');
      }
      return { text: cleanedText, pages: 1, info: {} };
    }

    // 4. PDF (Default)
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    
    const rawText = data.text || '';
    let cleanedText = rawText
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // Removed strict length check to prevent blocking image-based or short PDFs

    return {
      text: cleanedText,
      pages: data.numpages,
      info: data.info || {}
    };
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error(`Failed to extract text: ${error.message}`);
  }
}
