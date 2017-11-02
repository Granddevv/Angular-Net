import { Injectable } from '@angular/core';
import { HttpService } from '../common-services/http.service';
import { Observable } from 'rxjs/Observable';
import { IdText } from '../../models/shared/idtext';
import { TreeModel } from '../../../custom_node_modules/ng2-tree/src/tree.types';
import { FullPath } from '../../models/manager-view/finding-overview/common/deep-zoom-link/add-deep-zoom-link-folder-tree.model';
import { AddDeepZoomLinkModel } from '../../models/manager-view/finding-overview/common/deep-zoom-link/add-deep-zoom-link.model';

@Injectable()
export class AddDeepZoomLinkService {
  private readonly urlBase = '/api/addDeepZoomLink';

  constructor(private http: HttpService) { }

  getSites(fleetId: string): Observable<Array<IdText>> {
    return this.http.get(`/api/site/sites/${fleetId}`).map(response => response.json());
  }

  getInspections(siteId: string): Observable<Array<IdText>> {
    return this.http.get(`${this.urlBase}/inspections/${siteId}`).map(response => response.json());
  }

  getChildFolders(fullPath: FullPath): Observable<TreeModel[]> {
    return this.http.post(`${this.urlBase}/getChildFolders`, fullPath).map(response => response.json());
  }

  getRootFolders(): Observable<TreeModel[]> {
    return this.http.get(`${this.urlBase}/getRootFolders`).map(response => response.json());
  }

  addDeepZoomLink(addDeepZoomLinkModel: AddDeepZoomLinkModel): Observable<any> {
    return this.http.post(`${this.urlBase}/create`, addDeepZoomLinkModel).map(response => response.json());
  }
}
