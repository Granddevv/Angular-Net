import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../common-services/http.service';
import { FindingsDataTableFilterModel } from '../../models/manager-view/finding-overview/common/findings/findings-data-table-filter.model';
import { IdValue } from '../../models/manager-view/global/idvalue';
import { IdText } from '../../models/shared/idtext';

@Injectable()
export class BladeService {
  private readonly urlBase = '/api/blade';

  constructor(private http: HttpService) { }

  public GetBladeOverview(turbineId: any, order: any, filter: FindingsDataTableFilterModel): Observable<any> {
    return this.http.post(`${this.urlBase}/overview/${turbineId}/${order}`, filter).map(response => response.json());
  }

  public GetBladeSideOverview(bladeId: any, surface: any): Observable<any> {
    return this.http.get(`${this.urlBase}/surface/overview/${bladeId}/${surface}`).map(response => response.json());
  }

  public GetName(bladeId: any): Observable<string> {
    return this.http.get(`${this.urlBase}/name/${bladeId}`).map(response => response.json());
  }

  public GetMaxNumOfDefects(bladeId: any): Observable<number> {
    return this.http.get(`${this.urlBase}/maxnumofdefect/${bladeId}`).map(response => response.json());
  }

  public GetLength(bladeId: any): Observable<number> {
    return this.http.get(`${this.urlBase}/length/${bladeId}`).map(response => response.json());
  }

  public GetBladeIdForFinding(findingId: string): Observable<number> {
    return this.http.get(`${this.urlBase}/bladeIdByFindingId/${findingId}`).map(response => response.json());
  }

  public SearchBlades(id: string): Observable<IdValue[]> {
    return this.http.get(`${this.urlBase}/search/${id}`).map(response => response.json());
  }

  public getBladeByTurbineId(turbineId: string): Observable<Array<IdText>> {
    return this.http.get(`${this.urlBase}/getBladeByTurbineId/${turbineId}`).map(data => data.json());
  }

   public getBladeById(bladeId: string): Observable<IdText> {
    return this.http.get(`${this.urlBase}/getBladeById/${bladeId}`).map(data => data.json());
  }
}
