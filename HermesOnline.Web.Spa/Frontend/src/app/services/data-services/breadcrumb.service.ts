import { Injectable } from '@angular/core';
import { HttpService } from '../common-services/http.service';
import { Observable } from 'rxjs/Observable';
import { Breadcrumb } from '../../models/breadcrumb/breadcrumb.model';

@Injectable()
export class BreadcrumbService {
  private readonly urlBase = '/api/breadcrumb';

  constructor(private http: HttpService) { }

  getSiteBreadcrumb(siteId: string): Observable<Breadcrumb> {
    return this.http.get(`${this.urlBase}/site/${siteId}`).map(response => response.json());
  }

  getTurbineBreadcrumb(turbineId: string): Observable<Breadcrumb> {
    return this.http.get(`${this.urlBase}/turbine/${turbineId}`).map(response => response.json());
  }

  getBladeBreadcrumb(bladeId: string): Observable<Breadcrumb> {
    return this.http.get(`${this.urlBase}/blade//${bladeId}`).map(response => response.json());
  }

  getFindingBreadcrumb(findingId: string): Observable<Breadcrumb> {
    return this.http.get(`${this.urlBase}/finding/${findingId}`).map(response => response.json());
  }
}
