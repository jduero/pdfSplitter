import { Component, OnInit } from '@angular/core';
import { PDFDocument, PDFPage } from 'pdf-lib';

@Component({
  selector: 'app-pdfsplitter',
  templateUrl: './pdfsplitter.component.html',
  styleUrls: ['./pdfsplitter.component.css'],
})
export class PdfsplitterComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  file: any;
  fileChanged(e: Event) {
    this.file = (e.target as HTMLInputElement)?.files?.[0];
  }

  async splitPDF() {

    if (!this.file) {
      alert("Please enter Pdf file!");
      return;
   }
   
    // Load the PDF file
    const pdfData = await this.file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfData, { ignoreEncryption: true });

    // Get the total number of pages in the PDF
    const pageCount = pdfDoc.getPageCount();

    if (pageCount < 5) {
      // Loop through each page and create a separate PDF file
      for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
        // Create a new PDF document
        const newPdf = await PDFDocument.create();

        // Add the current page to the new PDF
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndex]);
        newPdf.addPage(copiedPage);

        // Save the new PDF as a separate file
        const pdfBytes = await newPdf.save();
        const outputFileName = `output_page_${pageIndex + 1}.pdf`;
        this.downloadPDF(pdfBytes, outputFileName);
      }
    }
  }

  downloadPDF(data: Uint8Array, filename: string) {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}
