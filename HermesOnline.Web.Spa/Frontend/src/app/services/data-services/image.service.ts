import { Injectable } from '@angular/core';
import { HttpService } from '../common-services/http.service';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ResponseContentType, RequestOptions } from '@angular/http';
import { Defect } from '../../models/manager-view/global/defect';
import { DefectAnnotation } from '../../models/manager-view/common/model/defect-annotation';
import { FindingsDataTableFilterModel } from '../../models/manager-view/finding-overview/common/findings/findings-data-table-filter.model';

@Injectable()
export class ImageService {
  private readonly urlBase = '/api/image';

  constructor(private http: HttpService) { }

  getImageForDownload(findingId: string, imageId: string, showOutline: boolean, showScale: boolean) {
    return this.http.get(`${this.urlBase}/download/${findingId}/${imageId}/${showOutline}/${showScale}`
      , new RequestOptions({ responseType: ResponseContentType.Blob }), false);
  }
}
