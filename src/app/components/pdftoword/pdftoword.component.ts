import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  convertPdfToWord(): void {
    const storageUrl = 'https://storage.cloudconvert.com/tasks';
    const jobsUrl = 'https://api.cloudconvert.com/v2/jobs';
    const apiKey = environment.apiKey;

    if (!this.file) {
      alert('Please enter Pdf file!');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${apiKey}`,
    });
    // Step 1: request jobs
    this.http
      .post(
        jobsUrl,
        {
          tasks: {
            'import-my-file': {
              operation: 'import/upload',
            },
            'convert-my-file': {
              operation: 'convert',
              input: 'import-my-file',
              input_format: 'pdf',
              output_format: 'docx',
            },
            'export-my-file': {
              operation: 'export/url',
              input: 'convert-my-file',
            },
          },
          tag: 'myjob-123',
          redirect: false,
        },
        { headers }
      )
      .subscribe((response: any) => {
        console.log('response', response);
        const jobId = response.data.id;
        const task = response.data.tasks.find(
          (s: { operation: string }) => s.operation == 'import/upload'
        );
        const formData = new FormData();
        formData.append('acl', task.result.form.parameters.acl);
        formData.append('key', task.result.form.parameters.key);
        formData.append(
          'success_action_status',
          task.result.form.parameters.success_action_status
        );
        formData.append(
          'X-Amz-Credential',
          task.result.form.parameters['X-Amz-Credential']
        );
        formData.append(
          'X-Amz-Algorithm',
          task.result.form.parameters['X-Amz-Algorithm']
        );
        formData.append(
          'X-Amz-Date',
          task.result.form.parameters['X-Amz-Date']
        );
        formData.append('Policy', task.result.form.parameters.Policy);
        formData.append(
          'X-Amz-Signature',
          task.result.form.parameters['X-Amz-Signature']
        );
        formData.append('file', this.file);

        //Step 2: Run the import task
        this.http
          .post(storageUrl, formData, { responseType: 'text' })
          .subscribe((data) => console.log(data));

        // Step 3: Poll Job Status
        this.pollJobStatus(jobsUrl, jobId, headers);
      });
  }

  pollJobStatus(url: string, jobId: string, headers: HttpHeaders): void {
    this.http.get(`${url}/${jobId}`, { headers }).subscribe((response: any) => {
      const status = response.data.status;
      const task = response.data.tasks.find(
        (s: { operation: string }) => s.operation == 'export/url'
      );

      if (status === 'completed' || status === 'finished') {
        const downloadUrl = task.result.files[0].url;
        this.downloadFile(downloadUrl, 'converted.docx');
      } else if (
        status === 'processing' ||
        status === 'pending' ||
        status === 'waiting'
      ) {
        setTimeout(() => {
          this.pollJobStatus(url, jobId, headers);
        }, 1000); // Poll every 1 second
      }
    });
  }

  downloadFile(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  }
}
