// tslint:disable:max-line-length
import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation, Input } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable/release';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AlertDialogComponent } from '../../../../shared/alert-dialog/alert-dialog.component';
import { FindingsQuickFilterListModel } from '../../../../models/manager-view/finding-overview/common/findings/findings-quick-filter-list.model';
import { FindingsQuickFilterModel } from '../../../../models/manager-view/finding-overview/common/findings/findings-quick-filter.model';
import { FindingsDataTableColumns } from '../../../../models/manager-view/finding-overview/common/findings/findings-data-table.model';
import { FindingsActionsDataTableFilterModel } from '../../../../models/manager-view/finding-overview/common/findings/findings-data-table-filter.model';
import { FindingsTableRowModel } from '../../../../models/manager-view/finding-overview/common/findings/findings-data-table-row.model';
import { FindingGroupType } from '../../../../models/manager-view/common/model/finding-group-type';
import { NodeType } from '../../../../models/manager-view/common/model/node-type';
import { QuickFilterListItemModel } from '../../../../models/common/quick-filter-list-item.model';
import { DefectGroupActionsService } from '../../../../services/data-services/defect-group-actions.service';

@Component({
  selector: 'app-timelink',
  templateUrl: './time-link.component.html',
  styleUrls: ['./time-link.component.scss'],
  providers: [DefectGroupActionsService],
  encapsulation: ViewEncapsulation.None
})
export class TimeLinkComponent implements OnInit {
  public findingId: string;
  public nodeId: string;
  public nodeType: NodeType;

  @Input()
  filter: FindingsActionsDataTableFilterModel;

  @ViewChild('serialNumberHeaderTemplate')
  serialNumberHeaderTemplate: TemplateRef<any>;
  @ViewChild('categoryHeaderTemplate')
  categoryHeaderTemplate: TemplateRef<any>;
  @ViewChild('severityHeaderTemplate')
  severityHeaderTemplate: TemplateRef<any>;
  @ViewChild('layerHeaderTemplate')
  layerHeaderTemplate: TemplateRef<any>;
  @ViewChild('surfaceHeaderTemplate')
  surfaceHeaderTemplate: TemplateRef<any>;
  @ViewChild('rHeaderTemplate')
  rHeaderTemplate: TemplateRef<any>;
  @ViewChild('lHeaderTemplate')
  lHeaderTemplate: TemplateRef<any>;
  @ViewChild('aHeaderTemplate')
  aHeaderTemplate: TemplateRef<any>;
  @ViewChild('table') table: DatatableComponent;

  quickFiltersList = new FindingsQuickFilterListModel();

  columns = [];
  filterColumns = [
    { name: 'blade', value: 'bladeIds' },
    { name: 'category', value: 'categories' },
    { name: 'inspectionDate', value: 'inspectionDates' },
    { name: 'inspectionCompany', value: 'inspectionCompanies' },
    { name: 'inspectionType', value: 'inspectionTypes' },
    { name: 'turbineType', value: 'turbineTypes' },
    { name: 'platform', value: 'platforms' },
    { name: 'layer', value: 'layers' },
    { name: 'severity', value: 'severities' },
    { name: 'site', value: 'siteIds' },
    { name: 'surface', value: 'surfaces' },
    { name: 'turbine', value: 'turbineIds' },
    { name: 'dataQuality', value: 'dataQualities' }];

  dataRows: FindingsTableRowModel[] = [];
  selected = [];
  limitPerPage = 10;
  count = 0;
  offset = 0;
  appliedQuickFiltersColumnNames = {};

  constructor(
    private defectGroupActionsService: DefectGroupActionsService,
    private dialog: MdDialog,
    public dialogRef: MdDialogRef<TimeLinkComponent>) { }

  ngOnInit() {
    this.filter = new FindingsActionsDataTableFilterModel(this.findingId, this.nodeId, this.nodeType, FindingGroupType.TimeLink);
    this.filter.pageSize = 10;
    this.initColumns();
    this.filterTable();
    this.initializeQuickFilters();
  }

  initColumns() {
    this.columns = [
      { name: FindingsDataTableColumns.SerialNumber.name, headerTemplate: this.serialNumberHeaderTemplate, prop: 'serialNumber', sortable: true, maxWidth: 200 },
      { name: FindingsDataTableColumns.Severity.name, headerTemplate: this.severityHeaderTemplate, prop: 'severity', sortable: true, maxWidth: 100 },
      { name: FindingsDataTableColumns.Category.name, headerTemplate: this.categoryHeaderTemplate, prop: 'type', sortable: true, maxWidth: 210 },
      { name: FindingsDataTableColumns.Layer.name, headerTemplate: this.layerHeaderTemplate, prop: 'layer', sortable: true, maxWidth: 100 },
      { name: FindingsDataTableColumns.Surface.name, headerTemplate: this.surfaceHeaderTemplate, prop: 'surface', sortable: true, maxWidth: 130 },
      { name: FindingsDataTableColumns.R.name, headerTemplate: this.rHeaderTemplate, prop: 'distanceToRoot', sortable: true, maxWidth: 100 },
      { name: FindingsDataTableColumns.L.name, headerTemplate: this.lHeaderTemplate, prop: 'lengthMm', sortable: true, maxWidth: 100 },
      { name: FindingsDataTableColumns.A.name, headerTemplate: this.aHeaderTemplate, prop: 'areaMm2', sortable: true, maxWidth: 100 },
    ];
  }

