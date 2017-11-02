// tslint:disable:max-line-length
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeModule } from '../../custom_node_modules/ng2-tree/src/tree.module';
import { ROUTES } from './manager-view.routes';
import { SearchByComponent } from './filter/search-by/search-by.component';
import { SiteComponent } from './filter/search-by/site/site.component';
import { TurbineComponent } from './filter/search-by/turbine/turbine.component';
import { BladeOverviewComponent } from './filter/search-by/turbine/blade-overview/blade-overview.component';
import { RegionComponent } from './filter/navigate-by/region/region.component';
import { CountryComponent } from './filter/navigate-by/country/country.component';
import { SiteNavComponent } from './filter/navigate-by/site/site-nav.component';
import { BladeComponent } from './filter/search-by/blade/blade.component';
import { BladeSideOverviewComponent } from './filter/search-by/blade/blade-side-overview/blade-side-overview.component';
import { FindingsDataTableComponent } from './findings-overview/findings/findings-data-table.component';
import { FindingComponent } from './filter/finding/finding.component';
import { BreadcrumbComponent } from './filter/breadcrumb/breadcrumb.component';
import { FindingsOverviewComponent } from './findings-overview/findings-overview.component';
import { ManagerViewComponent } from './manager-view.component';
import { FindingimageComponent } from './filter/finding/finding-image/finding-image.component';
import { DeepZoomLinksDataTableComponent } from './findings-overview/deep-zoom-link/deep-zoom-link-data-table.component';
import { DeepZoomLinkCompareComponent } from './findings-overview/deep-zoom-link/dialogs/deep-zoom-link-compare/deep-zoom-link-compare.component';
import { AddDeepZoomLinkFolderTreeComponent } from './findings-overview/deep-zoom-link/dialogs/add-deep-zoom-link-folder-tree/add-deep-zoom-link-folder-tree.component';
import { ReportDataTableComponent } from './findings-overview/report/report-data-table.component';
import { HeaderComponent } from '../shared/header/header.component';
import { SharedModule } from '../shared/shared.module';
import { SeverityLegendComponent } from './filter/severity-legend/severity-legend.component';
import { SummaryViewComponent } from './summary-view/summary-view.component';
import { SummaryViewItemComponent } from './summary-view/summary-view-item/summary-view-item.component';
import { GenerateDataExtractDialogComponent } from './findings-overview/dialogs/generate-data-extract/generate-data-extract.component';
import { ComparisonReportGenerationComponent } from './findings-overview/dialogs/comparison-report-generation/comparison-report-generation.component';
import { DetailedViewComponent } from './detailed-view/detailed-view.component';
import { ReportGenerationProgressDialogComponent } from './common/dialogs/report-generation-progress/report-generation-progress.component';
import { TimelineViewComponent } from './timeline-view/timeline-view.component';
import { TimelineViewItemComponent } from './timeline-view/timeline-view-item/timeline-view-item.component';
import { FindingTagsComponent } from './filter/finding/finding-tags/finding-tags.component';
import { FindingTagAddDialogComponent } from './filter/finding/finding-tags/dialog/finding-tag-add-dialog/finding-tag-add-dialog.component';
import { TimeLinkComponent } from './findings-overview/dialogs/time-link/time-link.component';
import { ReportAttachmentComponent } from './report-attachment/report-attachment.component';
import { ViewLinkComponent } from './findings-overview/dialogs/view-link/view-link.component';
import { LocationLinkComponent } from './findings-overview/dialogs/location-link/location-link.component';
import { EditFindingComponent } from '../manager-view/findings-overview/dialogs/edit-finding/edit-finding.component';
import { SiteService } from '../services/data-services/site.service';
import { BladeService } from '../services/data-services/blade.service';
import { TurbineService } from '../services/data-services/turbine.service';
import { UserActivityService } from '../services/data-services/user-activity.service';
import { FindingsFilterManagerService } from '../services/common-services/findings-filter-manager.service';
import { DetailedViewService } from '../services/data-services/detailed-view.service';
import { ColumnVisibilityService } from '../services/common-services/column-visibility.service';
import { ImageService } from '../services/data-services/image.service';
import { FindingsDataTableService } from '../services/data-services/findings-data-table.service';
import { DisapproveFindingComponent } from './findings-overview/dialogs/disapprove -finding/disapprove-finding.component';
import { FindingsCustomFilterBuilderComponent } from './findings-overview/dialogs/findings-custom-filter/findings-custom-filter-builder/findings-custom-filter-builder.component';
import { FindingsCustomFilterComponent } from './findings-overview/dialogs/findings-custom-filter/findings-custom-filter/findings-custom-filter.component';

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TreeModule
    ],
    declarations: [
        SearchByComponent,
        SiteComponent,
        TurbineComponent,
        BladeOverviewComponent,
        RegionComponent,
        CountryComponent,
        SiteNavComponent,
        BladeComponent,
        BladeSideOverviewComponent,
        FindingsDataTableComponent,
        FindingsOverviewComponent,
        BreadcrumbComponent,
        FindingComponent,
        ManagerViewComponent,
        FindingimageComponent,
        DeepZoomLinksDataTableComponent,
        SeverityLegendComponent,
        DeepZoomLinksDataTableComponent,
        ReportDataTableComponent,
        DeepZoomLinkCompareComponent,
        AddDeepZoomLinkFolderTreeComponent,
        SummaryViewComponent,
        SummaryViewItemComponent,
        GenerateDataExtractDialogComponent,
        ComparisonReportGenerationComponent,
        DetailedViewComponent,
        ReportGenerationProgressDialogComponent,
        FindingTagsComponent,
        FindingTagAddDialogComponent,
        TimelineViewComponent,
        TimelineViewItemComponent,
        TimeLinkComponent,
        EditFindingComponent,
        ReportAttachmentComponent,
        LocationLinkComponent,
        ViewLinkComponent,
        EditFindingComponent,
        DisapproveFindingComponent,
        FindingsCustomFilterBuilderComponent,
        FindingsCustomFilterComponent
    ],
    providers: [
        SiteService,
        BladeService,
        TurbineService,
        ImageService,
        FindingsDataTableService,
        UserActivityService,
        FindingsFilterManagerService,
        DetailedViewService,
        ColumnVisibilityService
    ],
    entryComponents: [
        GenerateDataExtractDialogComponent,
        DeepZoomLinkCompareComponent,
        ComparisonReportGenerationComponent,
        ReportGenerationProgressDialogComponent,
        FindingTagAddDialogComponent,
        TimeLinkComponent,
        ViewLinkComponent,
        EditFindingComponent,
        AddDeepZoomLinkFolderTreeComponent,
        ReportAttachmentComponent,
        AddDeepZoomLinkFolderTreeComponent,
        LocationLinkComponent,
        DisapproveFindingComponent,
        FindingsCustomFilterBuilderComponent,
        FindingsCustomFilterComponent
    ]
})
export class ManagerViewModule { }
