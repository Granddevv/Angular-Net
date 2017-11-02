import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../common-services/http.service';
import { IdText } from '../../models/shared/idtext';
import { IdValue } from '../../models/manager-view/global/idvalue';

@Injectable()
export class SiteService {
  private readonly urlBase = '/api/site';

  constructor(private http: HttpService) { }

  public GetName(siteId: any): Observable<string> {
    return this.http.get(`${this.urlBase}/name/${siteId}`).map(response => response.json());
  }

  public GetNumberOfTourbines(siteId: any): Observable<string> {
    return this.http.get(`${this.urlBase}/numberofturbines/${siteId}`).map(response => response.json());
  }

  public GetSiteByBladeId(bladeId: any): Observable<any> {
    return this.http.get(`${this.urlBase}/blade/${bladeId}`).map(response => response.json());
  }

  public getSites(fleetId: string): Observable<Array<IdText>> {
    return this.http.get(`${this.urlBase}/sites/${fleetId}`).map(response => response.json());
  }

  public SearchSites(search: string): Observable<IdValue[]> {
    return this.http.get(`${this.urlBase}/search/${search}`).map(response => response.json());
  }

  public getSite(): Observable<Array<IdText>> {
    return this.http.get(`${this.urlBase}/getSite`).map(data => data.json());
  }

  public GetSite(turbineId: any): Observable<any> {
    return this.http.get(`${this.urlBase}/${turbineId}`).map(response => response.json());
  }

  public getSiteForTurbine(turbineId: string): Observable<IdText> {
    return this.http.get(`${this.urlBase}/getSiteForTurbine/${turbineId}`).map(data => data.json());
  }

  public getSitesForCountry(countryId): Observable<any> {
    return this.http.get(`${this.urlBase}/country/${countryId}`, false).map(response => response.json());
  }
}
