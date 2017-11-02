// tslint:disable:max-line-length

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CollapseModule, BsDropdownModule, CarouselModule } from 'ngx-bootstrap';
import { HeaderComponent } from '../shared/header/header.component';
import { RouterModule } from '@angular/router';
import { MaterialModule, MdSlideToggleModule } from '@angular/material';
import { NgUploaderModule } from '../../custom_node_modules/ngx-uploader/src/module/ngx-uploader.module';
import { TruncatePipe } from '../common/pipes/truncate.pipe';
import { NumOfSelectedQuickFiltersPipe } from '../common/pipes/num-of-selected-quick-filters.pipe';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { AddDeepZoomLinkComponent } from '../manager-view/findings-overview/deep-zoom-link/dialogs/add-deep-zoom-link/add-deep-zoom-link.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FooterComponent } from '../shared/footer/footer.component';
import { QuickFilterComponent } from './quick-filter/quick-filter.component';
import { HasAnyPermissionDirective } from '../common/directive/has-any-permission-directive.directive';
import { SelectModule } from 'ng2-select';
import { ImportFindingsComponent } from './import-findings/import-findings.component';
import { TextMaskModule } from 'angular2-text-mask';
import { DeleteDataComponent } from '../admin/delete-data/delete-data';
import { ColumnVisibilityComponent } from '../manager-view/findings-overview/column-visibility/column-visibility.component';
import { DataQualityComponent } from '../manager-view/findings-overview/dialogs/data-quality/data-quality.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    CarouselModule.forRoot(),
    MaterialModule,
    FormsModule,
    MdSlideToggleModule,
    NgUploaderModule,
    NgxDatatableModule,
    SelectModule,
    TextMaskModule,
    BrowserAnimationsModule
  ],
  declarations: [
    HeaderComponent,
    TruncatePipe,
    NumOfSelectedQuickFiltersPipe,
    ConfirmationDialogComponent,
    AlertDialogComponent,
    FooterComponent,
    QuickFilterComponent,
    ChangePasswordDialogComponent,
    HasAnyPermissionDirective,
    AddDeepZoomLinkComponent,
    ImportFindingsComponent,
    DeleteDataComponent,
    ColumnVisibilityComponent,
    DataQualityComponent
  ],
  entryComponents: [ConfirmationDialogComponent, AlertDialogComponent, ChangePasswordDialogComponent, AddDeepZoomLinkComponent, ImportFindingsComponent, DeleteDataComponent, DataQualityComponent],
  exports: [
    HeaderComponent,
    TruncatePipe,
    NumOfSelectedQuickFiltersPipe,
    MaterialModule,
    MdSlideToggleModule,
    NgUploaderModule,
    NgxDatatableModule,
    CarouselModule,
    BsDropdownModule,
    CollapseModule,
    QuickFilterComponent,
    FooterComponent,
    HasAnyPermissionDirective,
    SelectModule,
    TextMaskModule,
    ColumnVisibilityComponent,
    DataQualityComponent]
})
export class SharedModule { }
