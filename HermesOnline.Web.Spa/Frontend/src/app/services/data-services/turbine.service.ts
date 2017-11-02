import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../common-services/http.service';
import { IdText } from '../../models/shared/idtext';
import { IdValue } from '../../models/manager-view/global/idvalue';

@Injectable()
export class TurbineService {
  private readonly urlBase = '/api/turbine';

  constructor(private http: HttpService) { }

  public GetName(turbineId: any): Observable<string> {
    return this.http.get(`${this.urlBase}/name/${turbineId}`).map(response => response.json());
  }

  public GetTurbineByBladeId(bladeId: any): Observable<any> {
    return this.http.get(`${this.urlBase}/blade/${bladeId}`).map(response => response.json());
  }

  public GetTurbinesBySiteId(siteId: any): Observable<any> {
    return this.http.get(`${this.urlBase}/site/${siteId}`).map(response => response.json());
  }

  public GetMaxNumOfDefects(turbineId: any): Observable<number> {
    return this.http.get(`${this.urlBase}/maxnumofdefect/${turbineId}`).map(response => response.json());
  }

  public GetBladeLength(turbineId: any): Observable<number> {
    return this.http.get(`${this.urlBase}/bladelength/${turbineId}`).map(response => response.json());
  }

  public getTurbineBySiteId(siteId: string): Observable<Array<IdText>> {
    return this.http.get(`${this.urlBase}/getTurbineBySiteId/${siteId}`).map(data => data.json());
  }

  public SearchTurbines(id: string): Observable<IdValue[]> {
    return this.http.get(`${this.urlBase}/search/${id}`).map(response => response.json());
  }

  public getTurbineListBySiteId(siteId: string): Observable<Array<IdText>> {
    return this.http.get(`${this.urlBase}/getTurbineBySiteId/${siteId}`).map(data => data.json());
  }

   public getTurbineForBlade(bladeId: string): Observable<IdText> {
    return this.http.get(`${this.urlBase}/getTurbineForBlade/${bladeId}`).map(data => data.json());
  }
}
