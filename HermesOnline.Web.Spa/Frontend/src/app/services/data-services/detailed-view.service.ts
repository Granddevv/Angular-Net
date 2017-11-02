import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../common-services/http.service';
import { DetailedViewDto, DetailedViewFilterModel } from '../../models/manager-view/detail-view/detailed-view.model';

@Injectable()
export class DetailedViewService {
  private readonly urlBase = '/api/detailedView';

  constructor(private http: HttpService) { }

  getData(filter: DetailedViewFilterModel): Observable<DetailedViewDto[]> {
    return this.http.post(this.urlBase, JSON.stringify(filter)).map(response => response.json());
  }
}
