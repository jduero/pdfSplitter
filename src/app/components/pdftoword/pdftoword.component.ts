import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pdftoword',
  templateUrl: './pdftoword.component.html',
  styleUrls: ['./pdftoword.component.css'],
})
export class PdftowordComponent implements OnInit {
  file: any;
  fileChanged(e: Event) {
    this.file = (e.target as HTMLInputElement)?.files?.[0];
  }

  constructor() {}

  ngOnInit(): void {}


  toWord() {
   
  }
}
