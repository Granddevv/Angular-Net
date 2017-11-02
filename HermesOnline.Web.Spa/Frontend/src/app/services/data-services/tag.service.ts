import { Injectable } from '@angular/core';
import { Response, RequestOptions } from '@angular/http';
import { HttpService } from '../common-services/http.service';
import { Observable } from 'rxjs/Observable';
import { Tag, TagsTableFilterModel, TagsTableModel } from '../../models/tags/tag.model';

@Injectable()
export class TagService {
  private readonly urlBase = '/api/tags';

  constructor(private http: HttpService) { }

  create(tag: Tag): Observable<any> {
    return this.http.post(`${this.urlBase}/create`, tag).map((data: Response) => {
      data.status.toString();
    });
  }

  deleteTagFromDefect(findingId: string, tagId: string) {
    return this.http.delete(`${this.urlBase}/defect/delete/${findingId}/${tagId}`, null, false);
  }

  delete(tagId: string) {
    return this.http.delete(`${this.urlBase}/delete/${tagId}`, null, false);
  }

  isUsed(tagId: string): Observable<boolean> {
    return this.http.get(`${this.urlBase}/used/${tagId}`).map(res => res.json());
  }

  filterTable(filter: TagsTableFilterModel): Observable<TagsTableModel> {
    return this.http.post(this.urlBase, JSON.stringify(filter), null, false)
      .map(data => data.json() || {});
  }

  get(findingId: string): Observable<Tag[]> {
    return this.http.get(`${this.urlBase}/defect/all/${findingId}`, null, false).map(data => data.json());
  }

  getAllAvailableForFinding(findingId: string): Observable<Tag[]> {
    return this.http.get(`${this.urlBase}/defect/available/${findingId}`).map(data => data.json());
  }

  addTagToDefect(findingId: string, tagId: string): Observable<any> {
    return this.http.get(`${this.urlBase}/defect/add/${findingId}/${tagId}`);
  }
}
