// tslint:disable:max-line-length

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ROUTES } from './admin.routes';
import { SharedModule } from '../shared/shared.module';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { CreateAnnouncementsComponent } from './announcements/dialogs/create-announcements/create-announcements.component';
import { FeedbacksComponent } from './feedbacks/feedbacks.component';
import { CreateCommentComponent } from './feedbacks/dialogs/create-comment/create-comment.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { EditUserManagmentComponent } from './user-management/dialog/edit-user-managment/edit-user-managment.component';
import { PreviewFeedbackComponent } from './feedbacks/dialogs/preview-feedback/preview-feedback.component';
import { TagComponent } from './tag/tag.component';
import { CreateTagDialogComponent } from './tag/dialog/create-tag-dialog/create-tag-dialog.component';
import { LogComponent } from './log/log.component';
import { PreviewLogComponent } from './log/preview-log/preview-log.component';
import { DeletedItemsComponent } from './deleted-items/deleted-items.component';
import { FileUploadLogsComponent } from './file-upload-logs/file-upload-logs.component';
import { PreviewAnnouncementComponent } from './announcements/dialogs/preview-announcement/preview-announcement.component';
import { PreviewTagComponent } from './tag/dialog/preview-tag/preview-tag.component';
import { DefectChangeLogsComponent } from './defect-change-log/defect-change-logs.component';
import { PreviewDefectChangeLogComponent } from './defect-change-log/preview-defect-change-log/preview-defect-change-log.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(ROUTES),
        SharedModule
    ],
    entryComponents: [CreateAnnouncementsComponent, CreateCommentComponent, PreviewFeedbackComponent, CreateTagDialogComponent, EditUserManagmentComponent, PreviewLogComponent, PreviewAnnouncementComponent, PreviewTagComponent, PreviewDefectChangeLogComponent],
    exports: [],
    declarations: [
        AdminComponent,
        AnnouncementsComponent,
        CreateAnnouncementsComponent,
        FeedbacksComponent,
        CreateCommentComponent,
        UserManagementComponent,
        EditUserManagmentComponent,
        PreviewFeedbackComponent,
        TagComponent,
        CreateTagDialogComponent,
        LogComponent,
        PreviewLogComponent,
        DeletedItemsComponent,
        FileUploadLogsComponent,
        PreviewAnnouncementComponent,
        PreviewTagComponent,
        DefectChangeLogsComponent,
        PreviewDefectChangeLogComponent,
    ]
})
export class AdminModule { }
