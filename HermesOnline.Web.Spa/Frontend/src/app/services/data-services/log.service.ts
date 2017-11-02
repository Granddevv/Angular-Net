import { Injectable } from '@angular/core';
import { Response, RequestOptions, ResponseContentType } from '@angular/http';
import { HttpService } from '../common-services/http.service';
import { Observable } from 'rxjs/Observable';
import { LogTableFilterModel, LogTableModel, LogTableRowModel } from '../../models/logs/log.model';

@Injectable()
export class LogService {
  private readonly urlBase = '/api/log';

  constructor(private http: HttpService) { }

  filterTable(filter: LogTableFilterModel): Observable<LogTableModel> {
    return this.http.post(this.urlBase, JSON.stringify(filter), null, false)
      .map(data => data.json() || {});
  }
  getError(errorId: string): Observable<LogTableRowModel> {
    return this.http.get(`${this.urlBase}/getError/${errorId}`).map(response => response.json());
  }
}
