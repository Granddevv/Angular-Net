import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpService } from '../common-services/http.service';
import { Observable } from 'rxjs/Observable';
import { FileUploadLogTableFilterModel, FileUploadLogTableModel } from '../../models/file-upload-logs/file-upload-logs.model';

@Injectable()
export class FileUploadLogsService {
  private readonly urlBase = '/api/fileUploadLog';

  constructor(private http: HttpService) {
  }

  filterTable(filter: FileUploadLogTableFilterModel): Observable<FileUploadLogTableModel> {
    return this.http.get(`${this.urlBase}/${filter.pageIndex}/${filter.pageSize}`)
      .map(data => data.json() || {});
  }
}
