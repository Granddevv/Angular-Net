import { Component, OnInit } from '@angular/core';
import { User } from '../../models/common/user.model';
import { AccountService } from '../../services/data-services/account.service';
import { BaseDialog } from '../../common/component-framework/base-dialog';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent extends BaseDialog implements OnInit {
  public model: User;
  public infoMsg: string;
  public emailSubmitted: boolean;

  constructor(private accountService: AccountService) {
    super();
  }

  ngOnInit() {
    this.model = new User();
  }

  resetPassword() {
    this.emailSubmitted = true;
    this.loading = true;
    this.accountService.requestResetPassword(this.model.userName).subscribe(result => {
      this.infoMsg = 'Please check your email to reset your password.';
      this.loading = false;
    }, error => {
      this.emailSubmitted = false;
      this.infoMsg = error._body;
    });
  }
}
