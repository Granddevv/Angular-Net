import { Component, OnInit } from '@angular/core';
import { MdDialogRef, MdDialog } from '@angular/material';
import { ChangePassword } from './model/change-password.model';
import { AlertDialogComponent } from '../../shared/alert-dialog/alert-dialog.component';
import { AccountService } from '../../services/data-services/account.service';
import { BaseDialog } from '../../common/component-framework/base-dialog';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent extends BaseDialog implements OnInit {

  public model: ChangePassword;

  public passwordDoesNotMatch: boolean;
  public newPasswordMinLength: boolean;
  public invalidOldPassword: boolean;

  constructor(
    public dialogRef: MdDialogRef<ChangePasswordDialogComponent>,
    private accountService: AccountService,
    public dialog: MdDialog) {
    super();
  }

  ngOnInit() {
    this.model = new ChangePassword();
  }

  submit() {
    if (!this.hasError()) {
      this.loading = true;
      this.accountService.changePassword(this.model).subscribe(() => {
        let alertDialog = this.dialog.open(AlertDialogComponent);
        alertDialog.componentInstance.title = 'You successfully changed your password.';
        alertDialog.afterClosed().subscribe(() => this.dialogRef.close());
      });
    }
  }

  checkInvalidOldPassword() {
    this.accountService.checkPassword(this.model.oldPassword || null).subscribe(oldPasswordIsOk => {
      this.invalidOldPassword = !oldPasswordIsOk;
      if (!oldPasswordIsOk) {
        this.invalidOldPassword = true;
      }
    });
  }

  checkPasswordLength() {
    this.newPasswordMinLength = this.model.newPassword ? this.model.newPassword.length < 6 : true;
  }

  checkPassword() {
    this.passwordDoesNotMatch = this.model.confirmPassword !== this.model.newPassword;
  }

  public hasError(): boolean {
    return this.invalidOldPassword
      || this.newPasswordMinLength
      || this.passwordDoesNotMatch;
  }
}