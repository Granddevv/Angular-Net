import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResetPassword } from '../../models/reset-password/reset-password.model';
import { AccountService } from '../../services/data-services/account.service';
import { BaseDialog } from '../../common/component-framework/base-dialog';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent extends BaseDialog implements OnInit {
  public model: ResetPassword;
  public confirmPassword: string;
  public passwordNotMatch: boolean;
  public passwordMinLength: boolean;
  public showInfo: boolean;
  public showInputs = true;
  public errorMsg: string;

  constructor(private route: ActivatedRoute,
    private accountService: AccountService) {
    super();
  }

  ngOnInit() {
    this.model = new ResetPassword();
    this.route.params.subscribe(params => {
      this.model.code = params['code'];
      this.model.userId = params['userId'];
    });
  }

  reset() {
    this.loading = true;
    if (!this.hasError()) {
      this.accountService.resetPassword(this.model).subscribe(res => {
        this.loading = false;
        this.showInfo = true;
        this.showInputs = false;
      });
    }
  }

  checkPasswordLength() {
    this.passwordMinLength = this.model.password ? this.model.password.length < 6 : true;
  }

  checkPassword() {
    this.passwordNotMatch = this.model.password !== this.confirmPassword;
  }

  public hasError(): boolean {
    return this.passwordNotMatch
      || this.passwordMinLength;
  }
}