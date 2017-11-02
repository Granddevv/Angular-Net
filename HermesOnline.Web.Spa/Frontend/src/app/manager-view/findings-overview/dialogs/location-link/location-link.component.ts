// tslint:disable:max-line-length
import { Component, OnInit, ViewEncapsulation, TemplateRef, ViewChild, Input } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AlertDialogComponent } from '../../../../shared/alert-dialog/alert-dialog.component';
import { LocationLinkDataTableFilterModel, LocationLinkQuickFilterListModel, LocationLinkQuickFilterModel, LocationLinkTableRowModel } from '../../../../models/manager-view/finding-overview/location-link/location-link.model';
import { FindingGroupType } from '../../../../models/manager-view/common/model/finding-group-type';
import { NodeType } from '../../../../models/manager-view/common/model/node-type';
import { QuickFilterListItemModel } from '../../../../models/common/quick-filter-list-item.model';
import { DefectGroupActionsService } from '../../../../services/data-services/defect-group-actions.service';

@Component({
  selector: 'app-location-link',
  templateUrl: './location-link.component.html',
  styleUrls: ['./location-link.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DefectGroupActionsService]
})
export class LocationLinkComponent implements OnInit {
  public findingId: string;
  public nodeId: string;
  public nodeType: NodeType;

  @Input()
  filter: LocationLinkDataTableFilterModel;

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

  quickFiltersList = new LocationLinkQuickFilterListModel();

  columns = [];
  filterColumns = [
    { name: 'category', value: 'categories' },
    { name: 'layer', value: 'layers' },
    { name: 'severity', value: 'severities' },
    { name: 'surface', value: 'surfaces' }
  ];

  dataRows: LocationLinkTableRowModel[] = [];
  selected = [];
  limitPerPage = 10;
  count = 0;
  offset = 0;
  appliedQuickFiltersColumnNames = {};
  loadingIndicator: boolean;

  constructor(private locationLinkService: DefectGroupActionsService, private dialog: MdDialog, public dialogRef: MdDialogRef<LocationLinkComponent>) { }

  ngOnInit() {
    this.filter = new LocationLinkDataTableFilterModel(this.findingId, this.nodeId, this.nodeType);
    this.filter.pageSize = 10;
    this.initColumns();
    this.filterTable();
    this.initializeQuickFilters();
  }

  initColumns() {
    this.columns = [
      { name: 'Serial Number', headerTemplate: this.serialNumberHeaderTemplate, prop: 'serialNumber', sortable: true, maxWidth: 150 },
      { name: 'Severity', headerTemplate: this.severityHeaderTemplate, prop: 'severity', sortable: true, maxWidth: 100 },
      { name: 'Category', headerTemplate: this.categoryHeaderTemplate, prop: 'type', sortable: true, maxWidth: 130 },
      { name: 'Layer', headerTemplate: this.layerHeaderTemplate, prop: 'layer', sortable: true, maxWidth: 130 },
      { name: 'Surface', headerTemplate: this.surfaceHeaderTemplate, prop: 'surface', sortable: true, maxWidth: 130 },
      { name: 'R [m]', headerTemplate: this.rHeaderTemplate, prop: 'distanceToRoot', sortable: true, maxWidth: 100 },
      { name: 'L [mm]', headerTemplate: this.lHeaderTemplate, prop: 'lengthMm', sortable: true, maxWidth: 100 },
      { name: 'A [mm²]', headerTemplate: this.aHeaderTemplate, prop: 'areaMm2', sortable: true, maxWidth: 100 },
    ];
  }

  filterTable(resetPage = false) {
    this.loadingIndicator = true;
    if (resetPage) {
      this.filter.pageIndex = 0;
      this.table.offset = 0;
    }
    this.locationLinkService.filterLocationLinkTable(this.filter)
      .subscribe(data => {
        if (this.table && this.table.offset > 0 && data.findingsTableRows.length > 0 && this.isOneElementLeftOnLastPage(data.totalRecords)) {
          this.offset--;
          this.table.offset--;
        }

        this.dataRows = data.findingsTableRows;
        this.count = data.totalRecords;
        setTimeout(() => { this.loadingIndicator = false; }, 1500);
      });
  }

  isOneElementLeftOnLastPage(totalRecordsCount: number): boolean {
    return (this.filter.pageIndex * this.filter.pageSize) === totalRecordsCount;
  }

  initializeQuickFilters() {
    this.locationLinkService.getLocationLinkQuickFilters(this.findingId, this.nodeType, this.nodeId, )
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
        this.locationLinkService.getLocationLinkQuickFilters(this.findingId, this.nodeType, this.nodeId)
          .subscribe(data => {
            this.updateQuickFilterListOfAppliedFilters(data, key);
            this.filterTable(true);
          });
      }
    }

    // Update quick filters list of non applied (non touched) qucik filters
    const checkedQuickFiltersModel = this.getCheckedQuickFiltersModel();
    this.locationLinkService.getLocationLinkQuickFilters(this.findingId, this.nodeType, this.nodeId, checkedQuickFiltersModel)
      .subscribe(data => {
        this.updateQuickFilterListOfNonAppliedFilters(data);
        this.initializeQuickFiltersForTableFilterModel();
        this.filterTable();
      });
  }

  // TODO It would be nice to have this refactored into something which is reusable
  updateQuickFilterListOfNonAppliedFilters(data: LocationLinkQuickFilterListModel): void {
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

  updateQuickFilterListOfAppliedFilters(data: LocationLinkQuickFilterListModel, columnName: string): void {
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

  getCheckedQuickFiltersModel(excludeQuickFilterColumnName?: string): LocationLinkQuickFilterModel {
    const quickFilterModel = new LocationLinkQuickFilterModel();
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
      this.filter.quickFilters = new LocationLinkQuickFilterModel();
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
    this.locationLinkService.link(this.findingId, this.selected[0].id, FindingGroupType.LocationLink).subscribe(() => {
      var dialog = this.dialog.open(AlertDialogComponent);
      dialog.componentInstance.title = 'You have successfully linked two findings.';
      this.dialogRef.close();
    });
  }
}
