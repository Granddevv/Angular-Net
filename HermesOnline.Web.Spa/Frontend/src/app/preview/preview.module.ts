// tslint:disable:max-line-length

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FindingPreviewComponent } from './finding-preview/finding-preview.component';
import { CompareFindingsComponent } from './compare-findings/compare-findings.component';
import { ROUTES } from './preview.routes';
import { SharedModule } from '../shared/shared.module';
import { DeepZoomLinkPreviewComponent } from './deep-zoom-link-preview/deep-zoom-link-preview.component';
import { SingleFindingComponent } from './single-finding/single-finding.component';
import { DeepZoomLinkComparisonComponent } from './deep-zoom-link-comparison/deep-zoom-link-comparison.component';
import { BreadcrumbInfoComponent } from './breadcrumb-info/breadcrumb-info.component';
import { FindingsForDeepZoomLinkComponent } from './deep-zoom-link-components/findings-for-deep-zoom-link/findings-for-deep-zoom-link.component';
import { DeepZoomLinkComponent } from './deep-zoom-link-components/deep-zoom-link/deep-zoom-link.component';
import { DeepZoomLinkToolbarComponent } from './deep-zoom-link-components/deep-zoom-link-toolbar/deep-zoom-link-toolbar.component';
import { DeepZoomLinkService } from '../services/data-services/deep-zoom-link.service';
import { FindingsDataTableService } from '../services/data-services/findings-data-table.service';
import { DeepZoomLinkPreviewManagerService } from '../services/common-services/deep-zoom-link-preview-manger.service';
import 'openseadragon';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: [
    FindingPreviewComponent,
    DeepZoomLinkComponent,
    CompareFindingsComponent,
    SingleFindingComponent,
    FindingsForDeepZoomLinkComponent,
    DeepZoomLinkPreviewComponent,
    DeepZoomLinkComparisonComponent,
    DeepZoomLinkToolbarComponent,
    BreadcrumbInfoComponent
  ],
  providers: [
    FindingsDataTableService,
    DeepZoomLinkService,
    DeepZoomLinkPreviewManagerService
  ]
})
export class PreviewModule { }
