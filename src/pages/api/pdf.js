import fetch from 'node-fetch';
import { PDFExtract } from "pdf.js-extract";
import * as pdfjs from "pdf.js-extract/lib/pdfjs/pdf.js";
const pdfExtract = new PDFExtract();
import * as pdfjsWorker from "pdf.js-extract/lib/pdfjs/pdf.worker.js";
pdfjsWorker
pdfjs.GlobalWorkerOptions.workerSrc = "pdf.js-extract/lib/pdfjs/pdf.worker.js";

export default async function handle(req, res) {
  if (req.method === 'POST') {
    const { downloadURL, startPage, endPage } = req.body;

    try {
      const pdfResponse = await fetch(downloadURL);
      const pdfData = await pdfResponse.buffer();

      const options = {
        firstPage: parseInt(startPage),
        lastPage: parseInt(endPage),
      };

      const data = await pdfExtract.extractBuffer(pdfData, options);
      const extractedPages = data.pages;

      let extractedString = '';
      for (const page of extractedPages) {
        for (const item of page.content) {
          extractedString += item.str;
        }
      }

      res.status(200).send(extractedString);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to extract PDF content.' });
    }
  }
}
