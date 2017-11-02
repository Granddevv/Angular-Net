import { Route } from '@angular/router';
import { SearchByComponent } from './filter/search-by/search-by.component';
import { RegionComponent } from './filter/navigate-by/region/region.component';
import { SiteComponent } from './filter/search-by/site/site.component';
import { TurbineComponent } from './filter/search-by/turbine/turbine.component';
import { CountryComponent } from './filter/navigate-by/country/country.component';
import { SiteNavComponent } from './filter/navigate-by/site/site-nav.component';
import { BladeComponent } from './filter/search-by/blade/blade.component';
import { SummaryViewComponent } from '../manager-view/summary-view/summary-view.component';
import { FindingComponent } from './filter/finding/finding.component';
import { FindingsOverviewComponent } from './findings-overview/findings-overview.component';
import { ManagerViewComponent } from './manager-view.component';
import { TimelineViewComponent } from './timeline-view/timeline-view.component';
import { Permissions } from '../models/common/permissions.enum';
import { AuthGuardService } from '../services/common-services/authGuard.service';

export const ROUTES: Route[] = [
    {
        path: 'managerview',
        component: ManagerViewComponent,
        canActivate: [AuthGuardService],
        data: {
            permissions: [Permissions.ManagerViewNavigation]
        },
        children: [
            // {
            //     // This is default route, but it is defined in managerview.component.ts
            //     path: '',
            //     redirectTo: `/managerview/(filter:searchby)`,
            //     pathMatch: 'full',
            // },
            {
                path: 'searchby',
                outlet: 'filter',
                component: SearchByComponent,
                canActivate: [AuthGuardService],
                data: {
                    permissions: [Permissions.ManagerViewNavigation]
                }
            },
            {
                path: 'navigateby',
                outlet: 'filter',
                component: RegionComponent,
                canActivate: [AuthGuardService],
                data: {
                    permissions: [Permissions.ManagerViewNavigation]
                }
            },
            {
                path: 'navigateby/:regionId/:countryId',
                outlet: 'filter',
                component: SiteNavComponent,
                canActivate: [AuthGuardService],
                data: {
                    permissions: [Permissions.ManagerViewNavigation]
                }
            },
            {
                path: 'navigateby/:regionId',
                outlet: 'filter',
                component: CountryComponent,
                canActivate: [AuthGuardService],
                data: {
                    permissions: [Permissions.ManagerViewNavigation]
                }
            },
            {
                path: 'site/:siteId',
                outlet: 'filter',
                component: SiteComponent,
                canActivate: [AuthGuardService],
                data: {
                    permissions: [Permissions.ManagerViewNavigation]
                }
            },
            {
                path: 'turbine/:turbineId',
                outlet: 'filter',
                component: TurbineComponent,
                canActivate: [AuthGuardService],
                data: {
                    permissions: [Permissions.ManagerViewNavigation]
                }
            },
            {
                path: 'blade/:bladeId',
                outlet: 'filter',
                component: BladeComponent,
                canActivate: [AuthGuardService],
                data: {
                    permissions: [Permissions.ManagerViewNavigation]
                }
            },
            {
                path: 'finding/:findingId',
                outlet: 'filter',
                component: FindingComponent,
                canActivate: [AuthGuardService],
                data: {
                    permissions: [Permissions.ManagerViewNavigation]
                }
            },
            {
                path: 'timeline/finding/:findingId',
                outlet: 'filter',
                component: TimelineViewComponent,
                canActivate: [AuthGuardService],
                data: {
                    permissions: [Permissions.TimelineNavigation]
                }
            },
            {
                path: 'tab/:tabId/type/:type/id/:id',
                outlet: 'findings',
                component: FindingsOverviewComponent,
                canActivate: [AuthGuardService],
                data: {
                    permissions: [Permissions.ManagerViewNavigation]
                }
            }
        ]
    }
];
