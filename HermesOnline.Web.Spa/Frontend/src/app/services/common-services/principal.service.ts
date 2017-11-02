import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Permissions } from '../../models/common/permissions.enum';
import { AccountService } from '../data-services/account.service';

@Injectable()
export class PrincipalService {
  private permissions: Array<Permissions>;
  public isAuthenticated = false;

  constructor(private accountService: AccountService) {

  }

  hasAnyPermissions(permissions: Permissions[]): boolean {
    if (!this.permissions) {
      return false;
    }

    for (let i = 0; i < permissions.length; i++) {
      if (this.permissions.indexOf(permissions[i]) !== -1) {
        return true;
      }
    }

    return false;
  }

  checkIdentity(force = false): Promise<any> {
    if (force) {
      this.permissions = null;
    }

    if (!this.permissions) {
      return this.accountService.getCurrentUserPermissions().then(data => {
        this.permissions = data.json();
        this.isAuthenticated = true;
        return Promise.resolve(true);
      }, error => {
        this.permissions = null;
        this.isAuthenticated = false;
        return Promise.resolve(false);
      });
    } else {
      return Promise.resolve(true);
    }
  }
}
