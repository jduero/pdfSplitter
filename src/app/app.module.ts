import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PdfsplitterComponent } from './components/pdfsplitter/pdfsplitter.component';
import { PdftowordComponent } from './components/pdftoword/pdftoword.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PdfmergerComponent } from './components/pdfmerger/pdfmerger.component'; 
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    PdfsplitterComponent,
    PdftowordComponent,
    PdfmergerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
