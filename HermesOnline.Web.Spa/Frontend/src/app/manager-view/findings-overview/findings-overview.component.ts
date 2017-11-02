// tslint:disable:max-line-length

import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdDialog, MdSnackBar } from '@angular/material';
import { FindingsDataTableComponent } from './findings/findings-data-table.component';
import { DeepZoomLinksDataTableComponent } from './deep-zoom-link/deep-zoom-link-data-table.component';
import { ReportDataTableComponent } from './report/report-data-table.component';
import { GenerateDataExtractDialogComponent } from './dialogs/generate-data-extract/generate-data-extract.component';
import { DownloadHelper } from '../../common/helpers/download.helper';
import { ReportGenerationProgressDialogComponent } from '../common/dialogs/report-generation-progress/report-generation-progress.component';
import { ComparisonReportGenerationComponent } from './dialogs/comparison-report-generation/comparison-report-generation.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { AlertDialogComponent } from '../../shared/alert-dialog/alert-dialog.component';
import { ReportAttachmentComponent } from '../report-attachment/report-attachment.component';
import { Tab } from '../../models/manager-view/finding-overview/common/tab/tab';
import { FindingsDataTableFilterModel } from '../../models/manager-view/finding-overview/common/findings/findings-data-table-filter.model';
import { NodeType } from '../../models/manager-view/common/model/node-type';
import { Permissions } from '../../models/common/permissions.enum';
import { ReportGeneratorService } from '../../services/data-services/report-generator.service';
import { BladeService } from '../../services/data-services/blade.service';
import { DeepZoomLinkService } from '../../services/data-services/deep-zoom-link.service';
import { FindingsDataTableService } from '../../services/data-services/findings-data-table.service';
import { ReportService } from '../../services/data-services/report.service';
import { Tables } from '../../models/manager-view/common/model/table-list';
import { FindingsCustomFilterComponent } from './dialogs/findings-custom-filter/findings-custom-filter/findings-custom-filter.component';
import { Subscription } from 'rxjs/Subscription';
import { FindingsFilterManagerService } from '../../services/common-services/findings-filter-manager.service';

@Component({
  selector: 'app-findings-overview',
  templateUrl: './findings-overview.component.html',
  styleUrls: ['./findings-overview.component.scss'],
  entryComponents: [FindingsDataTableComponent, DeepZoomLinksDataTableComponent, ReportDataTableComponent],
  providers: [DeepZoomLinkService, ReportService, ReportGeneratorService]
})

export class FindingsOverviewComponent implements OnInit {
  @ViewChild(ReportDataTableComponent) reportDataTable: ReportDataTableComponent;
  @ViewChild(FindingsDataTableComponent) findingDataTable: FindingsDataTableComponent;

  @Input()
  findingsDataTableFilter: FindingsDataTableFilterModel;

  @Output()
  rowSelected = new EventEmitter();

