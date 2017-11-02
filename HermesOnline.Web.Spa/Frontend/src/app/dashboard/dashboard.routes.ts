import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { Permissions } from '../models/common/permissions.enum';
import { AuthGuardService } from '../services/common-services/authGuard.service';

export const ROUTES: Route[] = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuardService],
        data: {
            permissions: [Permissions.DashboardNavigation]
        }
    }
];
