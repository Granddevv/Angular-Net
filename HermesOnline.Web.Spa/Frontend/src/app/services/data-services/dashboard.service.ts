import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../common-services/http.service';
import { DashboardPreview } from '../../models/dashboard/dashboard.model';

@Injectable()
export class DashboardService {
  private readonly urlBase = '/api/dashboard';

  constructor(private http: HttpService) { }

  getDashboardPreview(): Observable<DashboardPreview> {
    return this.http.get(this.urlBase).map(data => data.json());
  }
}
