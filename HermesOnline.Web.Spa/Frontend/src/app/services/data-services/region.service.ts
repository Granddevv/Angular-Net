import { Injectable } from '@angular/core';
import { HttpService } from '../common-services/http.service';
import { Observable } from 'rxjs/Observable';
import { IdValue } from '../../models/manager-view/global/idvalue';

@Injectable()
export class RegionService {
    private readonly urlBase = '/api/region';

    constructor(private http: HttpService) { }

    public GetRegions(): Observable<any> {
        return this.http.get(this.urlBase, false).map(response => response.json());
    }

    public GetRegion(siteId): Observable<IdValue> {
        return this.http.get(`${this.urlBase}/site/${siteId}`).map(response => response.json());
    }
};
