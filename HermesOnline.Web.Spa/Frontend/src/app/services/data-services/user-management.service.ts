// tslint:disable:max-line-length

import { Injectable } from '@angular/core';
import { HttpService } from '../common-services/http.service';
import { Observable } from 'rxjs/Observable';
import { Response, RequestOptions } from '@angular/http';
import { UserManagementTableFilterModel, UserManagementTableModel, UserManagementTableRowModel } from '../../models/users-management/user-management-table.model';
import { UserManagementQuickFilterModel, UserManagementQuickFilterListModel } from '../../models/users-management/user-management-quick-filter-list.model';

@Injectable()
export class UserManagementService {
  private readonly urlBase = '/api/usermanagement';

  constructor(private http: HttpService) {
  }

  filterTable(filter: UserManagementTableFilterModel): Observable<UserManagementTableModel> {
    return this.http.post(this.urlBase, JSON.stringify(filter), null, false)
      .map(data => data.json() || {});
  }

  delete(userId: string): Observable<any> {
    return this.http.delete(`${this.urlBase}/delete/${userId}`, null, false);
  }

  revokeAccess(userId: string): Observable<any> {
    return this.http.get(`${this.urlBase}/revokeAccess/${userId}`);
  }

  allowAccess(userId: string): Observable<any> {
    return this.http.get(`${this.urlBase}/allowAccess/${userId}`);
  }

  editUserManagment(user: UserManagementTableRowModel): Observable<any> {
    return this.http.post(`${this.urlBase}/editUserManagment/`, JSON.stringify(user), null, false).map((data: Response) => {
      data.status.toString();
    });
  }

  getAllGroups(): Observable<any> {
    return this.http.get(`${this.urlBase}/groups`).map(res => res.json());
  }

  getQuickFilters(quickFilter?: UserManagementQuickFilterModel): Observable<UserManagementQuickFilterListModel> {
    return this.http.post(`${this.urlBase}/quickFilter`, JSON.stringify(quickFilter), null, false)
      .map(data => data.json() || {});
  }
}
