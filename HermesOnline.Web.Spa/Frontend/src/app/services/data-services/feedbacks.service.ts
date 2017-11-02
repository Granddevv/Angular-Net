import { Injectable } from '@angular/core';
import { Response, RequestOptions, ResponseContentType } from '@angular/http';
import { HttpService } from '../common-services/http.service';
import { Observable } from 'rxjs/Observable';
import { FeedbacksTableFilterModel, FeedbacksTableModel, Feedback } from '../../models/feedbacks/feedbacks.model';
import { FeedbackQuickFilterModel, FeedbackQuickFilterListModel } from '../../models/feedbacks/feedback-quick-filter-list.model';

@Injectable()
export class FeedbacksService {
  private readonly urlBase = '/api/feedback';

  constructor(private http: HttpService) {
  }

  filterTable(filter: FeedbacksTableFilterModel): Observable<FeedbacksTableModel> {
    return this.http.post(`${this.urlBase}`, JSON.stringify(filter), null, false)
      .map(data => data.json() || {});
  }

  addCommentForFeedback(feedback: Feedback): Observable<any> {
    return this.http.post(`${this.urlBase}/addCommentForFeedback/`, JSON.stringify(feedback)).map((data: Response) => {
      data.status.toString();
    });
  }

  addAnnouncementForFeedback(id: String): Observable<any> {
    return this.http.post(`${this.urlBase}/addAnnouncementForFeedback/${id}`, '')
      .map(data => data.json() || {});
  }

  getFeedbackCategory(): Observable<any> {
    return this.http.get(`${this.urlBase}/getFeedbackCategory`).map(data => data.json());
  }

  getType(): Observable<any> {
    return this.http.get(`${this.urlBase}/getType`).map(data => data.json());
  }

  getQuickFilters(quickFilter?: FeedbackQuickFilterModel): Observable<FeedbackQuickFilterListModel> {
    return this.http.post(`${this.urlBase}/quickFilter`, JSON.stringify(quickFilter), null, false)
      .map(data => data.json() || {});
  }

  downloadAttachment(id: string) {
    return this.http.get(`${this.urlBase}/download/${id}`, new RequestOptions({ responseType: ResponseContentType.Blob }), false);
  }
}
