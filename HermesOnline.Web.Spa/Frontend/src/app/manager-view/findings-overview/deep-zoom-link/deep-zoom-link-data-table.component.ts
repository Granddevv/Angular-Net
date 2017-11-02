// tslint:disable:radix
// tslint:disable:max-line-length

import { Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeepZoomLinkCompareComponent } from './dialogs/deep-zoom-link-compare/deep-zoom-link-compare.component';
import { MdDialog } from '@angular/material';
import { IQuickFilter } from '../../../common/interface/quick-filter.interface';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { MdSnackBar } from '@angular/material';
import { Tab } from '../../../models/manager-view/finding-overview/common/tab/tab';
import { DeepZoomLinkCompareDialogModel } from '../../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-compare.model';
import { DeepZoomLinkQuickFilterListModel } from '../../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-quick-filter-list.model';
import { DeepZoomLinkQuickFilterModel } from '../../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-quick-filter.model';
import { DeepZoomLinkDataTableColumns } from '../../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-data-table.model';
import { DeepZoomDataTableFilterModel, DeepZoomDataTableConstants } from '../../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-data-table-filter.model';
import { DeepZoomLinkDataTableRowModel } from '../../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-data-table-row.model';
import { NodeType } from '../../../models/manager-view/common/model/node-type';
import { QuickFilterListItemModel } from '../../../models/common/quick-filter-list-item.model';
import { Permissions } from '../../../models/common/permissions.enum';
import { ColumnVisibilityService } from '../../../services/common-services/column-visibility.service';
import { DeepZoomLinkService } from '../../../services/data-services/deep-zoom-link.service';
import { Tables } from '../../../models/manager-view/common/model/table-list';

@Component({
  selector: 'app-deep-zoom-links',
  templateUrl: './deep-zoom-link-data-table.component.html',
  styleUrls: ['./deep-zoom-link-data-table.component.scss'],
  providers: [DeepZoomLinkService],
  encapsulation: ViewEncapsulation.None
})
export class DeepZoomLinksDataTableComponent implements OnInit, IQuickFilter<DeepZoomLinkQuickFilterListModel, DeepZoomLinkQuickFilterModel> {
  @Input()
  filter: DeepZoomDataTableFilterModel;

  @Output()
  filterChanged = new EventEmitter();

  @Output()
  totalRecordsNumber = new EventEmitter<number>();
  public Permissions = Permissions;
  @ViewChild('table') table: DatatableComponent;

  @ViewChild('inspectionCellTemplate')
  inspectionCellTemplate: TemplateRef<any>;
  @ViewChild('actionsCellTemplate')
  actionsCellTemplate: TemplateRef<any>;

  @ViewChild('windFarmHeaderTemplate')
  windFarmHeaderTemplate: TemplateRef<any>;
  @ViewChild('turbineSerialHeaderTemplate')
  turbineSerialHeaderTemplate: TemplateRef<any>;
  @ViewChild('turbineHeaderTemplate')
  turbineHeaderTemplate: TemplateRef<any>;
  @ViewChild('bladeHeaderTemplate')
  bladeHeaderTemplate: TemplateRef<any>;
  @ViewChild('surfaceHeaderTemplate')
  surfaceHeaderTemplate: TemplateRef<any>;
  @ViewChild('dateHeaderTemplate')
  dateHeaderTemplate: TemplateRef<any>;
  @ViewChild('photoSourceHeaderTemplate')
  photoSourceHeaderTemplate: TemplateRef<any>;
  @ViewChild('inspectionHeaderTemplate')
  inspectionHeaderTemplate: TemplateRef<any>;
  @ViewChild('actionsHeaderTemplate')
  actionsHeaderTemplate: TemplateRef<any>;

  quickFiltersList = new DeepZoomLinkQuickFilterListModel();
  appliedQuickFiltersColumnProps = {};
  columns = [];
  visibleColumns = [];
  dataRows: DeepZoomLinkDataTableRowModel[] = [];
  limitPerPage = DeepZoomDataTableConstants.dataTableSizePerPage;
  count = 0;
  offset = 0;
  tableName: Tables;
  loadingIndicator: boolean;

  constructor(
    private deepZoomLinksService: DeepZoomLinkService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private dialog: MdDialog,
    private columnVisibilityService: ColumnVisibilityService,
    public snackBar: MdSnackBar) {
  }

  ngOnInit() {
    this.columnVisibilityService.columnVisibilityChanged.subscribe((res) => this.initializeColumns());
    this.initializeColumns();
    this.prepareFiltersAndFilterTable();
  }

