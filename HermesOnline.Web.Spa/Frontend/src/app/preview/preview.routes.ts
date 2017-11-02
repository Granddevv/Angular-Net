import { Route } from '@angular/router';
import { SingleFindingComponent } from './single-finding/single-finding.component';
import { CompareFindingsComponent } from './compare-findings/compare-findings.component';
import { DeepZoomLinkPreviewComponent } from './deep-zoom-link-preview/deep-zoom-link-preview.component';
import { DeepZoomLinkComparisonComponent } from './deep-zoom-link-comparison/deep-zoom-link-comparison.component';
import { Permissions } from '../models/common/permissions.enum';
import { AuthGuardService } from '../services/common-services/authGuard.service';

export const ROUTES: Route[] = [
    {
        path: 'preview/image/:imageId/:findingId',
        component: SingleFindingComponent,
        canActivate: [AuthGuardService],
        data: {
            permissions: [Permissions.ImagePreviewNavigation]
        }
    },
    {
        path: 'preview/compare-findings/:leftImageId/:leftFindingId/:rightImageId/:rightFindingId',
        component: CompareFindingsComponent,
        canActivate: [AuthGuardService],
        data: {
            permissions: [Permissions.CompareFindingsNavigation]
        }
    },
    {
        path: 'preview/deepzoomlink/:deepZoomLinkId',
        component: DeepZoomLinkPreviewComponent,
        canActivate: [AuthGuardService],
        data: {
            permissions: [Permissions.DeepZoomLinkPreviewNavigation]
        }
    },
    {
        path: 'preview/deepzoomlink/compare/leftdeepzoomlinkid/:leftDeepZoomLinkId/rightdeepzoomlinkid/:rightDeepZoomLinkId',
        component: DeepZoomLinkComparisonComponent,
        canActivate: [AuthGuardService],
        data: {
            permissions: [Permissions.CompareDeepZoomLinkNavigation]
        }
    }
];
