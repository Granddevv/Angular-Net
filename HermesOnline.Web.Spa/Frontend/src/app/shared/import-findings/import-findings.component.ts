import { Component, OnInit, EventEmitter, ViewChild, ElementRef, Inject, NgZone } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { NgUploaderOptions, UploadedFile } from '../../../custom_node_modules/ngx-uploader/src/classes/index';
import { AuthConstants } from '../../common/constants/auth.constants';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { HttpResponseMessage } from '../../models/shared/http-response-message.model';
import { TextModel } from '../../models/shared/text.model';
import { FindingsDataTableService } from '../../services/data-services/findings-data-table.service';

@Component({
  selector: 'app-import-findings',
  templateUrl: './import-findings.component.html',
  styleUrls: ['./import-findings.component.scss'],
  providers: [FindingsDataTableService]
})
export class ImportFindingsComponent implements OnInit {
  isSubmitted: boolean;
  importFindingsEvent: EventEmitter<string>;
  importFindingsFileName = '';
  allowedExtensions = true;
  progress: number;
  options: NgUploaderOptions;
  isCanceled = false;

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private findingsService: FindingsDataTableService,
    public dialogRef: MdDialogRef<ImportFindingsComponent>,
    public alertDialog: MdDialog,
    public snackBar: MdSnackBar) {
    this.importFindingsEvent = new EventEmitter<string>();
  }

  ngOnInit() {
    this.options = new NgUploaderOptions({
      url: '',
      filterExtensions: true,
      allowedExtensions: ['zip'],
      autoUpload: false,
      customHeaders: {
        'Authorization': `Bearer ${localStorage.getItem(AuthConstants.tokenLocalStorage)}`,
        maxUploads: 1
      }
    });
  }

  public handlePreviewData(data: any) {
    this.importFindingsFileName = this.fileInput.nativeElement.files[0] !== null ? this.fileInput.nativeElement.files[0].name : '';
  }

  public sendData() {
    this.isSubmitted = true;
    const file = this.fileInput.nativeElement.files[0];
    const extensions = file.name.substring(file.name.length - 3);
    if (extensions !== 'zip') {
      this.allowedExtensions = false;
      this.isSubmitted = false;
    }
    else {
      this.allowedExtensions = true;
      this.importFindingsFileName = file.name;
      this.uploadFile(file);
    }
  }

  private uploadFile(file: File) {
    const fileChunk: Array<Blob> = new Array<Blob>();
    const maxFileSizeMB = 5;
    const bufferChunkSize = maxFileSizeMB * (1024 * 1024);
    let fileStreamPos = 0;

    let endPos = bufferChunkSize;
    const size = file.size;

    while (fileStreamPos < size) {
      fileChunk.push(file.slice(fileStreamPos, endPos));
      fileStreamPos = endPos;
      endPos = fileStreamPos + bufferChunkSize; // set next chunk length
    }

    const totalParts = fileChunk.length;
    let partCount = 0;
    let chunk: Blob;
    while (chunk = fileChunk.shift()) {
      if (this.isCanceled) {
        continue;
      }
      partCount++;
      this.uploadFileChunk(chunk, file.name, totalParts, partCount);
    }
  }

  private uploadFileChunk(chunk: Blob, fileName: string, totalParts: number, partCount: number) {
    if (this.isCanceled) {
      return;
    }
    const formData = new FormData();
    formData.append('file', chunk, fileName);
    $.ajax({
      type: 'POST',
      url: 'api/defects/uploadchunk/' + totalParts + '/' + partCount,
      contentType: false,
      processData: false,
      data: formData,
      beforeSend: function (request) {
        request.setRequestHeader('Authorization', `Bearer ${localStorage.getItem(AuthConstants.tokenLocalStorage)}`);
      },
      success: (data) => {
        if (this.isCanceled) {
          return;
        }
        const progress = Math.floor((partCount / totalParts) * 100);
        if (!this.progress || progress > this.progress) {
          this.progress = progress;
        }
        if (data) {
          this.findingsService.importUploadedFile(new TextModel(fileName)).subscribe(
            response => {
              this.dialogRef.close();
              const alert = this.alertDialog.open(AlertDialogComponent);
              alert.componentInstance.title = response.toString();
              this.snackBar.open('The file has been successfully uploaded', '', { duration: 2000 });
            },
            (error: any) => {
              const err: HttpResponseMessage = error.json();
              this.dialogRef.close();
              const alert = this.alertDialog.open(AlertDialogComponent);
              alert.componentInstance.title = err.message;
            });
        }
      }
    });
  }

  close() {
    this.isCanceled = true;
    this.dialogRef.close();
  }
}
