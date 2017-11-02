import { Injectable } from '@angular/core';
import { Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../common-services/http.service';
import { UserActivityTableRowModel, UserActivityRequest } from '../../models/user-activity/user-activity.model';

@Injectable()
export class UserActivityService {
  private readonly urlBase = '/api/userActivity';

  constructor(private http: HttpService) {
  }

  getUserActivities(): Observable<UserActivityTableRowModel[]> {
    return this.http.get(this.urlBase).map(data => data.json());
  }

  saveUserActivity(url: UserActivityRequest): Observable<any> {
    return this.http.post(`${this.urlBase}/save`, JSON.stringify(url));
  }
}
