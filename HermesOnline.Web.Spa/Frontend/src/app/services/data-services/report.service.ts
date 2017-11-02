import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReportTableFilterModel } from '../../models/manager-view/finding-overview/common/report/report-data-table-filter.model';
import { ReportDataTable } from '../../models/manager-view/finding-overview/common/report/report-data-table.model';
import { HttpService } from '../common-services/http.service';
import { Report } from '../../models/manager-view/finding-overview/common/report/report';

@Injectable()
export class ReportService {
  private readonly urlBase = '/api/report';

  constructor(private http: HttpService) { }

  filterTable(filter: ReportTableFilterModel): Observable<ReportDataTable> {
    return this.http.post(this.urlBase, JSON.stringify(filter), null, false)
      .map(data => data.json() || {});
  }

  getNumOfReports(id: string): Observable<number> {
    return this.http.get(`${this.urlBase}/count/${id}`, null, false).map(response => response.json());
  }

  deleteReport(id: string) {
    return this.http.delete(`${this.urlBase}/deleteReport/${id}`, null, false);
  }

  downloadAttachment(id: string) {
    return this.http.get(`${this.urlBase}/download/${id}`, new RequestOptions({ responseType: ResponseContentType.Blob }), false);
  }

  create(report: Report) {
    return this.http.post(`${this.urlBase}/create?nodeId=${report.nodeId}`,
      new RequestOptions({ responseType: ResponseContentType.Blob }));
  }
}
