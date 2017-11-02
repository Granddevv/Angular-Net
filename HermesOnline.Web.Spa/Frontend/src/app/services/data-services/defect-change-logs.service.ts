import { Injectable } from '@angular/core';
import { Response, RequestOptions, ResponseContentType } from '@angular/http';
import { HttpService } from '../common-services/http.service';
import { Observable } from 'rxjs/Observable';
import { DefectChangeLogsTableFilterModel, DefectChangeLogsTableModel, DefectChangeLogsQuickFilterModel, DefectChangeLogQuickFilterListModel, DefectChangeLogsTableRowModel } from '../../models/manager-view/finding-overview/common/findings/findings-change-log.model';

@Injectable()
export class DefectChangeLogsService {
  private readonly urlBase = '/api/defectChangeLog';

  constructor(private http: HttpService) {
  }

  filterTable(filter: DefectChangeLogsTableFilterModel): Observable<DefectChangeLogsTableModel> {
    return this.http.post(`${this.urlBase}`, JSON.stringify(filter), null, false)
      .map(data => data.json() || {});
  }

  getQuickFilters(quickFilter?: DefectChangeLogsQuickFilterModel): Observable<DefectChangeLogQuickFilterListModel> {
    return this.http.post(`${this.urlBase}/quickFilter`, JSON.stringify(quickFilter), null, false)
      .map(data => data.json() || {});
  }

  cancelFinding(defectChangeLog: DefectChangeLogsTableRowModel): Observable<any> {
    return this.http.post(`${this.urlBase}/cancelFinding/`, JSON.stringify(defectChangeLog)).map((data: Response) => {
      data.status.toString();
    });
  }
}
