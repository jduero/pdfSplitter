import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PDFDocument, PDFPage } from 'pdf-lib';

@Component({
  selector: 'app-pdfmerger',
  templateUrl: './pdfmerger.component.html',
  styleUrls: ['./pdfmerger.component.css'],
})
export class PdfmergerComponent implements OnInit {
  @ViewChild('formFilePdf')
  myInputVariable!: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  file: any;
  fileChanged(e: Event) {
    this.file = (e.target as HTMLInputElement)?.files;
    console.log('this.file', this.file);
  }

  async mergePDF() {
    if (!this.file) {
      alert('Please enter Pdf file!');
      return;
    }

    // Create a new PDF document
    const newPdf = await PDFDocument.create();

    for (let fileIndex = 0; fileIndex < this.file.length; fileIndex++) {
      // Load the PDF file
      const pdfData = await this.file[fileIndex].arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfData, {
        ignoreEncryption: true,
      });

      // Get the total number of pages in the PDF
      const pageCount = pdfDoc.getPageCount();

      // Loop through each page
      for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
        // Add the current page to the new PDF
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndex]);
        newPdf.addPage(copiedPage);
      }
    }
    // Save the new PDF as a separate file
    const pdfBytes = await newPdf.save();
    const outputFileName = `Merge.pdf`;
    this.downloadPDF(pdfBytes, outputFileName);
  }

  downloadPDF(data: Uint8Array, filename: string) {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    this.myInputVariable.nativeElement.value = '';
  }
}
