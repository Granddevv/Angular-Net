import { Injectable } from '@angular/core';
import { HttpService } from '../common-services/http.service';
import { Observable } from 'rxjs/Observable';
import { IdValue } from '../../models/manager-view/global/idvalue';

@Injectable()
export class CountryService {
  private readonly urlBase = '/api/country';

  constructor(private http: HttpService) { }

  public GetCountries(regionId: any): Observable<any> {
    return this.http.get(`${this.urlBase}/${regionId}`).map(response => response.json());
  }

  public GetCountry(siteId: any): Observable<IdValue> {
    return this.http.get(`${this.urlBase}}/site/${siteId}`).map(response => response.json());
  }
};
