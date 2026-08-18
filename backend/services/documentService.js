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

    // 4. PDF (Default) - try text extraction first
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    
    const rawText = data.text || '';
    let cleanedText = rawText
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // 5. OCR fallback for image-based/scanned PDFs — render PDF page to PNG then OCR
    if (cleanedText.length < 50) {
      console.log('PDF has minimal text — attempting OCR fallback for scanned/image-based PDF...');
      try {
        const { createCanvas } = await import('@napi-rs/canvas');
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

        // Provide the worker source path explicitly
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.mjs';

        const pdfData = new Uint8Array(await fs.readFile(filePath));
        const pdfDocument = await pdfjsLib.getDocument({
          data: pdfData,
          useSystemFonts: true,
          disableFontFace: true,
          standardFontDataUrl: 'node_modules/pdfjs-dist/standard_fonts/'
        }).promise;

        let ocrText = '';
        const worker = await createWorker('eng');

        for (let pageNum = 1; pageNum <= Math.min(pdfDocument.numPages, 3); pageNum++) {
          const page = await pdfDocument.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = createCanvas(viewport.width, viewport.height);
          const context = canvas.getContext('2d');

          const canvasFactory = {
            create: (w, h) => {
              const c = createCanvas(w, h);
              return { canvas: c, context: c.getContext('2d') };
            },
            reset: (obj, w, h) => { obj.canvas.width = w; obj.canvas.height = h; },
            destroy: () => {}
          };

          await page.render({ canvasContext: context, viewport, canvasFactory }).promise;

          const imgBuffer = canvas.toBuffer('image/png');
          const { data: { text } } = await worker.recognize(imgBuffer);
          ocrText += text + '\n';
        }

        await worker.terminate();
        const ocrCleaned = ocrText.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

        if (ocrCleaned.length > cleanedText.length) {
          console.log(`✅ OCR extracted ${ocrCleaned.length} chars from scanned PDF.`);
          cleanedText = ocrCleaned;
        }
      } catch (ocrErr) {
        console.warn('OCR fallback failed:', ocrErr.message);
      }
    }


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

