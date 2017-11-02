import { Route } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { FeedbacksComponent } from './feedbacks/feedbacks.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { TagComponent } from './tag/tag.component';
import { LogComponent } from './log/log.component';
import { DeletedItemsComponent } from './deleted-items/deleted-items.component';
import { FileUploadLogsComponent } from './file-upload-logs/file-upload-logs.component';
import { Permissions } from '../models/common/permissions.enum';
import { AuthGuardService } from '../services/common-services/authGuard.service';
import { DefectChangeLogsComponent } from './defect-change-log/defect-change-logs.component';

export const ROUTES: Route[] = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuardService],
    data: {
      permissions: [Permissions.AdminNavigation]
    },
    children: [
      {
        path: 'announcements',
        component: AnnouncementsComponent,
        canActivate: [AuthGuardService],
        data: {
          permissions: [Permissions.AnnouncementsNavigation]
        }
      },
      {
        path: 'feedbacks',
        component: FeedbacksComponent,
        canActivate: [AuthGuardService],
        data: {
          permissions: [Permissions.FeedbackNavigation]
        }
      },
      {
        path: 'usermanagement',
        component: UserManagementComponent,
        canActivate: [AuthGuardService],
        data: {
          permissions: [Permissions.UserManagementNavigation]
        }
      },
      {
        path: 'tag',
        component: TagComponent,
        canActivate: [AuthGuardService],
        data: {
          permissions: [Permissions.TagNavigation]
        }
      },
      {
        path: 'log',
        component: LogComponent,
        canActivate: [AuthGuardService],
        data: {
          permissions: [Permissions.LogNavitagion]
        }
      },
      {
        path: 'defectChangeLog',
        component: DefectChangeLogsComponent,
        canActivate: [AuthGuardService],
        data: {
          permissions: [Permissions.AdminNavigation]
        }
      },
      {
        path: 'deleteditems',
        component: DeletedItemsComponent,
        canActivate: [AuthGuardService],
        data: {
          permissions: [Permissions.DeletedItemsNavigation]
        }
      },
      {
        path: 'fileUploadLogs',
        component: FileUploadLogsComponent,
        canActivate: [AuthGuardService],
        data: {
          permissions: [Permissions.AdminNavigation]
        }
      }]
  }
];