  public Permissions = Permissions;
  Tab = Tab;
  tab: Tab;
  id: string;
  type: NodeType;
  NodeType = NodeType;
  selectedFindingId: string;
  selectedRowsForReport = {};
  findingsCount: number;
  deepZoomLinksCount: number;
  reportCount: number;
  isClicked: boolean;
  tableName: Tables;
  isCustomFilterApplied: boolean;
  private customFilterChangeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private findingsDataTableService: FindingsDataTableService,
    private deepZoomLinkService: DeepZoomLinkService,
    private reportService: ReportService,
    private bladeService: BladeService,
    private dialog: MdDialog,
    private reportGeneratorService: ReportGeneratorService,
    public snackBar: MdSnackBar,
    private findingsFilterManagerService: FindingsFilterManagerService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.type = params['type'];
      this.tab = Number.parseInt(params['tabId']);
      this.tableName = Number.parseInt(params['tabId']);
      this.deepZoomLinkService.getNumOfDeepZoomLinks(this.type, this.id).subscribe(num => this.deepZoomLinksCount = num);
      this.reportService.getNumOfReports(this.id).subscribe(num => this.reportCount = num);
      this.isCustomFilterApplied = false;
    });
  }

  public onRowSelected(findingId) {
    this.selectedFindingId = findingId;
    this.rowSelected.emit(findingId);
  }

  public onSelectedRowsForReport(selectedRowsForReport) {
    this.selectedRowsForReport = selectedRowsForReport;
  }

  public findingsRecordsNumber(totalRecordsNumber: number) {
    this.findingsCount = totalRecordsNumber;
  }

  public deepZoomsRecordsNumber(totalRecordsNumber: number) {
    this.deepZoomLinksCount = totalRecordsNumber;
  }

  public reportsRecordsNumber(totalRecordsNumber: number) {
    this.reportCount = totalRecordsNumber;
  }

  public changeTab(tab: Tab) {
    if (tab !== Tab.Findings && this.selectedFindingId) {
      this.bladeService.GetBladeIdForFinding(this.selectedFindingId).subscribe(bladeId => {
        this.router.navigate(['/managerview',
          {
            outlets: {
              'filter': ['blade', bladeId],
              'findings': ['tab', tab, 'type', this.type, 'id', this.id]
            }
          }]);
      });
    } else {
      this.router.navigate(['/managerview',
        {
          outlets: {
            'findings': ['tab', tab, 'type', this.type, 'id', this.id]
          }
        }]);
    }
  }

  public generateDataExtractReport() {
    const dialog = this.dialog.open(GenerateDataExtractDialogComponent);
    dialog.componentInstance.model.nodeId = this.id;
    dialog.componentInstance.model.nodeType = this.type;
    dialog.componentInstance.onCloseEvent = () => {
      dialog.close();
    };
  }

  public openTimeline() {
    this.isClicked = !this.isClicked;
    var savedType;
    var savedId;
    var link = this.router.url;
    var findingId = link.split('/')[4];
    this.route.params.subscribe(params => {
      savedType = params['type'];
      savedId = params['id'];
      this.selectedRowsForReport = [];
    })
    if (!this.isClicked) {
      this.router.navigate(['/managerview',
        {
          outlets: {
            'filter': ['finding', findingId],
            'findings': ['tab', 0, 'type', savedType, 'id', savedId]
          }
        }]);
      this.findingDataTable.resetTable();
    }
  }

  public generateBladeHealthReport() {
    this.reportGeneratorService.reportGenerationStart().subscribe(taskId => {
      const dialog = this.dialog.open(ReportGenerationProgressDialogComponent, { disableClose: true });
      dialog.config.disableClose = true;
      dialog.componentInstance.taskId = taskId;
      const message = 'Please extract the downloaded zip file!';
      this.snackBar.open(message, '', { duration: 2000 });
      dialog.componentInstance.downloadResponse = this.reportGeneratorService.getBladeHealthReport(this.id, this.type, taskId);
      dialog.componentInstance.onCloseEvent = () => {
        dialog.close();
      };
    });
  }

  public generateComparisonReport() {
    const dialog = this.dialog.open(ComparisonReportGenerationComponent);
    dialog.componentInstance.model.nodeId = this.id;
    dialog.componentInstance.model.nodeType = this.type;
    dialog.componentInstance.onCloseEvent = () => {
      dialog.close();
    };
  }

  public generateRepairReport() {
    if (Object.keys(this.selectedRowsForReport).length === 0) {
      const dialog = this.dialog.open(AlertDialogComponent);
      dialog.componentInstance.title = 'No findings selected.';
    } else {
      this.reportGeneratorService.reportGenerationStart().subscribe(taskId => {
        const progressDialog = this.dialog.open(ReportGenerationProgressDialogComponent, { disableClose: true });
        const findingIds = Object.keys(this.selectedRowsForReport).map(key => { return key; });
        progressDialog.componentInstance.taskId = taskId;
        progressDialog.componentInstance.downloadResponse = this.reportGeneratorService.getRepairReport(JSON.stringify(findingIds), taskId, this.type, this.id);
        progressDialog.componentInstance.onCloseEvent = () => {
          progressDialog.close();
        };
      });
    }
  }

  public attachReport() {
    const dialog = this.dialog.open(ReportAttachmentComponent);
    dialog.componentInstance.nodeId = this.id;
    dialog.componentInstance.nodeType = this.type;
    dialog.afterClosed().subscribe(result => {
      this.ngOnInit();
      this.reportDataTable.filterPage();
    });
  }

  public openCustomFilterDialog() {
    const dialog = this.dialog.open(FindingsCustomFilterComponent);
    this.customFilterChangeSubscription = this.findingsFilterManagerService.customFilterChange.subscribe(filter => {
      if (filter) {
        dialog.componentInstance.appliedFilter = filter;
      }
    });
    dialog.componentInstance.isCustomFilterApplied = this.isCustomFilterApplied;
    dialog.afterClosed().subscribe(result => {
      this.isCustomFilterApplied = result;
    });
  }

  ngOnDestroy() {
    this.customFilterChangeSubscription.unsubscribe();
  }

  public getCustomFilterIconColor(): string {
    if (this.isCustomFilterApplied) {
      return '#b91c1c';
    }
    return 'gray';
  }
}
