import { Route } from '@angular/router';
import { LoginComponent } from './global/login/login.component';
import { ForgotPasswordComponent } from './global/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './global/reset-password/reset-password.component';
import { CreateFeedbackTypeComponent } from '../app/admin/feedbacks/dialogs/create-feedback-type/create-feedback-type.component';
import { RequestLoginAccessComponent } from './global/request-login-access/request-login-access.component';
import { Permissions } from './models/common/permissions.enum';
import { AuthGuardService } from './services/common-services/authGuard.service';


export const ROUTES: Route[] = [
  // For now this is home route
  {
    path: '',
    redirectTo: 'managerview',
    pathMatch: 'full',
    canActivate: [AuthGuardService],
    data: {
      permissions: [Permissions.ManagerViewNavigation]
    }
  },
  {
    path: 'managerview',
    redirectTo: 'managerview',
    pathMatch: 'full',
    canActivate: [AuthGuardService],
    data: {
      permissions: [Permissions.ManagerViewNavigation]
    }
  },
  {
    path: 'resetpassword/:userId/:code',
    component: ResetPasswordComponent,
    canActivate: [AuthGuardService],
    data: {
      allowAnonymous: true
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuardService],
    data: {
      allowAnonymous: true
    }
  },
  {
    path: 'forgotpassword',
    component: ForgotPasswordComponent,
    canActivate: [AuthGuardService],
    data: {
      allowAnonymous: true
    }
  },
  {
    path: 'requestloginaccess',
    component: RequestLoginAccessComponent,
    canActivate: [AuthGuardService],
    data: {
      allowAnonymous: true
    }
  },
  {
    path: '**',
    redirectTo: 'managerview',
    pathMatch: 'full',
  }
];
