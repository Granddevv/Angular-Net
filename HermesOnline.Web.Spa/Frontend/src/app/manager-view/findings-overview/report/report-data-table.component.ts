// tslint:disable:max-line-length

import { Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { MdDialogRef, MdDialog } from '@angular/material';
import { DownloadHelper } from '../../../common/helpers/download.helper';
import { MdSnackBar } from '@angular/material';
import { Tab } from '../../../models/manager-view/finding-overview/common/tab/tab';
import { ReportDataTableColumns } from '../../../models/manager-view/finding-overview/common/report/report-data-table.model';
import { ReportTableFilterModel, ReportTableConstants } from '../../../models/manager-view/finding-overview/common/report/report-data-table-filter.model';
import { ReportDataTableRowModel } from '../../../models/manager-view/finding-overview/common/report/report-data-table-row.model';
import { Permissions } from '../../../models/common/permissions.enum';
import { ColumnVisibilityService } from '../../../services/common-services/column-visibility.service';
import { PrincipalService } from '../../../services/common-services/principal.service';
import { ReportService } from '../../../services/data-services/report.service';
import { Tables } from '../../../models/manager-view/common/model/table-list';

@Component({
  selector: 'app-reports',
  templateUrl: './report-data-table.component.html',
  styleUrls: ['./report-data-table.component.scss', '../findings-overview.component.scss'],
  providers: [ReportService],
  encapsulation: ViewEncapsulation.None
})
export class ReportDataTableComponent implements OnInit {
  public Permissions = Permissions;

  @Input()
  filter: ReportTableFilterModel;

  @Output()
  filterChanged = new EventEmitter();

  @Output()
  totalRecordsNumber = new EventEmitter<number>();

  columns = [];
  visibleColumns = [];
  dataRows: ReportDataTableRowModel[] = [];
  selected = [];
  limitPerPage = ReportTableConstants.dataTableSizePerPage;
  count = 0;
  offset = 0;

  @ViewChild('actionsTemplate')
  actionsTemplate: TemplateRef<any>;
  @ViewChild('nameTemplate')
  nameTemplate: TemplateRef<any>;
  @ViewChild('nameHeaderTemplate')
  nameHeaderTemplate: TemplateRef<any>;
  @ViewChild('dateHeaderTemplate')
  dateHeaderTemplate: TemplateRef<any>;
  @ViewChild('sizeHeaderTemplate')
  sizeHeaderTemplate: TemplateRef<any>;
  @ViewChild('siteHeaderTemplate')
  siteHeaderTemplate: TemplateRef<any>;
  @ViewChild('turbineHeaderTemplate')
  turbineHeaderTemplate: TemplateRef<any>;
  @ViewChild('bladeHeaderTemplate')
  bladeHeaderTemplate: TemplateRef<any>;
  @ViewChild('actionHeaderTemplate')
  actionHeaderTemplate: TemplateRef<any>;
  loadingIndicator: boolean;

  constructor(private reportService: ReportService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    public dialog: MdDialog,
    private columnVisibilityService: ColumnVisibilityService,
    private principalService: PrincipalService,
    public snackBar: MdSnackBar) {
  }

  ngOnInit() {
    this.columnVisibilityService.columnVisibilityChanged.subscribe((res) => this.initializeColumns());
    this.initializeColumns();
    this.activeRoute.params.subscribe(params => {
      if (+params['tabId'] === Tab.Reports) {
        this.filter = new ReportTableFilterModel(params['id'], params['type']);
        this.filterPage();
      }
    });
  }

  onPage(event) {
    this.filter.pageSize = event.pageSize;
    this.filter.pageIndex = event.offset;
    this.offset = event.offset;
    this.filterPage();

  }

  filterPage() {
    this.loadingIndicator = true;
    this.reportService.filterTable(this.filter)
      .subscribe(
      data => {
        this.dataRows = data.reportTableRows;
        this.count = data.totalRecords;
        this.totalRecordsNumber.emit(this.count);
        setTimeout(() => { this.loadingIndicator = false; }, 1500);
      }
      );
  }

  delete(row) {
    let confirmDialog = this.dialog.open(ConfirmationDialogComponent);
    confirmDialog.componentInstance.title = 'Are you sure you want to delete report?';
    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.reportService.deleteReport(row['id']).subscribe(() => {
          this.filterPage();
          const message = 'Report has been successfully deleted.';
          this.snackBar.open(message, '', { duration: 2000 });
        }
        );
      }
    });
  }

  private initializeColumns() {
    this.visibleColumns = this.columnVisibilityService.getVisibleColumns(Tables.Reports);
    const allColumns = [
      { name: ReportDataTableColumns.Name.name, headerTemplate: this.nameHeaderTemplate, cellTemplate: this.nameTemplate, prop: 'fileName', sortable: true, resizeable: false },
      { name: ReportDataTableColumns.Site.name, headerTemplate: this.siteHeaderTemplate, prop: 'siteName', sortable: false, resizeable: false },
      { name: ReportDataTableColumns.Turbine.name, headerTemplate: this.turbineHeaderTemplate, prop: 'turbineName', sortable: false, resizeable: false },
      { name: ReportDataTableColumns.Blade.name, headerTemplate: this.bladeHeaderTemplate, prop: 'bladeName', sortable: false, resizeable: false },
      { name: ReportDataTableColumns.QueueDate.name, headerTemplate: this.dateHeaderTemplate, prop: 'queueDate', sortable: true, resizeable: false },
      { name: ReportDataTableColumns.Size.name, headerTemplate: this.sizeHeaderTemplate, prop: 'size', sortable: true, resizeable: false }
    ];

    if (this.principalService.hasAnyPermissions(ReportDataTableColumns.Actions.permissions)) {
      const actionColumn = { name: ReportDataTableColumns.Actions.name, headerTemplate: this.actionHeaderTemplate, cellTemplate: this.actionsTemplate, prop: 'action', sortable: true, resizeable: false };
      allColumns.push(actionColumn);
    }

    this.removeNotVisibleColumns(allColumns);
  }

  private removeNotVisibleColumns(allColumns: any[]) {
    this.columns = [];
    allColumns.forEach(column => {
      const visibleColumn = this.visibleColumns.find(el => {
        return el['name'] === column['name'];
      });
      if (visibleColumn && visibleColumn['checked']) {
        this.columns.push(column);
      }
    });
  }

  onSort(event) {
    this.filter.sortProperty = event.sorts[0].prop;
    this.filter.sortDirection = event.sorts[0].dir === 'asc' ? 0 : 1;
    this.filterPage();
  }

  download(row) {
    const response = this.reportService.downloadAttachment(row['id']);
    DownloadHelper.downloadFileFromResponse(response);
  }
}


