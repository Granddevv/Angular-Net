import { Component, OnInit } from '@angular/core';
import { AlertDialogComponent } from '../../shared/alert-dialog/alert-dialog.component';
import { MdDialog } from '@angular/material';
import { User } from '../../models/common/user.model';
import { AccountService } from '../../services/data-services/account.service';
import { RequestLoginErrors } from './request-login-access.model';
import { BaseDialog } from '../../common/component-framework/base-dialog';

@Component({
  selector: 'app-request-login-access',
  templateUrl: './request-login-access.component.html',
  styleUrls: ['./request-login-access.component.scss'],
})
export class RequestLoginAccessComponent extends BaseDialog implements OnInit {
  public model: User;
  public showInfo: string;
  public emailExists: boolean;
  public passwordsDoesNotMatch: boolean;
  public mask: Array<string | RegExp>;
  public errors = new RequestLoginErrors();

  constructor(private accountService: AccountService,
    public dialog: MdDialog) {
    super();
  }

  ngOnInit() {
    this.model = new User();
    this.passwordsDoesNotMatch = false;
  }

  submit() {
    this.checkPassword();
    if (!this.hasError()) {
      this.loading = true;
      this.accountService.requestAccess(this.model).subscribe(res => {
        this.showInfo = res;
      }, error => {
        this.loading = false;
        const alertDialog = this.dialog.open(AlertDialogComponent);
        alertDialog.componentInstance.title = 'Error has happened.';
      });
    } else {
      const alertDialog = this.dialog.open(AlertDialogComponent);
      alertDialog.componentInstance.title = 'Entered data are not valid.';
    }
  }

  checkExistingEmail() {
    this.accountService.checkExistingEmail(this.model.userName).subscribe(isExists => {
      this.errors.emailExists = isExists;
    });
  }

  checkPasswordLength() {
    this.errors.passwordLength = this.model.password ? this.model.password.length < 6 : true;
  }

  checkPassword() {
    this.errors.passwordNotMatch = this.model.confirmPassword !== this.model.password;
  }

  checkFirstNameLength() {
    this.errors.firstNameLength = this.model.firstName ? this.model.firstName.length < 2 : true;
  }

  checkLastNameLength() {
    this.errors.lastNameLength = this.model.lastName ? this.model.lastName.length < 2 : true;
  }

  public hasError(): boolean {
    return this.errors.firstNameLength
      || this.errors.lastNameLength
      || this.errors.emailExists
      || this.errors.passwordNotMatch
      || this.errors.passwordLength
      || this.errors.emailValidate;
  }

  validatePhoneNumber(event) {
    var key = window.event ? event.keyCode : event.which;
    if (key > 47 && key < 58) {
      return true;
    } else {
      return false;
    }
  }

  checkEmailValidation() {
    if (this.model.userName.indexOf('@') === -1 || this.model.userName.indexOf('.') === -1) {
      this.errors.emailValidate = true;
    }
    else {
      this.errors.emailValidate = false;
    }
  }
}
