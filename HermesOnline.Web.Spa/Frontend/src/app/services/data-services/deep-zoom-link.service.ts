// tslint:disable:max-line-length

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../common-services/http.service';
import { RequestOptions, ResponseContentType } from '@angular/http';
import { DeepZoomDataTableFilterModel } from '../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-data-table-filter.model';
import { DeepZoomLinkDataTable } from '../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-data-table.model';
import { NodeType } from '../../models/manager-view/common/model/node-type';
import { DeepZoomLinkQuickFilterModel } from '../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-quick-filter.model';
import { DeepZoomLinkInfo } from '../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-info.model';
import { DeepZoomLinkImage } from '../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-image.model';
import { BreadcrumbInfo } from '../../models/preview/breadcrumb-info.model';
import { DeepZoomLinkQuickFilterListModel } from '../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-quick-filter-list.model';

@Injectable()
export class DeepZoomLinkService {
  private readonly urlBase = '/api/deepZoomLink';

  constructor(private http: HttpService) { }

  filterTable(filter: DeepZoomDataTableFilterModel): Observable<DeepZoomLinkDataTable> {
    return this.http.post(this.urlBase, JSON.stringify(filter), null, false)
      .map(data => data.json() || {});
  }

  getNumOfDeepZoomLinks(type: NodeType, id: string): Observable<number> {
    return this.http.get(`${this.urlBase}/count/${type}/${id}`, null, false).map(response => response.json());
  }

  getQuickFilters(nodeType: NodeType, nodeId: string, quickFilter?: DeepZoomLinkQuickFilterModel, excludeDeepZoomLinkId?: string, isCompareToSameBlade?: boolean): Observable<DeepZoomLinkQuickFilterListModel> {
    return this.http.post(`${this.urlBase}/quickFilter/${nodeType}/${nodeId}/${excludeDeepZoomLinkId}/${isCompareToSameBlade}`, JSON.stringify(quickFilter), null, false)
      .map(data => data.json() || {});
  }

  getDeepZoomInfo(deepZoomLinkId: string): Observable<DeepZoomLinkInfo> {
    return this.http.get(`${this.urlBase}/Info/${deepZoomLinkId}`).map(response => response.json() || {});
  }

  getDeepZoomImages(deepZoomLinkId: string): Observable<DeepZoomLinkImage[]> {
    return this.http.get(`${this.urlBase}/Images/${deepZoomLinkId}`).map(response => response.json() || {});
  }

  getBreadcrumbInfo(deepZoomLinkId: string): Observable<BreadcrumbInfo> {
    return this.http.get(`${this.urlBase}/breadcrumb/${deepZoomLinkId}`).map(response => response.json() || {});
  }

  getDeepZoomLinkIdByFindingId(findingId: string): Observable<string> {
    return this.http.get(`${this.urlBase}/getDeepZoomLinkIdByFindingId/${findingId}`)
      .map(data => data.json());
  }

  deleteDeepZoomLink(id: string) {
    return this.http.delete(`${this.urlBase}/delete/${id}`,
      new RequestOptions({ responseType: ResponseContentType.Text }), false);
  }
}
