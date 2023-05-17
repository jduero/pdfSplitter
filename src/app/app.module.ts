import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PdfsplitterComponent } from './components/pdfsplitter/pdfsplitter.component';
import { PdftowordComponent } from './components/pdftoword/pdftoword.component';


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    PdfsplitterComponent,
    PdftowordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
