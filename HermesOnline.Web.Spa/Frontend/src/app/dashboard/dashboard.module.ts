import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ROUTES } from './dashboard.routes';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { UserActivityComponent } from './user-activity/user-activity.component';
import { AnnouncementsPreviewComponent } from './announcements-preview/announcements-preview.component';
import { StatisticOverviewComponent } from './statistic-overview/statistic-overview.component';
import { ImageVideoPreviewComponent } from './announcements-preview/dialogs/image-video-preview.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forRoot(ROUTES),
        SharedModule
    ],
    entryComponents: [ImageVideoPreviewComponent],
    exports: [],
    declarations: [
        DashboardComponent,
        UserActivityComponent,
        AnnouncementsPreviewComponent,
        StatisticOverviewComponent,
        ImageVideoPreviewComponent
    ]
})
export class DashboardModule { }
