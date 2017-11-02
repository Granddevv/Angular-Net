// tslint:disable:max-line-length

import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Defect } from '../../models/manager-view/global/defect';
import { DefectAnnotation } from '../../models/manager-view/common/model/defect-annotation';
import { HttpService } from '../common-services/http.service';
import { FindingsForDeepZoomLinksDataTableFilterModel, FindingsForDeepZoomLinksDataTableModel } from '../../models/preview/findings-for-deep-zoom-link.model';
import { FindingsDataTableModel } from '../../models/manager-view/finding-overview/common/findings/findings-data-table.model';
import { FindingsDataTableFilterModel } from '../../models/manager-view/finding-overview/common/findings/findings-data-table-filter.model';
import { NodeType } from '../../models/manager-view/common/model/node-type';
import { FindingsQuickFilterModel } from '../../models/manager-view/finding-overview/common/findings/findings-quick-filter.model';
import { SummaryViewItemFilter } from '../../models/manager-view/summary-view/summary-view-item-filter.model';
import { BladeOverviewItemFilter } from '../../models/blade-overview-item/blade-overview-item-filter.model';
import { FindingsQuickFilterListModel } from '../../models/manager-view/finding-overview/common/findings/findings-quick-filter-list.model';
import { BreadcrumbInfo } from '../../models/preview/breadcrumb-info.model';
import { FindingsTableRowModel } from '../../models/manager-view/finding-overview/common/findings/findings-data-table-row.model';
import { ServiceResult } from '../../models/common/service-result.model';
import { TextModel } from '../../models/shared/text.model';
import { DefectChangedQuality } from '../../models/manager-view/finding-overview/common/findings/findings-data-quality';
import { IdText } from '../../models/shared/idtext';
import { FindingForEdit } from '../../models/manager-view/finding-overview/common/findings/findings-change-log.model';

@Injectable()
export class FindingsDataTableService {
  private readonly urlBase = '/api/defects';

  constructor(private http: HttpService) { }

  filterFindingsForDeepZoomLinkTable(filter: FindingsForDeepZoomLinksDataTableFilterModel): Observable<FindingsForDeepZoomLinksDataTableModel> {
    return this.http.post(`${this.urlBase}/deepZoomLink`, JSON.stringify(filter))
      .map(data => data.json() || {});
  }

  filterFindingsTable(filter: FindingsDataTableFilterModel): Observable<FindingsDataTableModel> {
    return this.http.post(this.urlBase, JSON.stringify(filter), null, false)
      .map(data => data.json() || {});
  }

  getNumOfFindings(type: NodeType, id: string): Observable<number> {
    return this.http.get(`${this.urlBase}/count/${type}/${id}`, null, false).map(response => response.json());
  }

  getQuickFilters(nodeType: NodeType, nodeId: string,
    quickFilter?: FindingsQuickFilterModel,
    summaryViewFilter?: SummaryViewItemFilter[],
    timeLineViewFilter?: string[],
    bladeOverViewItemFilter?: BladeOverviewItemFilter, customFilterId = ''): Observable<FindingsQuickFilterListModel> {
    const filter = new FindingsDataTableFilterModel(nodeId, nodeType, quickFilter, summaryViewFilter, timeLineViewFilter, bladeOverViewItemFilter);
    filter.customFilterId = customFilterId;
    return this.http.post(`${this.urlBase}/quickFilter`, JSON.stringify(filter), null, false)
      .map(data => data.json() || {});
  }

  changeDataQualityForSelectedFinding(selectedFindingIds: any): Observable<Array<DefectChangedQuality>> {
    return this.http.post(`${this.urlBase}/changeDataQualityForSelectedFinding`, JSON.stringify(selectedFindingIds), null, false).map(data => data.json());
  }

  changeDataQualityForFindingsOfTheInspection(findingId: string): Observable<Array<DefectChangedQuality>> {
    return this.http.get(`${this.urlBase}/changeDataQualityForFindingsOfTheInspection/${findingId}`, null, false).map(data => data.json());
  }

  getBreadcrumbInfo(findingId: string): Observable<BreadcrumbInfo> {
    return this.http.get(`${this.urlBase}/breadcrumb/${findingId}`).map(response => response.json() || {});
  }

  getDefectCategory(): Observable<Array<IdText>> {
    return this.http.get(`${this.urlBase}/getDefectCategory`).map(data => data.json());
  }

  getLayer(category: string): Observable<Array<IdText>> {
    return this.http.get(`${this.urlBase}/getLayer/${category}`).map(response => response.json());
  }

  getSeverity(layer: string, category: string): Observable<Array<string>> {
    return this.http.get(`${this.urlBase}/getSeverity/${layer}/${category}`).map(response => response.json());
  }

  editFinding(finding: FindingForEdit): Observable<any> {
    return this.http.post(`${this.urlBase}/editFinding/`, JSON.stringify(finding), null, false).map((data: Response) => {
      data.status.toString();
    });
  }

  deleteFinding(id: string): Observable<ServiceResult<any>> {
    return this.http.post(`${this.urlBase}/delete/${id}`, JSON.stringify(id), null, false)
      .map(data => data.json() || {});
  }

  getDefect(findingId: string): Observable<Defect> {
    return this.http.get(`${this.urlBase}/${findingId}`).map(response => <Defect>response.json());
  }

  getAnnotations(findingId: string): Observable<DefectAnnotation> {
    return this.http.get(`${this.urlBase}/annotations/${findingId}`).map(response => <DefectAnnotation>response.json());
  }

  getDefectsIds(filter: FindingsDataTableFilterModel): Observable<Array<string>> {
    return this.http.post(`${this.urlBase}/getDefectIds`, JSON.stringify(filter))
      .map(data => data.json() || {});
  }

  importUploadedFile(fileName: TextModel): Observable<Response> {
    return this.http.post('/api/defects/import', fileName)
      .map((response: Response) => response.json());
  }

  getFinding(findingId: string): Observable<FindingsTableRowModel> {
    return this.http.get(`${this.urlBase}/getFinding/${findingId}`).map(response => <FindingsTableRowModel>response.json());
  }
}
