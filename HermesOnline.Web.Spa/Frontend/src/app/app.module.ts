import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Router } from '@angular/router';
import { ManagerViewModule } from './manager-view/manager-view.module';
import { XHRBackend, RequestOptions } from '@angular/http';
import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';
import { LoginComponent } from './global/login/login.component';
import { AdminModule } from './admin/admin.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SharedModule } from './shared/shared.module';
import { ForgotPasswordComponent } from './global/forgot-password/forgot-password.component';
import { DownloadHelper } from './common/helpers/download.helper';
import { ResetPasswordComponent } from './global/reset-password/reset-password.component';
import { CreateFeedbackTypeComponent } from '../app/admin/feedbacks/dialogs/create-feedback-type/create-feedback-type.component';
import { CreateFeedbackComponent } from '../app/admin/feedbacks/dialogs/create-feedback/create-feedback.component';
import { RequestLoginAccessComponent } from './global/request-login-access/request-login-access.component';
import { PreviewModule } from './preview/preview.module';
import { AuthService } from './services/common-services/auth.service';
import { SpinnerService } from './services/common-services/spinner.service';
import { AuthGuardService } from './services/common-services/authGuard.service';
import { PrincipalService } from './services/common-services/principal.service';
import { HttpService } from './services/common-services/http.service';
import { AccountService } from './services/data-services/account.service';
import * as $ from 'jquery';
import 'raphael';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    CreateFeedbackTypeComponent,
    RequestLoginAccessComponent,
    CreateFeedbackComponent    
  ],
  imports: [
    RouterModule.forRoot(ROUTES),
    BrowserModule,
    FormsModule,
    HttpModule,
    ManagerViewModule,
    AdminModule,
    DashboardModule,
    SharedModule,
    PreviewModule,
    BrowserAnimationsModule
  ],
  entryComponents: [CreateFeedbackTypeComponent, CreateFeedbackComponent],
  providers: [
    AuthService,
    SpinnerService,
    DownloadHelper,
    AuthGuardService,
    PrincipalService,
    {
      provide: HttpService,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, SpinnerService, Router]
    },
    AccountService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function httpFactory(backend: XHRBackend, options: RequestOptions, spinnerService: SpinnerService, router: Router) {
  return new HttpService(backend, options, spinnerService, router);
}
