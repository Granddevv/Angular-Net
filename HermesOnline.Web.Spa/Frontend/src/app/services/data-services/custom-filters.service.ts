// tslint:disable:max-line-length

import { Injectable } from '@angular/core';
import { Response, RequestOptions, ResponseContentType } from '@angular/http';
import { HttpService } from '../common-services/http.service';
import { Observable } from 'rxjs/Observable';
import { CustomFiltersTableFilterModel, CustomFiltersTableModel, CustomFilterModel } from '../../models/custom-filters/custom-filters.model';

@Injectable()
export class CustomFilterService {
  private readonly urlBase = '/api/customFilter';

  constructor(private http: HttpService) {
  }

  filterTable(filter: CustomFiltersTableFilterModel): Observable<CustomFiltersTableModel> {
    return this.http.post(this.urlBase, JSON.stringify(filter))
      .map(data => data.json() || {});
  }

  delete(id): Observable<any> {
    return this.http.delete(`${this.urlBase}/delete/${id}`);
  }

  save(customFilterModel: CustomFilterModel): Observable<any> {
    return this.http.post(`${this.urlBase}/save`, JSON.stringify(customFilterModel));
  }

  getById(customFilterModelId: string): Observable<CustomFilterModel> {
    return this.http.get(`${this.urlBase}/id/${customFilterModelId}`).map(data => data.json());
  }
}
