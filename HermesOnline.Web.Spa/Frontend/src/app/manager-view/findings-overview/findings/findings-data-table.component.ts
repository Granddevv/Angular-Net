// tslint:disable:max-line-length
// tslint:disable:radix

import { Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { IQuickFilter } from '../../../common/interface/quick-filter.interface';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { DataQualityComponent } from '../dialogs/data-quality/data-quality.component';
import { MdDialog } from '@angular/material';
import { TimeLinkComponent } from '../dialogs/time-link/time-link.component';
import { ViewLinkComponent } from '../dialogs/view-link/view-link.component';
import { EditFindingComponent } from '../dialogs/edit-finding/edit-finding.component';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { AlertDialogComponent } from '../../../shared/alert-dialog/alert-dialog.component';
import { LocationLinkComponent } from '../dialogs/location-link/location-link.component';
import { MdSnackBar } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { BladeOverviewItemFilter } from '../../../models/blade-overview-item/blade-overview-item-filter.model';
import { Tab } from '../../../models/manager-view/finding-overview/common/tab/tab';
import { FindingsQuickFilterListModel } from '../../../models/manager-view/finding-overview/common/findings/findings-quick-filter-list.model';
import { FindingsQuickFilterModel } from '../../../models/manager-view/finding-overview/common/findings/findings-quick-filter.model';
import { FindingsDataTableColumns } from '../../../models/manager-view/finding-overview/common/findings/findings-data-table.model';
import { FindingsDataTableFilterModel, FindingsDataTableConstants } from '../../../models/manager-view/finding-overview/common/findings/findings-data-table-filter.model';
import { FindingsTableRowModel, FindingForDataQuality } from '../../../models/manager-view/finding-overview/common/findings/findings-data-table-row.model';
import { DataQuality } from '../../../models/manager-view/finding-overview/common/findings/findings-data-quality';
import { FindingGroupType } from '../../../models/manager-view/common/model/finding-group-type';
import { NodeType } from '../../../models/manager-view/common/model/node-type';
import { SummaryViewItemFilter } from '../../../models/manager-view/summary-view/summary-view-item-filter.model';
import { QuickFilterListItemModel } from '../../../models/common/quick-filter-list-item.model';
import { Permissions } from '../../../models/common/permissions.enum';
import { FindingsFilterManagerService } from '../../../services/common-services/findings-filter-manager.service';
import { ColumnVisibilityService } from '../../../services/common-services/column-visibility.service';
import { PrincipalService } from '../../../services/common-services/principal.service';
import { FindingsDataTableService } from '../../../services/data-services/findings-data-table.service';
import { Tables } from '../../../models/manager-view/common/model/table-list';

@Component({
  selector: 'app-findings-data-table',
  templateUrl: './findings-data-table.component.html',
  styleUrls: ['./findings-data-table.component.scss', '../findings-overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FindingsDataTableComponent implements OnInit, IQuickFilter<FindingsQuickFilterListModel, FindingsQuickFilterModel>, OnDestroy {
  @Input()
  filter: FindingsDataTableFilterModel;

  public Permissions = Permissions;

  @ViewChild('table') table: DatatableComponent;

  @ViewChild('severityHeaderTemplate')
  severityHeaderTemplate: TemplateRef<any>;
  @ViewChild('categoryHeaderTemplate')
  categoryHeaderTemplate: TemplateRef<any>;
  @ViewChild('layerHeaderTemplate')
  layerHeaderTemplate: TemplateRef<any>;
  @ViewChild('rHeaderTemplate')
  rHeaderTemplate: TemplateRef<any>;
  @ViewChild('tHeaderTemplate')
  tHeaderTemplate: TemplateRef<any>;
  @ViewChild('lHeaderTemplate')
  lHeaderTemplate: TemplateRef<any>;
  @ViewChild('aHeaderTemplate')
  aHeaderTemplate: TemplateRef<any>;
  @ViewChild('siteHeaderTemplate')
  siteHeaderTemplate: TemplateRef<any>;
  @ViewChild('turbineHeaderTemplate')
  turbineHeaderTemplate: TemplateRef<any>;
  @ViewChild('bladeHeaderTemplate')
  bladeHeaderTemplate: TemplateRef<any>;
  @ViewChild('surfaceHeaderTemplate')
  surfaceHeaderTemplate: TemplateRef<any>;
  @ViewChild('inspectionDateHeaderTemplate')
  inspectionDateHeaderTemplate: TemplateRef<any>;
  @ViewChild('serialNumberHeaderTemplate')
  serialNumberHeaderTemplate: TemplateRef<any>;
  @ViewChild('actionsHeaderTemplate')
  actionsHeaderTemplate: TemplateRef<any>;
  @ViewChild('turbineTypeHeaderTemplate')
  turbineTypeHeaderTemplate: TemplateRef<any>;
  @ViewChild('platformHeaderTemplate')
  platformHeaderTemplate: TemplateRef<any>;
  @ViewChild('inspectionTypeHeaderTemplate')
  inspectionTypeHeaderTemplate: TemplateRef<any>;
  @ViewChild('inspectionCompanyeHeaderTemplate')
  inspectionCompanyeHeaderTemplate: TemplateRef<any>;
  @ViewChild('actionsTemplate')
  actionsTemplate: TemplateRef<any>;
  @ViewChild('dataQualityDateHeaderTemplate')
  dataQualityDateHeaderTemplate: TemplateRef<any>;
  @ViewChild('dataQualityTemplate')
  dataQualityTemplate: TemplateRef<any>;
  @ViewChild('selectionHeaderTemplate')
  selectionHeaderTemplate: TemplateRef<any>;
  @ViewChild('selectionTemplate')
  selectionTemplate: TemplateRef<any>;

  @Output()
  rowSelected = new EventEmitter();
  @Output()
  selectedRowForReportEmiter = new EventEmitter();
  @Output()
  totalRecordsNumber = new EventEmitter<number>();

  quickFiltersList = new FindingsQuickFilterListModel();
  appliedQuickFiltersColumnProps = {};
  columns = [];
  visibleColumns = [];
  dataRows: FindingsTableRowModel[] = [];
  selected = [];
  numOfSelected = 0;
  limitPerPage = FindingsDataTableConstants.dataTableSizePerPage;
  count = 0;
  offset = 0;
  dataQuality = DataQuality;
  selectAllRowsForReport = false;
  selectedRowsForReport: {};
  nodeId: string;
  nodeType: NodeType;
  FindingGroupType = FindingGroupType;
  loadingIndicator: boolean;
  quickFilterColumns = [
    { columnProp: 'severity', filterProp: 'severities' },
    { columnProp: 'category', filterProp: 'categories' },
    { columnProp: 'layer', filterProp: 'layers' },
    { columnProp: 'site', filterProp: 'siteIds' },
    { columnProp: 'blade', filterProp: 'bladeIds' },
    { columnProp: 'turbineName', filterProp: 'turbineIds' },
    { columnProp: 'turbineType', filterProp: 'turbineTypes' },
    { columnProp: 'platform', filterProp: 'platforms' },
    { columnProp: 'surface', filterProp: 'surfaces' },
    { columnProp: 'inspectionDate', filterProp: 'inspectionDates' },
    { columnProp: 'inspectionType', filterProp: 'inspectionTypes' },
    { columnProp: 'inspectionCompany', filterProp: 'inspectionCompanies' },
    { columnProp: 'dataQuality', filterProp: 'dataQualities' }];

  private columnVisibilityChangedSubscription: Subscription;
  private filterTableSubscription: Subscription;
  private initializeQuickFiltersSubscription: Subscription;

  constructor(
    private findingsDataTableService: FindingsDataTableService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private findingsFilterManagerService: FindingsFilterManagerService,
    private columnVisibilityService: ColumnVisibilityService,
    private principalService: PrincipalService,
    public dialog: MdDialog,
    public snackBar: MdSnackBar) {
  }

  ngOnDestroy() {
    this.columnVisibilityChangedSubscription.unsubscribe();
    this.filterTableSubscription.unsubscribe();
    this.initializeQuickFiltersSubscription.unsubscribe();
  }

  ngOnInit() {
    this.columnVisibilityChangedSubscription = this.columnVisibilityService.columnVisibilityChanged.subscribe((res) => {
      this.initializeColumns();
    });
    this.initializeColumns();

    this.activeRoute.params.subscribe(params => {
      if (+params['tabId'] === Tab.Findings) {
        this.nodeId = params['id'];
        this.nodeType = params['type'];
        const sortProperty = this.filter ? this.filter.sortProperty : null;
        const sortDirection = this.filter ? this.filter.sortDirection : null;

        this.filter = new FindingsDataTableFilterModel(this.nodeId, this.nodeType);
        this.filter.sortProperty = sortProperty;
        this.filter.sortDirection = sortDirection;
        this.selected = [];
        this.filterTable(true);
        this.limitPerPage = this.filter.pageSize;
        this.initializeQuickFilters();
      }
    });

    this.findingsFilterManagerService.summaryViewFilterChange.subscribe((filter: Array<SummaryViewItemFilter>) => {
      if (filter && this.filter) {
        this.filter.summaryViewFilter = filter;
        this.filter.quickFilters = null;
        this.filterTable();
        this.initializeQuickFilters();
      }
    });

    this.findingsFilterManagerService.turbineOverviewFilterChange.subscribe((filter: BladeOverviewItemFilter) => {
      this.filter.bladeOverViewItemFilter = filter;
      this.filter.quickFilters = null;
      this.filterTable();
      this.initializeQuickFilters();
    });

    this.findingsFilterManagerService.timeLineViewFilterChange.subscribe((filter: Array<string>) => {
      if (filter && this.filter) {
        this.filter.timeLineFilter = filter;
        this.filter.quickFilters = null;
        this.filterTable();
        this.initializeQuickFilters();
      }
    });

    this.findingsFilterManagerService.resetDataTableChange.subscribe(reset => {
      if (reset) {
        this.filter = new FindingsDataTableFilterModel(this.nodeId, this.nodeType);
        this.filterTable();
        this.initializeQuickFilters();
      }
    });

    this.findingsFilterManagerService.findingsGroupFilterChange.subscribe((findingId: string) => {
      if (this.filter) {
        this.filter.groupFilter = findingId;
        this.filter.quickFilters = null;
        this.filterTable();
        this.initializeQuickFilters();
      }
    });

    this.findingsFilterManagerService.customFilterChange.subscribe(customFilterId => {
      this.filter.quickFilters = null;
      this.filter.customFilterId = customFilterId;
      this.filterTable();
      this.initializeQuickFilters();
    });

    this.activeRoute.params.subscribe(() => {
      this.selectAllRowsForReport = false;
      this.selectedRowsForReport = {};
      this.selectedRowForReportEmiter.emit({});
    });

    this.findingsFilterManagerService.moveSelectedFindingChange.subscribe((moveUp: boolean) => {
      if (moveUp !== null) {
        if (this.selected.length === 0 || this.selected[0] === undefined) {// Nothing is selected
          this.selected[0] = this.dataRows[this.filter.pageIndex * this.filter.pageSize];
          const index = this.dataRows.findIndex(x => x && x.id === this.selected[0].id);
        } else {
          const index = this.dataRows.findIndex(x => x && x.id === this.selected[0].id);
          if (this.cannotMove(index, moveUp)) {
            return;
          }
          this.selected[0] = this.dataRows[moveUp ? index - 1 : index + 1];
        }

        this.onSelect({ selected: this.selected });
      }
    });
  }

  private cannotMove(index: number, moveUp: boolean) {
    const firstElem = this.filter.pageIndex * this.filter.pageSize;
    const lastElem = this.getLastElemOnPage();

    return moveUp && (index === firstElem) || !moveUp && (index === lastElem); // either we are one first elem and want to go 'up' or we are on last elem. and want to go 'down'
  }

  getLastElemOnPage() {
    let i = this.filter.pageIndex * this.filter.pageSize;
    for (i; i < this.dataRows.length; i++) {
      if (this.dataRows[i] === undefined) {
        break;
      }
    }

    return (i - 1);
  }

  onPage(event) {
    this.filter.pageSize = this.limitPerPage;
    this.filter.pageIndex = event.page - 1;
    this.selectAllRowsForReport = false;
    this.selected = [];
    this.filterTable();
  }

  pageSizeChange(pageSize) {
    this.filter.pageSize = pageSize;
    this.filter.pageIndex = this.offset = 0;
    this.selectAllRowsForReport = false;
    this.selected = [];
    this.filterTable();
  }

  filterTable(resetPage = false) {
    this.loadingIndicator = true;
    this.rowSelected.emit(undefined);
    if (resetPage) {
      this.filter.pageIndex = 0;
      this.table.offset = 0;
    }
    this.filterTableSubscription = this.findingsDataTableService.filterFindingsTable(this.filter)
      .subscribe(data => {
        if (this.table && this.table.offset > 0 && data.findingsTableRows.length > 0 && this.isOneElementLeftOnLastPage(data.totalRecords)) {
          this.offset--;
          this.table.offset--;
        }
        this.dataRows = data.findingsTableRows;
        this.count = data.totalRecords;
        setTimeout(() => { this.loadingIndicator = false; }, 1500);
        this.totalRecordsNumber.emit(this.count);
        this.selectPrevRowsForReport();
      });
  }

  selectPrevRowsForReport() {
    this.dataRows.forEach(row => {
      if (row) {
        row.selected = this.selectedRowsForReport[row.id];
      }
    });

    this.selectAllRowsForReport = false;
  }

  selectAllRowsForReportChange() {
    this.dataRows.forEach(elem => {
      if (elem) {
        elem.selected = this.selectAllRowsForReport;
        if (this.selectAllRowsForReport) {
          this.selectedRowsForReport[elem.id] = true;
        } else {
          delete this.selectedRowsForReport[elem.id];
        }
      }
    });
    this.setNumberOfSelectedRows();
    this.selectedRowForReportEmiter.emit(this.selectedRowsForReport);
  }

  private setNumberOfSelectedRows() {
    this.numOfSelected = 0;
    for (let prop in this.selectedRowsForReport) {
      if (this.selectedRowsForReport.hasOwnProperty(prop)) {
        if (prop) {
          this.numOfSelected++;
        } else {
          this.numOfSelected--;
        }
      }
    }
  }

  selectedChanged(row) {
    if (row.selected) {
      this.selectedRowsForReport[row.id] = true;
    } else {
      this.selectAllRowsForReport = false;
      delete this.selectedRowsForReport[row.id];
    }
    this.setNumberOfSelectedRows();
    this.selectedRowForReportEmiter.emit(this.selectedRowsForReport);
  }

  isOneElementLeftOnLastPage(totalRecordsCount: number): boolean {
    return (this.filter.pageIndex * this.filter.pageSize) === totalRecordsCount;
  }

  initializeQuickFilters() {
    this.initializeQuickFiltersSubscription = this.findingsDataTableService.getQuickFilters(this.filter.type, this.filter.id, null, this.filter.summaryViewFilter, this.filter.timeLineFilter, this.filter.bladeOverViewItemFilter, this.filter.customFilterId)
      .subscribe(data => {
        this.quickFiltersList = data;
        this.initializeQuickFiltersForTableFilterModel();
      });
  }

  onSelect({ selected }) {
    this.rowSelected.emit(selected[0].id);
    this.router.navigate(['/managerview',
      {
        outlets: {
          'filter': ['finding', selected[0].id],
          'findings': ['tab', Tab.Findings, 'type', this.filter.type, 'id', this.filter.id]
        }
      }]);
  }

  onSort(event) {
    this.filter.sortProperty = event.sorts[0].prop;
    this.filter.sortDirection = event.sorts[0].dir === 'asc' ? 0 : 1;
    this.filterTable();
  }

  quickFilterSubmitted(columnProp: string, quickFilterList: QuickFilterListItemModel[]) {
    // Track against which column filter is applied
    if (quickFilterList.length > quickFilterList.filter(x => x.isChecked).length) {
      this.appliedQuickFiltersColumnProps[columnProp] = true;
    } else if (quickFilterList.length === quickFilterList.filter(x => x.isChecked).length) {
      delete this.appliedQuickFiltersColumnProps[columnProp];
    }

    // Update quick filters list of already applied (touched) quick filters
    this.initializeQuickFiltersForTableFilterModel(columnProp);
    for (const key in this.appliedQuickFiltersColumnProps) {
      if (this.appliedQuickFiltersColumnProps.hasOwnProperty(key)) {
        const checkedQuickFilters = this.getCheckedQuickFiltersModel(key);
        this.findingsDataTableService.getQuickFilters(this.filter.type, this.filter.id, checkedQuickFilters, null, this.filter.timeLineFilter, this.filter.bladeOverViewItemFilter)
          .subscribe(data => {
            this.updateQuickFilterListOfAppliedFilters(data, key);
          });
      }
    }

    // Update quick filters list of non applied (non touched) quick filters
    const checkedQuickFiltersModel = this.getCheckedQuickFiltersModel();
    this.findingsDataTableService.getQuickFilters(this.filter.type, this.filter.id, checkedQuickFiltersModel, null, this.filter.timeLineFilter, this.filter.bladeOverViewItemFilter)
      .subscribe(data => {
        this.updateQuickFilterListOfNonAppliedFilters(data);
        this.initializeQuickFiltersForTableFilterModel();
        this.filterTable(true);
        this.findingsFilterManagerService.applyQuickFilter(this.filter);
      });
  }

  updateQuickFilterListOfNonAppliedFilters(data: FindingsQuickFilterListModel): void {
    this.quickFilterColumns.forEach(qfColumn => {
      if (!this.appliedQuickFiltersColumnProps.hasOwnProperty(qfColumn.columnProp)) {
        const tmp = new Array<QuickFilterListItemModel>();
        data[qfColumn.columnProp].forEach(x => {
          const existingItem = this.quickFiltersList[qfColumn.columnProp].filter(y => y.display === x.display);
          if (existingItem.length > 0) {
            tmp.push(existingItem[0]);
          } else {
            tmp.push(new QuickFilterListItemModel(x.isChecked, x.value, x.display));
          }
        });
        this.quickFiltersList[qfColumn.columnProp] = tmp;
      }
    });
  }

  updateQuickFilterListOfAppliedFilters(data: FindingsQuickFilterListModel, columnProp: string): void {
    this.quickFilterColumns.forEach(qfColumn => {
      if (columnProp === qfColumn.columnProp) {
        const tmp = new Array<QuickFilterListItemModel>();
        data[qfColumn.columnProp].forEach(x => {
          const existingItem = this.quickFiltersList[qfColumn.columnProp].filter(y => y.display === x.display);
          if (existingItem.length > 0) {
            tmp.push(existingItem[0]);
          } else {
            tmp.push(new QuickFilterListItemModel(false, x.value, x.display));
          }
        });
        this.quickFiltersList[qfColumn.columnProp] = tmp;
        return;
      }
    });
  }

  initializeQuickFiltersForTableFilterModel(columnProp?: string): void {
    if (this.filter.quickFilters == null) {
      this.filter.quickFilters = new FindingsQuickFilterModel();
    }

    this.quickFilterColumns.forEach(qfColumn => {
      if (columnProp === undefined || columnProp === qfColumn.columnProp) {
        this.filter.quickFilters[qfColumn.filterProp] = this.quickFiltersList[qfColumn.columnProp]
          .filter(x => x.isChecked)
          .map(x => x.value);
        if (columnProp !== undefined) {
          return;
        }
      }
    });
  }

  getCheckedQuickFiltersModel(excludeQuickFilterColumnProp?: string): FindingsQuickFilterModel {
    const quickFilterModel = new FindingsQuickFilterModel();

    this.quickFilterColumns.forEach(qfColumn => {
      if (this.appliedQuickFiltersColumnProps.hasOwnProperty(qfColumn.columnProp) && excludeQuickFilterColumnProp !== qfColumn.columnProp) {
        quickFilterModel[qfColumn.filterProp] = this.filter.quickFilters[qfColumn.filterProp];
      } else {
        quickFilterModel[qfColumn.filterProp] = null;
      }
    });

    return quickFilterModel;
  }

  private initializeColumns() {
    this.visibleColumns = this.columnVisibilityService.getVisibleColumns(Tables.Findings);
    const allColumns = [
      { name: FindingsDataTableColumns.DataQuality.name, headerTemplate: this.dataQualityDateHeaderTemplate, cellTemplate: this.dataQualityTemplate, prop: 'dataQuality', sortable: true, width: 150, resizeable: false },
      { name: FindingsDataTableColumns.SerialNumber.name, headerTemplate: this.serialNumberHeaderTemplate, prop: 'serialNumber', sortable: true, width: 200, resizeable: false },
      { name: FindingsDataTableColumns.Severity.name, headerTemplate: this.severityHeaderTemplate, prop: 'severity', sortable: true, resizeable: false },
      { name: FindingsDataTableColumns.Category.name, headerTemplate: this.categoryHeaderTemplate, prop: 'type', sortable: true, width: 210, resizeable: false },
      { name: FindingsDataTableColumns.Layer.name, headerTemplate: this.layerHeaderTemplate, prop: 'layer', sortable: true, resizeable: false },
      { name: FindingsDataTableColumns.Surface.name, headerTemplate: this.surfaceHeaderTemplate, prop: 'surface', sortable: true, resizeable: false },
      { name: FindingsDataTableColumns.R.name, headerTemplate: this.rHeaderTemplate, prop: 'distanceToRoot', sortable: true, resizeable: false },
      { name: FindingsDataTableColumns.T.name, headerTemplate: this.tHeaderTemplate, prop: 'distanceToTip', sortable: true, resizeable: false },
      { name: FindingsDataTableColumns.L.name, headerTemplate: this.lHeaderTemplate, prop: 'lengthMm', sortable: true, resizeable: false },
      { name: FindingsDataTableColumns.A.name, headerTemplate: this.aHeaderTemplate, prop: 'areaMm2', sortable: true, resizeable: false },
      { name: FindingsDataTableColumns.Site.name, headerTemplate: this.siteHeaderTemplate, prop: 'site', sortable: true, resizeable: false },
      { name: FindingsDataTableColumns.Turbine.name, headerTemplate: this.turbineHeaderTemplate, prop: 'turbineName', sortable: true, resizeable: false },
      { name: FindingsDataTableColumns.TurbineType.name, headerTemplate: this.turbineTypeHeaderTemplate, prop: 'turbineType', sortable: true, resizeable: false },
      { name: FindingsDataTableColumns.Platform.name, headerTemplate: this.platformHeaderTemplate, prop: 'platform', sortable: true, resizeable: false },
      { name: FindingsDataTableColumns.Blade.name, headerTemplate: this.bladeHeaderTemplate, prop: 'blade', sortable: true, resizeable: false },
      { name: FindingsDataTableColumns.InspectionDate.name, headerTemplate: this.inspectionDateHeaderTemplate, prop: 'inspectionDate', sortable: true, width: 200, resizeable: false },
      { name: FindingsDataTableColumns.InspectionType.name, headerTemplate: this.inspectionTypeHeaderTemplate, prop: 'inspectionType', sortable: true, width: 200, resizeable: false },
      { name: FindingsDataTableColumns.InspectionCompany.name, headerTemplate: this.inspectionCompanyeHeaderTemplate, prop: 'inspectionCompany', sortable: true, width: 200, resizeable: false },
      { name: FindingsDataTableColumns.Selection.name, headerTemplate: this.selectionHeaderTemplate, cellTemplate: this.selectionTemplate, prop: 'selection', sortable: false, resizeable: false }
    ];

    if (this.principalService.hasAnyPermissions(FindingsDataTableColumns.Actions.permissions)) {
      const actionColumn = { name: FindingsDataTableColumns.Actions.name, headerTemplate: this.actionsHeaderTemplate, cellTemplate: this.actionsTemplate, prop: 'action', sortable: true, resizeable: false };
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

  changeDataQuality(row, event: Event) {
    const dialog = this.dialog.open(DataQualityComponent);
    this.closeActionsDropdown(event);
    dialog.componentInstance.findings = new FindingForDataQuality(row['id'], row['dataQuality'], row['site'], row['severity'], row['type'], row['layer']);
    dialog.componentInstance.selectedRowsForValidation = this.selectedRowsForReport;
    dialog.componentInstance.isValidateFromImagePreview = false;
    dialog.afterClosed().subscribe(() => {
      const changed = dialog.componentInstance.findingChangedQoulity;
      if (changed == null) {
        this.resetTable();
      } else {
        changed.forEach(element => {
          this.dataRows.forEach(y => {
            if (y.id === element.id) {
              y.dataQuality = element.updatedQuality;
            };
          });
        });
      }
    });
  }

  action(findingGroupType: FindingGroupType, row, event: Event) {
    let dialog;
    switch (findingGroupType) {
      case FindingGroupType.TimeLink:
        dialog = this.dialog.open(TimeLinkComponent);
        dialog.componentInstance.findingId = row['id'];
        dialog.componentInstance.nodeId = this.nodeId;
        dialog.componentInstance.nodeType = this.nodeType;
        dialog.afterClosed().subscribe(() => this.filterTable());
        break;
      case FindingGroupType.ViewLink:
        dialog = this.dialog.open(ViewLinkComponent);
        dialog.componentInstance.findingId = row['id'];
        dialog.componentInstance.nodeId = this.nodeId;
        dialog.componentInstance.nodeType = this.nodeType;
        dialog.afterClosed().subscribe(() => this.filterTable());
        break;
      case FindingGroupType.LocationLink:
        dialog = this.dialog.open(LocationLinkComponent);
        dialog.componentInstance.findingId = row['id'];
        dialog.componentInstance.nodeId = this.nodeId;
        dialog.componentInstance.nodeType = this.nodeType;
        dialog.afterClosed().subscribe(() => this.filterTable());
        break;
      default:
        console.log('No action selected.');
    }
    event.stopImmediatePropagation();
    this.closeActionsDropdown(event);
  }

  private closeActionsDropdown(event: Event) {
    $(event.currentTarget).parents('#action-dropdown-menu').children('#single-button').click();
  }

  resetTable() {
    this.filter = new FindingsDataTableFilterModel(this.nodeId, this.nodeType);
    this.selected = [];
    this.filterTable(true);
    this.initializeQuickFilters();
  }
}
