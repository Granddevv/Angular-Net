import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../common-services/http.service';
import { NodeType } from '../../models/manager-view/common/model/node-type';
import { Surface } from '../../models/manager-view/common/model/surface';
import { SummaryViewBladeData } from '../../models/manager-view/summary-view/summary-view-blade-data.model';
import { SummaryViewFilterModel } from '../../models/manager-view/summary-view/summary-view-filter.model';

@Injectable()
export class SummaryViewService {
  private readonly urlBase = '/api/summaryview';

  constructor(private http: HttpService) { }

  public getBladeSurfaceData(nodeId: string, nodeType: NodeType, bladeSurface: Surface): Observable<Array<SummaryViewBladeData>> {
    return this.http.get(`${this.urlBase}/bladesurfacedata/${nodeId}/${nodeType}/${bladeSurface}`)
      .map(response => response.json());
  }

  public getFilteredBladeSurfaceData(filter: SummaryViewFilterModel): Observable<Array<SummaryViewBladeData>> {
    return this.http.post(`${this.urlBase}/filteredbladesurfacedata`, filter, null, false).map(response => response.json());
  }
}

