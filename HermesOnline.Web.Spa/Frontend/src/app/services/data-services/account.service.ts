import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ChangePassword } from '../../shared/change-password-dialog/model/change-password.model';
import { Http } from '@angular/http';
import { ResetPassword } from '../../models/reset-password/reset-password.model';
import { User } from '../../models/common/user.model';
import { HttpService } from '../common-services/http.service';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AccountService {
  private urlBase = '/api/account';

  constructor(private httpService: HttpService, private http: Http) { }

  requestResetPassword(email: string): Observable<any> {
    return this.httpService.get(`${this.urlBase}/requestresetpassword/${email}/`);
  }

  getUserName(): Observable<string> {
    return this.httpService.get(`${this.urlBase}/userName`, null, false).map(res => res.json());
  }

  resetPassword(resetPassword: ResetPassword): Observable<any> {
    return this.httpService.post(`${this.urlBase}/resetPassword`, resetPassword);
  }

  requestAccess(user: User): Observable<any> {
    return this.httpService.post(`${this.urlBase}/requestLogin`, user).map(res => res.json());
  }

  checkExistingEmail(email: string): Observable<boolean> {
    return this.httpService.get(`${this.urlBase}/checkExistingEmail/${email}/`).map(res => {
      return res.json();
    });
  }

  checkPassword(password: string): Observable<boolean> {
    return this.httpService.get(`${this.urlBase}/CheckExistingPassword/${password}/`).map(res => {
      return res.json();
    });
  }

  changePassword(changePassword: ChangePassword): Observable<any> {
    return this.httpService.post(`${this.urlBase}/changePassword`, changePassword);
  }

  getCurrentUserPermissions() {
    return this.httpService.get(`${this.urlBase}/identityPermissions`, null, false).toPromise();
  }
}
