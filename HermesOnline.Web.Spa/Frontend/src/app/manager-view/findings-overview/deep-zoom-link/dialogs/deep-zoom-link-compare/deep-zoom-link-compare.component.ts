// tslint:disable:max-line-length

import { Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { DatatableComponent } from '@swimlane/ngx-datatable/release';
import { Tab } from '../../../../../models/manager-view/finding-overview/common/tab/tab';
import { DeepZoomLinkCompareDialogModel } from '../../../../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-compare.model';
import { DeepZoomLinkQuickFilterListModel } from '../../../../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-quick-filter-list.model';
import { DeepZoomLinkQuickFilterModel } from '../../../../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-quick-filter.model';
import { DeepZoomLinkDataTableColumns } from '../../../../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-data-table.model';
import { DeepZoomDataTableFilterModel } from '../../../../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-data-table-filter.model';
import { DeepZoomLinkDataTableRowModel } from '../../../../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-data-table-row.model';
import { QuickFilterListItemModel } from '../../../../../models/common/quick-filter-list-item.model';
import { ColumnVisibilityService } from '../../../../../services/common-services/column-visibility.service';
import { DeepZoomLinkService } from '../../../../../services/data-services/deep-zoom-link.service';
import { Tables } from '../../../../../models/manager-view/common/model/table-list';

@Component({
  selector: 'app-deep-zoom-links-compare',
  templateUrl: './deep-zoom-link-compare.component.html',
  styleUrls: ['./deep-zoom-link-compare.component.scss'],
  providers: [DeepZoomLinkService],
  encapsulation: ViewEncapsulation.None
})
export class DeepZoomLinkCompareComponent implements OnInit {
  filter: DeepZoomDataTableFilterModel;
  columns = [];
  visibleColumns = [];
  dataRows: DeepZoomLinkDataTableRowModel[] = [];
  selected = [];
  limitPerPage = 10;
  count = 0;
  offset = 0;
  dialogModel: DeepZoomLinkCompareDialogModel;
  hostBaseUrl: string;
  quickFiltersList = new DeepZoomLinkQuickFilterListModel();
  appliedQuickFiltersColumnNames = {};
  filterColumns = [
    { name: 'site', value: 'siteIds' },
    { name: 'turbineSerial', value: 'turbineSerials' },
    { name: 'turbine', value: 'turbineIds' },
    { name: 'blade', value: 'bladeIds' },
    { name: 'surface', value: 'surfaces' },
    { name: 'region', value: 'regions' },
    { name: 'country', value: 'countries' }
  ];
  isCompareToSameBlade: boolean;
  loadingIndicator: boolean;

  @ViewChild('siteHeaderTemplate')
  siteHeaderTemplate: TemplateRef<any>;
  @ViewChild('turbineSerialHeaderTemplate')
  turbineSerialHeaderTemplate: TemplateRef<any>;
  @ViewChild('turbineHeaderTemplate')
  turbineHeaderTemplate: TemplateRef<any>;
  @ViewChild('bladeHeaderTemplate')
  bladeHeaderTemplate: TemplateRef<any>;
  @ViewChild('surfaceHeaderTemplate')
  surfaceHeaderTemplate: TemplateRef<any>;
  @ViewChild('regionHeaderTemplate')
  regionHeaderTemplate: TemplateRef<any>;
  @ViewChild('countryHeaderTemplate')
  countryHeaderTemplate: TemplateRef<any>;
  @ViewChild('dateHeaderTemplate')
  dateHeaderTemplate: TemplateRef<any>;
  @ViewChild('table') table: DatatableComponent;

  constructor(
    private deepZoomLinksService: DeepZoomLinkService,
    private dialogRef: MdDialogRef<DeepZoomLinkCompareComponent>,
    private columnVisibilityService: ColumnVisibilityService) {
  }

  ngOnInit() {
    this.visibleColumns = this.columnVisibilityService.getVisibleColumns(Tables.DeepZoomLinks);
    this.filter = new DeepZoomDataTableFilterModel(this.dialogModel.nodeId, this.dialogModel.nodeType, null, this.dialogModel.excludeDeepZoomLinkId, this.isCompareToSameBlade);
    this.initializeColumns();
    this.filterTable();
    this.initializeQuickFilters();
  }

  onPage(event) {
    this.filter.pageSize = event.pageSize;
    this.filter.pageIndex = event.offset;
    this.offset = event.offset;
    this.filterTable();
  }

  compare() {
    window.open(`preview/deepzoomlink/compare/leftdeepzoomlinkid/${this.dialogModel.excludeDeepZoomLinkId}/rightdeepzoomlinkid/${this.selected[0].id}`);
    this.dialogRef.close();
  }

  filterTable(resetPage = false) {
    this.loadingIndicator = true;
    if (resetPage) {
      this.filter.pageIndex = 0;
      this.table.offset = 0;
    }
    this.deepZoomLinksService.filterTable(this.filter)
      .subscribe(
      data => {
        this.dataRows = data.deepZoomLinkTableRows;
        this.count = data.totalRecords;
        setTimeout(() => { this.loadingIndicator = false; }, 1000);
      }
      );
    this.selected = [];
  }

  initializeQuickFilters() {
    this.deepZoomLinksService.getQuickFilters(this.filter.type, this.filter.id, null, this.dialogModel.excludeDeepZoomLinkId, this.isCompareToSameBlade)
      .subscribe(data => {
        this.quickFiltersList.site = data.site;
        this.quickFiltersList.turbine = data.turbine;
        this.quickFiltersList.turbineSerial = data.turbineSerial;
        this.quickFiltersList.blade = data.blade;
        this.quickFiltersList.surface = data.surface;
        this.quickFiltersList.region = data.region;
        this.quickFiltersList.country = data.country;

        this.initializeQuickFiltersForTableFilterModel();
      });
  }

  initializeQuickFiltersForTableFilterModel(columnName?: string): void {
    if (this.filter.quickFilters == null) {
      this.filter.quickFilters = new DeepZoomLinkQuickFilterModel([], [], [], null, null, null, null, null);
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
        this.deepZoomLinksService.getQuickFilters(this.filter.type, this.filter.id, checkedQuickFilters, this.dialogModel.excludeDeepZoomLinkId, this.isCompareToSameBlade)
          .subscribe(data => {
            this.updateQuickFilterListOfAppliedFilters(data, key);
          });
      }
    }

    // Update quick filters list of non applied (non touched) quick filters
    const checkedQuickFiltersModel = this.getCheckedQuickFiltersModel();
    this.deepZoomLinksService.getQuickFilters(this.filter.type, this.filter.id, checkedQuickFiltersModel, this.dialogModel.excludeDeepZoomLinkId, this.isCompareToSameBlade)
      .subscribe(data => {
        this.updateQuickFilterListOfNonAppliedFilters(data);
        this.initializeQuickFiltersForTableFilterModel();
        this.filterTable(true);
      });
  }

  updateQuickFilterListOfNonAppliedFilters(data: DeepZoomLinkQuickFilterListModel): void {
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

  updateQuickFilterListOfAppliedFilters(data: DeepZoomLinkQuickFilterListModel, columnName: string): void {
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

  getCheckedQuickFiltersModel(excludeQuickFilterColumnName?: string): DeepZoomLinkQuickFilterModel {
    const quickFilterModel = new DeepZoomLinkQuickFilterModel();
    quickFilterModel.photoSources = quickFilterModel.inspections = quickFilterModel.dates = quickFilterModel.siteIds = null;

    this.filterColumns.forEach(filter => {
      if (this.appliedQuickFiltersColumnNames.hasOwnProperty(filter.name) && excludeQuickFilterColumnName !== filter.name) {
        quickFilterModel[filter.value] = this.filter.quickFilters[filter.value]
      } else {
        quickFilterModel[filter.value] = null;
      }
    });

    return quickFilterModel;
  }

  private initializeColumns() {
    this.columns = [
      { name: 'Region', prop: 'region', headerTemplate: this.regionHeaderTemplate, sortable: true, maxWidth: 100, resizeable: false },
      { name: 'Country', prop: 'country', headerTemplate: this.countryHeaderTemplate, sortable: true, maxWidth: 100, resizeable: false },
      { name: DeepZoomLinkDataTableColumns.WindFarm.name, prop: 'site', headerTemplate: this.siteHeaderTemplate, sortable: true, maxWidth: 130, resizeable: false },
      { name: DeepZoomLinkDataTableColumns.TurbineSerial.name, prop: 'turbineSerialNumber', headerTemplate: this.turbineSerialHeaderTemplate, sortable: true, maxWidth: 160, resizeable: false },
      { name: DeepZoomLinkDataTableColumns.Turbine.name, prop: 'turbineName', headerTemplate: this.turbineHeaderTemplate, sortable: true, maxWidth: 160, resizeable: false },
      { name: DeepZoomLinkDataTableColumns.Blade.name, prop: 'blade', headerTemplate: this.bladeHeaderTemplate, sortable: true, maxWidth: 160, resizeable: false },
      { name: DeepZoomLinkDataTableColumns.Surface.name, prop: 'surface', headerTemplate: this.surfaceHeaderTemplate, sortable: true, maxWidth: 100, resizeable: false },
      { name: DeepZoomLinkDataTableColumns.Date.name, prop: 'date', headerTemplate: this.dateHeaderTemplate, sortable: true, maxWidth: 130, resizeable: false }
    ];
  }

  onSort(event) {
    this.filter.sortProperty = event.sorts[0].prop;
    this.filter.sortDirection = event.sorts[0].dir === 'asc' ? 0 : 1;
    this.filterTable();
  }
}