  onPage(event) {
    this.filter.pageSize = event.pageSize;
    this.filter.pageIndex = event.offset;
    this.offset = event.offset;
    this.filterTable();
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
        if (this.table && this.table.offset > 0 && data.deepZoomLinkTableRows.length > 0 && this.isOneElementLeftOnLastPage(data.totalRecords)) {
          this.offset--;
          this.table.offset--;
        }

        this.dataRows = data.deepZoomLinkTableRows;
        this.count = data.totalRecords;
        this.totalRecordsNumber.emit(this.count);
        setTimeout(() => { this.loadingIndicator = false; }, 1500);
      });
  }

  isOneElementLeftOnLastPage(totalRecordsCount: number): boolean {
    return (this.filter.pageIndex * this.filter.pageSize) === totalRecordsCount;
  }

  prepareFiltersAndFilterTable() {
    this.activeRoute.params.subscribe(params => {
      if (+params['tabId'] === Tab.DeepZoomLinks) {
        this.filter = new DeepZoomDataTableFilterModel(params['id'], params['type']);
        this.filterTable();
      }
    });

    this.deepZoomLinksService.getQuickFilters(this.filter.type, this.filter.id)
      .subscribe(data => {
        this.quickFiltersList = data;
        this.initializeQuickFiltersForTableFilterModel();
      });
  }

  quickFilterSubmitted(columnName: string, quickFilterList: QuickFilterListItemModel[]) {
    // Track against which column filter is applied
    if (quickFilterList.length > quickFilterList.filter(x => x.isChecked).length) {
      this.appliedQuickFiltersColumnProps[columnName] = true;
    } else if (quickFilterList.length === quickFilterList.filter(x => x.isChecked).length) {
      delete this.appliedQuickFiltersColumnProps[columnName];
    }

    // Update quick filters list of already applied (touched) quick filters
    this.initializeQuickFiltersForTableFilterModel(columnName);
    for (const key in this.appliedQuickFiltersColumnProps) {
      if (this.appliedQuickFiltersColumnProps.hasOwnProperty(key)) {
        const checkedQuickFilters = this.getCheckedQuickFiltersModel(key);
        this.deepZoomLinksService.getQuickFilters(this.filter.type, this.filter.id, checkedQuickFilters)
          .subscribe(data => {
            this.updateQuickFilterListOfAppliedFilters(data, key);
          });
      }
    }

    // Update quick filters list of non applied (non touched) qucik filters
    const checkedQuickFiltersModel = this.getCheckedQuickFiltersModel();
    this.deepZoomLinksService.getQuickFilters(this.filter.type, this.filter.id, checkedQuickFiltersModel)
      .subscribe(data => {
        this.updateQuickFilterListOfNonAppliedFilters(data);
        this.initializeQuickFiltersForTableFilterModel();
        this.filterTable(true);
      });
  }

  compare(excludeDeepZoomLinkId: string) {
    const dialogModel = new DeepZoomLinkCompareDialogModel(excludeDeepZoomLinkId, this.filter.type, this.filter.id);
    const deepZoomLinkCompareDialog = this.dialog.open(DeepZoomLinkCompareComponent);

    deepZoomLinkCompareDialog.componentInstance.dialogModel = dialogModel;
  }

  compareToSameBlade(bladeId: string, excludeDeepZoomLinkId: string) {
    const dialogModel = new DeepZoomLinkCompareDialogModel(excludeDeepZoomLinkId, NodeType.Blade, bladeId);
    const deepZoomLinkCompareDialog = this.dialog.open(DeepZoomLinkCompareComponent);

    deepZoomLinkCompareDialog.componentInstance.dialogModel = dialogModel;
    deepZoomLinkCompareDialog.componentInstance.isCompareToSameBlade = true;
  }

  // TODO It would be nice to have this refactored into something which is reusable
  updateQuickFilterListOfNonAppliedFilters(data: DeepZoomLinkQuickFilterListModel) {
    if (!this.appliedQuickFiltersColumnProps.hasOwnProperty(DeepZoomLinkDataTableColumns.Blade.name)) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.blade.forEach(x => {
        const existingItem = this.quickFiltersList.blade.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(x.isChecked, x.value, x.display));
        }
      });
      this.quickFiltersList.blade = tmp;
    }

    if (!this.appliedQuickFiltersColumnProps.hasOwnProperty(DeepZoomLinkDataTableColumns.Date.name)) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.date.forEach(x => {
        const existingItem = this.quickFiltersList.date.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(x.isChecked, x.value, x.display));
        }
      });
      this.quickFiltersList.date = tmp;
    }

    if (!this.appliedQuickFiltersColumnProps.hasOwnProperty(DeepZoomLinkDataTableColumns.Inspection.name)) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.inspection.forEach(x => {
        const existingItem = this.quickFiltersList.inspection.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(x.isChecked, x.value, x.display));
        }
      });
      this.quickFiltersList.inspection = tmp;
    }

    if (!this.appliedQuickFiltersColumnProps.hasOwnProperty(DeepZoomLinkDataTableColumns.PhotoSource.name)) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.photoSource.forEach(x => {
        const existingItem = this.quickFiltersList.photoSource.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(x.isChecked, x.value, x.display));
        }
      });
      this.quickFiltersList.photoSource = tmp;
    }

    if (!this.appliedQuickFiltersColumnProps.hasOwnProperty(DeepZoomLinkDataTableColumns.Surface.name)) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.surface.forEach(x => {
        const existingItem = this.quickFiltersList.surface.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(x.isChecked, x.value, x.display));
        }
      });
      this.quickFiltersList.surface = tmp;
    }

    if (!this.appliedQuickFiltersColumnProps.hasOwnProperty(DeepZoomLinkDataTableColumns.Turbine.name)) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.turbine.forEach(x => {
        const existingItem = this.quickFiltersList.turbine.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(x.isChecked, x.value, x.display));
        }
      });
      this.quickFiltersList.turbine = tmp;
    }

    if (!this.appliedQuickFiltersColumnProps.hasOwnProperty(DeepZoomLinkDataTableColumns.TurbineSerial.name)) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.turbineSerial.forEach(x => {
        const existingItem = this.quickFiltersList.turbineSerial.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(x.isChecked, x.value, x.display));
        }
      });
      this.quickFiltersList.turbineSerial = tmp;
    }

    if (!this.appliedQuickFiltersColumnProps.hasOwnProperty(DeepZoomLinkDataTableColumns.WindFarm.name)) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.site.forEach(x => {
        const existingItem = this.quickFiltersList.site.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(x.isChecked, x.value, x.display));
        }
      });
      this.quickFiltersList.site = tmp;
    }
  }

  updateQuickFilterListOfAppliedFilters(data: DeepZoomLinkQuickFilterListModel, columnName: string) {
    if (columnName === DeepZoomLinkDataTableColumns.Blade.name) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.blade.forEach(x => {
        const existingItem = this.quickFiltersList.blade.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(false, x.value, x.display));
        }
      });
      this.quickFiltersList.blade = tmp;
      return;
    }

    if (columnName === DeepZoomLinkDataTableColumns.Date.name) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.date.forEach(x => {
        const existingItem = this.quickFiltersList.date.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(false, x.value, x.display));
        }
      });
      this.quickFiltersList.date = tmp;
      return;
    }

    if (columnName === DeepZoomLinkDataTableColumns.Inspection.name) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.inspection.forEach(x => {
        const existingItem = this.quickFiltersList.inspection.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(false, x.value, x.display));
        }
      });
      this.quickFiltersList.inspection = tmp;
      return;
    }

    if (columnName === DeepZoomLinkDataTableColumns.PhotoSource.name) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.photoSource.forEach(x => {
        const existingItem = this.quickFiltersList.photoSource.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(false, x.value, x.display));
        }
      });
      this.quickFiltersList.photoSource = tmp;
      return;
    }

    if (columnName === DeepZoomLinkDataTableColumns.Surface.name) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.surface.forEach(x => {
        const existingItem = this.quickFiltersList.surface.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(false, x.value, x.display));
        }
      });
      this.quickFiltersList.surface = tmp;
      return;
    }

    if (columnName === DeepZoomLinkDataTableColumns.Turbine.name) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.turbine.forEach(x => {
        const existingItem = this.quickFiltersList.turbine.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(false, x.value, x.display));
        }
      });
      this.quickFiltersList.turbine = tmp;
      return;
    }

    if (columnName === DeepZoomLinkDataTableColumns.TurbineSerial.name) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.turbineSerial.forEach(x => {
        const existingItem = this.quickFiltersList.turbineSerial.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(false, x.value, x.display));
        }
      });
      this.quickFiltersList.turbineSerial = tmp;
      return;
    }

    if (columnName === DeepZoomLinkDataTableColumns.WindFarm.name) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.site.forEach(x => {
        const existingItem = this.quickFiltersList.site.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(false, x.value, x.display));
        }
      });
      this.quickFiltersList.site = tmp;
      return;
    }
  }

  initializeQuickFiltersForTableFilterModel(columnName?: string) {
    if (this.filter.quickFilters == null) {
      this.filter.quickFilters = new DeepZoomLinkQuickFilterModel();
      this.filter.quickFilters.regions = this.filter.quickFilters.countries = null; // For now it is only used in compare deep zoom
    }

    if (columnName === undefined || columnName === DeepZoomLinkDataTableColumns.Blade.name) {
      this.filter.quickFilters.bladeIds = this.quickFiltersList.blade
        .filter(x => x.isChecked)
        .map(x => x.value);
      if (columnName !== undefined) {
        return;
      }
    }

    if (columnName === undefined || columnName === DeepZoomLinkDataTableColumns.Date.name) {
      this.filter.quickFilters.dates = this.quickFiltersList.date
        .filter(x => x.isChecked)
        .map(x => x.value);
      if (columnName !== undefined) {
        return;
      }
    }

    if (columnName === undefined || columnName === DeepZoomLinkDataTableColumns.Inspection.name) {
      this.filter.quickFilters.inspections = this.quickFiltersList.inspection
        .filter(x => x.isChecked)
        .map(x => x.value);
      if (columnName !== undefined) {
        return;
      }
    }

    if (columnName === undefined || columnName === DeepZoomLinkDataTableColumns.Turbine.name) {
      this.filter.quickFilters.turbineIds = this.quickFiltersList.turbine
        .filter(x => x.isChecked)
        .map(x => x.value);
      if (columnName !== undefined) {
        return;
      }
    }

    if (columnName === undefined || columnName === DeepZoomLinkDataTableColumns.TurbineSerial.name) {
      this.filter.quickFilters.turbineSerials = this.quickFiltersList.turbineSerial
        .filter(x => x.isChecked)
        .map(x => x.value);
      if (columnName !== undefined) {
        return;
      }
    }

    if (columnName === undefined || columnName === DeepZoomLinkDataTableColumns.WindFarm.name) {
      this.filter.quickFilters.siteIds = this.quickFiltersList.site
        .filter(x => x.isChecked)
        .map(x => x.value);
      if (columnName !== undefined) {
        return;
      }
    }

    if (columnName === undefined || columnName === DeepZoomLinkDataTableColumns.Surface.name) {
      this.filter.quickFilters.surfaces = this.quickFiltersList.surface
        .filter(x => x.isChecked)
        .map(x => parseInt(x.value));
      if (columnName !== undefined) {
        return;
      }
    }

    if (columnName === undefined || columnName === DeepZoomLinkDataTableColumns.PhotoSource.name) {
      this.filter.quickFilters.photoSources = this.quickFiltersList.photoSource
        .filter(x => x.isChecked)
        .map(x => parseInt(x.value));
      if (columnName !== undefined) {
        return;
      }
    }
  }

  onSort(event) {
    this.filter.sortProperty = event.sorts[0].prop;
    this.filter.sortDirection = event.sorts[0].dir === 'asc' ? 0 : 1;
    this.filterTable();
  }

  getCheckedQuickFiltersModel(excludeQuickFilterColumnName?: string): DeepZoomLinkQuickFilterModel {
    const quickFilterModel = new DeepZoomLinkQuickFilterModel();

    if (this.appliedQuickFiltersColumnProps.hasOwnProperty(DeepZoomLinkDataTableColumns.Blade.name) && excludeQuickFilterColumnName !== DeepZoomLinkDataTableColumns.Blade.name) {
      quickFilterModel.bladeIds = this.filter.quickFilters.bladeIds;
    } else {
      quickFilterModel.bladeIds = null;
    }

    if (this.appliedQuickFiltersColumnProps.hasOwnProperty(DeepZoomLinkDataTableColumns.Date.name) && excludeQuickFilterColumnName !== DeepZoomLinkDataTableColumns.Date.name) {
      quickFilterModel.dates = this.filter.quickFilters.dates;
    } else {
      quickFilterModel.dates = null;
    }

    if (this.appliedQuickFiltersColumnProps.hasOwnProperty(DeepZoomLinkDataTableColumns.Inspection.name) && excludeQuickFilterColumnName !== DeepZoomLinkDataTableColumns.Inspection.name) {
      quickFilterModel.inspections = this.filter.quickFilters.inspections;
    } else {
      quickFilterModel.inspections = null;
    }

    if (this.appliedQuickFiltersColumnProps.hasOwnProperty(DeepZoomLinkDataTableColumns.PhotoSource.name) && excludeQuickFilterColumnName !== DeepZoomLinkDataTableColumns.PhotoSource.name) {
      quickFilterModel.photoSources = this.filter.quickFilters.photoSources;
    } else {
      quickFilterModel.photoSources = null;
    }

    if (this.appliedQuickFiltersColumnProps.hasOwnProperty(DeepZoomLinkDataTableColumns.Surface.name) && excludeQuickFilterColumnName !== DeepZoomLinkDataTableColumns.Surface.name) {
      quickFilterModel.surfaces = this.filter.quickFilters.surfaces;
    } else {
      quickFilterModel.surfaces = null;
    }

    if (this.appliedQuickFiltersColumnProps.hasOwnProperty(DeepZoomLinkDataTableColumns.Turbine.name) && excludeQuickFilterColumnName !== DeepZoomLinkDataTableColumns.Turbine.name) {
      quickFilterModel.turbineIds = this.filter.quickFilters.turbineIds;
    } else {
      quickFilterModel.turbineIds = null;
    }

    if (this.appliedQuickFiltersColumnProps.hasOwnProperty(DeepZoomLinkDataTableColumns.TurbineSerial.name) && excludeQuickFilterColumnName !== DeepZoomLinkDataTableColumns.TurbineSerial.name) {
      quickFilterModel.turbineSerials = this.filter.quickFilters.turbineSerials;
    } else {
      quickFilterModel.turbineSerials = null;
    }

    if (this.appliedQuickFiltersColumnProps.hasOwnProperty(DeepZoomLinkDataTableColumns.WindFarm.name) && excludeQuickFilterColumnName !== DeepZoomLinkDataTableColumns.WindFarm.name) {
      quickFilterModel.siteIds = this.filter.quickFilters.siteIds;
    } else {
      quickFilterModel.siteIds = null;
    }

    quickFilterModel.regions = quickFilterModel.countries = null; // compare deepZoomLink will only use this fields

    return quickFilterModel;
  }

  private initializeColumns() {
    this.visibleColumns = this.columnVisibilityService.getVisibleColumns(Tables.DeepZoomLinks);
    const allColumns = [
      { name: DeepZoomLinkDataTableColumns.WindFarm.name, headerTemplate: this.windFarmHeaderTemplate, prop: 'site', sortable: true, resizeable: false },
      { name: DeepZoomLinkDataTableColumns.TurbineSerial.name, headerTemplate: this.turbineSerialHeaderTemplate, prop: 'turbineSerialNumber', sortable: true, resizeable: false },
      { name: DeepZoomLinkDataTableColumns.Turbine.name, headerTemplate: this.turbineHeaderTemplate, prop: 'turbineName', sortable: true, resizeable: false },
      { name: DeepZoomLinkDataTableColumns.Blade.name, headerTemplate: this.bladeHeaderTemplate, prop: 'blade', sortable: true, resizeable: false },
      { name: DeepZoomLinkDataTableColumns.Surface.name, headerTemplate: this.surfaceHeaderTemplate, prop: 'surface', sortable: true, resizeable: false },
      { name: DeepZoomLinkDataTableColumns.Date.name, headerTemplate: this.dateHeaderTemplate, prop: 'date', sortable: true, resizeable: false },
      { name: DeepZoomLinkDataTableColumns.PhotoSource.name, headerTemplate: this.photoSourceHeaderTemplate, prop: 'photo', sortable: false, width: 200, resizeable: false },
      { name: DeepZoomLinkDataTableColumns.Inspection.name, headerTemplate: this.inspectionHeaderTemplate, cellTemplate: this.inspectionCellTemplate, prop: 'inspection', sortable: true, resizeable: false },
      { name: DeepZoomLinkDataTableColumns.Actions.name, headerTemplate: this.actionsHeaderTemplate, cellTemplate: this.actionsCellTemplate, sortable: false, resizeable: false }
    ];

    this.removeNotVisibleColumns(allColumns);
  }

  private removeNotVisibleColumns(allColumns: any[]) {
    this.columns = [];
    allColumns.forEach(column => {
      const visibleColumn = this.visibleColumns.find(function (el) {
        return el['name'] === column['name'];
      });
      if (visibleColumn && visibleColumn['checked']) {
        this.columns.push(column);
      }
    });
  }

  delete(row) {
    let confirmDialog = this.dialog.open(ConfirmationDialogComponent);
    confirmDialog.componentInstance.title = 'Are you sure you want to delete deep zoom link?';
    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.deepZoomLinksService.deleteDeepZoomLink(row['id']).subscribe(() => {
          this.filterTable();
          const message = 'Deep zoom link has been successfully deleted.';
          this.snackBar.open(message, '', { duration: 2000 });
        }
        );
      }
    });
  }
}
