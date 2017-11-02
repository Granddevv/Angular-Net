import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../common-services/http.service';
import { TimelineInspection } from '../../models/manager-view/timeline-view/timelineInspection';

@Injectable()
export class TimelineService {
  private readonly urlBase = '/api/timeline';

  constructor(private http: HttpService) { }

  public getTimelineInspectionList(defectId: string): Observable<Array<TimelineInspection>> {
    return this.http.get(`${this.urlBase}/inspectionlist/${defectId}`).map(response => response.json());
  }
}
