// tslint:disable:max-line-length

import { Injectable } from '@angular/core';
import { HttpService } from '../common-services/http.service';
import { Observable } from 'rxjs/Observable';
import { LocationLinkDataTableFilterModel, LocationLinkDataTableModel, LocationLinkQuickFilterModel, LocationLinkQuickFilterListModel } from '../../models/manager-view/finding-overview/location-link/location-link.model';
import { FindingGroupType } from '../../models/manager-view/common/model/finding-group-type';
import { NodeType } from '../../models/manager-view/common/model/node-type';
import { FindingsQuickFilterModel } from '../../models/manager-view/finding-overview/common/findings/findings-quick-filter.model';
import { SummaryViewItemFilter } from '../../models/manager-view/summary-view/summary-view-item-filter.model';
import { FindingsQuickFilterListModel } from '../../models/manager-view/finding-overview/common/findings/findings-quick-filter-list.model';
import { FindingsActionsDataTableFilterModel } from '../../models/manager-view/finding-overview/common/findings/findings-data-table-filter.model';
import { FindingsDataTableModel } from '../../models/manager-view/finding-overview/common/findings/findings-data-table.model';

@Injectable()
export class DefectGroupActionsService {
  private readonly urlBase = '/api/defectGroupActions';

  constructor(private http: HttpService) { }

  filterLocationLinkTable(filter: LocationLinkDataTableFilterModel): Observable<LocationLinkDataTableModel> {
    return this.http.post(this.urlBase, JSON.stringify(filter))
      .map(data => data.json() || {});
  }

  filterTimeAndViewLinkTable(filter: FindingsActionsDataTableFilterModel): Observable<FindingsDataTableModel> {
    return this.http.post('/api/defectGroupActions', JSON.stringify(filter))
      .map(data => data.json() || {});
  }

  getLocationLinkQuickFilters(
    findingId: string,
    nodeType: NodeType,
    nodeId: string,
    quickFilter?: LocationLinkQuickFilterModel): Observable<LocationLinkQuickFilterListModel> {
    const filter = new LocationLinkDataTableFilterModel(findingId, nodeId, nodeType, quickFilter);
    return this.http.post(`${this.urlBase}/quickFilter`, JSON.stringify(filter))
      .map(data => data.json() || {});
  }

  getQuickFiltersForTimeAndViewLink(
    findingId: string,
    nodeType: NodeType,
    nodeId: string,
    quickFilter?: FindingsQuickFilterModel,
    summaryViewFilter?: SummaryViewItemFilter[], groupType?: FindingGroupType): Observable<FindingsQuickFilterListModel> {
    const filter = new FindingsActionsDataTableFilterModel(findingId, nodeId, nodeType, groupType, quickFilter);
    return this.http.post('/api/defectGroupActions/quickFilter', JSON.stringify(filter))
      .map(data => data.json() || {});
  }

  link(findingId: string, findingToGroupWith: string, findingGroupType: FindingGroupType): Observable<any> {
    return this.http.get(`${this.urlBase}/link/${findingId}/${findingToGroupWith}/${findingGroupType}`);
  }
}