  filterTable() {
    this.defectGroupActionsService.filterTimeAndViewLinkTable(this.filter)
      .subscribe(data => {
        if (this.table && this.table.offset > 0 && data.findingsTableRows.length > 0 && this.isOneElementLeftOnLastPage(data.totalRecords)) {
          this.offset--;
          this.table.offset--;
        }

        this.dataRows = data.findingsTableRows;
        this.count = data.totalRecords;
      });
  }

  isOneElementLeftOnLastPage(totalRecordsCount: number): boolean {
    return (this.filter.pageIndex * this.filter.pageSize) === totalRecordsCount;
  }

  initializeQuickFilters() {
    this.defectGroupActionsService.getQuickFiltersForTimeAndViewLink(this.findingId, this.filter.type, this.filter.id, null, null, FindingGroupType.TimeLink)
      .subscribe(data => {
        this.quickFiltersList = data;
        this.initializeQuickFiltersForTableFilterModel();
      });
  }

  quickFilterSubmitted(columnName: string, quickFilterList: QuickFilterListItemModel[]) {
    // Track against which column filter is applied
    if (quickFilterList.length > quickFilterList.filter(x => x.isChecked).length) {
      this.appliedQuickFiltersColumnNames[columnName] = true;
    } else if (quickFilterList.length === quickFilterList.filter(x => x.isChecked).length) {
      delete this.appliedQuickFiltersColumnNames[columnName];
    }

    // Update quick filters list of already applied (touched) quick filters
    this.initializeQuickFiltersForTableFilterModel(columnName);
    for (const key in this.appliedQuickFiltersColumnNames) {
      if (this.appliedQuickFiltersColumnNames.hasOwnProperty(key)) {
        const checkedQuickFilters = this.getCheckedQuickFiltersModel(key);
        this.defectGroupActionsService.getQuickFiltersForTimeAndViewLink(this.findingId, this.filter.type, this.filter.id, checkedQuickFilters, null, FindingGroupType.TimeLink)
          .subscribe(data => {
            this.updateQuickFilterListOfAppliedFilters(data, key);
          });
      }
    }

    // Update quick filters list of non applied (non touched) qucik filters
    const checkedQuickFiltersModel = this.getCheckedQuickFiltersModel();
    this.defectGroupActionsService.getQuickFiltersForTimeAndViewLink(this.findingId, this.filter.type, this.filter.id, checkedQuickFiltersModel, null, FindingGroupType.TimeLink)
      .subscribe(data => {
        this.updateQuickFilterListOfNonAppliedFilters(data);
        this.initializeQuickFiltersForTableFilterModel();
        this.filterTable();
      });
  }

  // TODO It would be nice to have this refactored into something which is reusable
  updateQuickFilterListOfNonAppliedFilters(data: FindingsQuickFilterListModel): void {
    this.filterColumns.forEach(filter => {
      if (!this.appliedQuickFiltersColumnNames.hasOwnProperty(filter.name)) {
        const tmp = new Array<QuickFilterListItemModel>();
        data[filter.name].forEach(x => {
          const existingItem = this.quickFiltersList[filter.name].filter(y => y.display === x.display);
          if (existingItem.length > 0) {
            tmp.push(existingItem[0]);
          } else {
            tmp.push(new QuickFilterListItemModel(x.isChecked, x.value, x.display));
          }
        });
        this.quickFiltersList[filter.name] = tmp;
      }
    });
  }

  updateQuickFilterListOfAppliedFilters(data: FindingsQuickFilterListModel, columnName: string): void {
    this.filterColumns.forEach(filter => {
      if (columnName === filter.name) {
        const tmp = new Array<QuickFilterListItemModel>();
        data[filter.name].forEach(x => {
          const existingItem = this.quickFiltersList[filter.name].filter(y => y.display === x.display);
          if (existingItem.length > 0) {
            tmp.push(existingItem[0]);
          } else {
            tmp.push(new QuickFilterListItemModel(false, x.value, x.display));
          }
        });
        this.quickFiltersList[filter.name] = tmp;
        return;
      }
    });
  }

  getCheckedQuickFiltersModel(excludeQuickFilterColumnName?: string): FindingsQuickFilterModel {
    const quickFilterModel = new FindingsQuickFilterModel();
    this.filterColumns.forEach(filter => {
      if (this.appliedQuickFiltersColumnNames.hasOwnProperty(filter.name) && excludeQuickFilterColumnName !== filter.name) {
        quickFilterModel[filter.value] = this.filter.quickFilters[filter.value]
      } else {
        quickFilterModel[filter.value] = null;
      }
    });

    return quickFilterModel;
  }

  initializeQuickFiltersForTableFilterModel(columnName?: string): void {
    if (this.filter.quickFilters == null) {
      this.filter.quickFilters = new FindingsQuickFilterModel();
    }

    this.filterColumns.forEach(filter => {
      if (columnName === undefined || columnName === filter.name) {
        this.filter.quickFilters[filter.value] = this.quickFiltersList[filter.name]
          .filter(x => x.isChecked)
          .map(x => x.value);
        if (columnName !== undefined) {
          return;
        }
      }
    });
  }

  onSort(event) {
    this.filter.sortProperty = event.sorts[0].prop;
    this.filter.sortDirection = event.sorts[0].dir === 'asc' ? 0 : 1;
    this.filterTable();
  }

  onPage(event) {
    this.filter.pageSize = event.pageSize;
    this.filter.pageIndex = event.offset;
    this.offset = event.offset;
    this.filterTable();
  }

  link() {
    this.defectGroupActionsService.link(this.findingId, this.selected[0].id, FindingGroupType.TimeLink).subscribe(() => {
      var dialog = this.dialog.open(AlertDialogComponent);
      dialog.componentInstance.title = 'You have successfully linked two findings.';
      this.dialogRef.close();
    });
  }
}
