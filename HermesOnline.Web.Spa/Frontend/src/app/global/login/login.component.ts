import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginModel } from '../../models/login/login.model';
import { AuthService } from '../../services/common-services/auth.service';
import { PrincipalService } from '../../services/common-services/principal.service';
import { BaseDialog } from '../../common/component-framework/base-dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseDialog implements OnInit {
  model: LoginModel;
  returnUrl: string;
  loginAttemptUnsuccessful: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: AuthService,
    private principalService: PrincipalService
  ) {
    super();
  }

  ngOnInit() {
    this.model = new LoginModel();
    this.loginAttemptUnsuccessful = false;
    this.loginService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.loading = true;
    this.loginService.login(this.model.username, this.model.password).then(
      data => {
        this.router.navigate([this.returnUrl]);
      },
      error => {
        this.loginAttemptUnsuccessful = true;
        this.loading = false;
      });
  }

}
