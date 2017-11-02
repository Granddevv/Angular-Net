// tslint:disable:max-line-length

import { Injectable } from '@angular/core';
import { Response, RequestOptions, ResponseContentType } from '@angular/http';
import { HttpService } from '../common-services/http.service';
import { Observable } from 'rxjs/Observable';
import { AnnouncementsTableModel, AnnouncementsTableFilterModel, Announcement, AnnouncementsTableRowModel } from '../../models/announcements/announcements.model';

@Injectable()
export class AnnouncementsService {
  private readonly urlBase = '/api/announcement';

  constructor(private http: HttpService) {
  }

  filterTable(filter: AnnouncementsTableFilterModel): Observable<AnnouncementsTableModel> {
    return this.http.post(this.urlBase, JSON.stringify(filter), null, false)
      .map(data => data.json() || {});
  }

  create(announcement: Announcement): Observable<any> {
    return this.http.post(`${this.urlBase}/create?title=${announcement.title}&description=${announcement.description}`,
      JSON.stringify(announcement))
      .map((data: Response) => {
        data.status.toString();
      });
  }

  delete(id): Observable<any> {
    return this.http.delete(`${this.urlBase}/delete/${id}`, null, false);
  }

  getLatest(): Observable<AnnouncementsTableRowModel[]> {
    return this.http.get(`${this.urlBase}/getlatest`).map(res => res.json());
  }

  downloadAttachment(id: string) {
    return this.http.get(`${this.urlBase}/download/${id}`, new RequestOptions({ responseType: ResponseContentType.Blob }),  false);
  }
}
