// tslint:disable:max-line-length

import { Component, OnInit, ViewEncapsulation, ViewChild, TemplateRef, Input, Output } from '@angular/core';
import { MdDialog, MdSnackBar } from '@angular/material';
import { DefectChangeLogsService } from '../../services/data-services/defect-change-logs.service';
import { DefectChangeLogsTableRowModel, DefectChangeLogsTableFilterModel, DefectChangeLogDataTableColumns, DefectChangeLogQuickFilterListModel, DefectChangeLogsQuickFilterModel } from '../../models/manager-view/finding-overview/common/findings/findings-change-log.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { PreviewDefectChangeLogComponent } from './preview-defect-change-log/preview-defect-change-log.component';
import { IQuickFilter } from '../../common/interface/quick-filter.interface';
import { QuickFilterListItemModel } from '../../models/common/quick-filter-list-item.model';
import { Tab } from '../../models/manager-view/finding-overview/common/tab/tab';
import { Subscription } from 'rxjs/Subscription';
import { Tables } from '../../models/manager-view/common/model/table-list';
import { FindingsDataTableService } from '../../services/data-services/findings-data-table.service';
import { Image } from '../../models/manager-view/common/model/image';
import { Router } from '@angular/router';
import { ReportGeneratorService } from '../../services/data-services/report-generator.service';
import { ReportGenerationProgressDialogComponent } from '../../manager-view/common/dialogs/report-generation-progress/report-generation-progress.component';

@Component({
  selector: 'app-defect-change-logs',
  templateUrl: './defect-change-logs.component.html',
  styleUrls: ['./defect-change-logs.component.scss'],
  providers: [DefectChangeLogsService, FindingsDataTableService, ReportGeneratorService],
  encapsulation: ViewEncapsulation.None
})
export class DefectChangeLogsComponent implements OnInit, IQuickFilter<DefectChangeLogQuickFilterListModel, DefectChangeLogsQuickFilterModel> {
  quickFiltersList = new DefectChangeLogQuickFilterListModel();
  public columns = [];

  @Input()
  filter: DefectChangeLogsTableFilterModel;

  @Output()
  public selected = [];
  public limitPerPage = 15;
  public count = 0;
  public offset = 0;
  public dataRows: DefectChangeLogsTableRowModel[] = [];
  public image = new Image();
  private images = new Array<Image>();
  appliedQuickFiltersColumnProps = {};

  @ViewChild('actionsTemplate')
  actionsTemplate: TemplateRef<any>;
  @ViewChild('commentTemplate')
  commentTemplate: TemplateRef<any>;
  @ViewChild('table')
  table: DatatableComponent;
  @ViewChild('originalSeverityTemplate')
  originalSeverityTemplate: TemplateRef<any>;
  @ViewChild('newTypeTemplate')
  newTypeTemplate: TemplateRef<any>;
  @ViewChild('newSeverityTemplate')
  newSeverityTemplate: DatatableComponent;
  @ViewChild('userTemplate')
  userTemplate: TemplateRef<any>;
  @ViewChild('originalLayerTemplate')
  originalLayerTemplate: TemplateRef<any>;
  @ViewChild('originalTypeTemplate')
  originalTypeTemplate: DatatableComponent;
  @ViewChild('siteTemplate')
  siteTemplate: TemplateRef<any>;
  @ViewChild('serialNumberTemplate')
  serialNumberTemplate: TemplateRef<any>;
  @ViewChild('dateTemplate')
  dateTemplate: TemplateRef<any>;
  @ViewChild('newLayerTemplate')
  newLayerTemplate: TemplateRef<any>;
  @ViewChild('commentHeaderTemplate')
  commentHeaderTemplate: TemplateRef<any>;
  @ViewChild('actionHeaderTemplate')
  actionHeaderTemplate: TemplateRef<any>;
  private columnVisibilityChangedSubscription: Subscription;
  tableName: Tables;
  Tables = Tables;
  loadingIndicator: boolean;

  constructor(private defectChangeLogsService: DefectChangeLogsService,
    public dialog: MdDialog,
    private findingsService: FindingsDataTableService,
    private router: Router,
    public snackBar: MdSnackBar,
    private reportGeneratorService: ReportGeneratorService) {
  }

  ngOnInit() {
    this.initializeColumns();
    this.filter = new DefectChangeLogsTableFilterModel();
    this.prepareFiltersAndFilterTable();
    this.filterTable();
  }

  prepareFiltersAndFilterTable() {
    this.defectChangeLogsService.getQuickFilters()
      .subscribe(data => {
        this.quickFiltersList = data;
        this.initializeQuickFiltersForTableFilterModel();
      });
  }

  private initializeColumns() {
    this.columns = [
      { name: DefectChangeLogDataTableColumns.User.name, sortable: true, resizeable: false, headerTemplate: this.userTemplate },
      { name: DefectChangeLogDataTableColumns.Site.name, sortable: true, resizeable: false, headerTemplate: this.siteTemplate },
      { name: DefectChangeLogDataTableColumns.SerialNumber.name, prop: 'serialNumber', sortable: true, resizeable: false, headerTemplate: this.serialNumberTemplate },
      { name: DefectChangeLogDataTableColumns.Actions.name, sortable: false, resizeable: false, cellTemplate: this.actionsTemplate, headerTemplate: this.actionHeaderTemplate }
    ];
  }

  public onPage(event) {
    this.filter.pageSize = event.pageSize;
    this.filter.pageIndex = event.offset;
    this.offset = event.offset;
    this.filterTable();
  }

  public onSort(event) {
    this.filter.sortProperty = event.sorts[0].prop;
    this.filter.sortDirection = event.sorts[0].dir === 'asc' ? 0 : 1;
    this.filterTable();
  }

  filterTable(resetPage = false) {
    this.loadingIndicator = true;
    if (resetPage) {
      this.filter.pageIndex = 0;
      this.table.offset = 0;
    }
    this.defectChangeLogsService.filterTable(this.filter)
      .subscribe(
      data => {
        if (this.table && this.table.offset > 0 && data.defectChangeLogsTableRows.length > 0 && this.isOneElementLeftOnLastPage(data.totalRecords)) {
          this.offset--;
          this.table.offset--;
        }
        this.dataRows = data.defectChangeLogsTableRows;
        this.count = data.totalRecords;
        setTimeout(() => { this.loadingIndicator = false; }, 1000);
      });
  }

  isOneElementLeftOnLastPage(totalRecordsCount: number): boolean {
    return (this.filter.pageIndex * this.filter.pageSize) === totalRecordsCount;
  }

  view(row) {
    const dialog = this.dialog.open(PreviewDefectChangeLogComponent);
    dialog.componentInstance.defectChangeLog = new DefectChangeLogsTableRowModel(row['id'], row['dateModified'], row['originalSeverity'], row['originalLayer'], row['originalType'], row['newSeverity'], row['newLayer'], row['newType'], row['user'], row['site'], row['serialNumber'], row['comment']);
  }

  updateQuickFilterListOfNonAppliedFilters(data: DefectChangeLogQuickFilterListModel): void {
    if (!this.appliedQuickFiltersColumnProps.hasOwnProperty(DefectChangeLogDataTableColumns.OriginalLayer.name)) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.originalLayer.forEach(x => {
        const existingItem = this.quickFiltersList.originalLayer.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(x.isChecked, x.value, x.display));
        }
      });
      this.quickFiltersList.originalLayer = tmp;
    }

    if (!this.appliedQuickFiltersColumnProps.hasOwnProperty(DefectChangeLogDataTableColumns.OriginalSeverity.name)) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.origanalSeverity.forEach(x => {
        const existingItem = this.quickFiltersList.origanalSeverity.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(x.isChecked, x.value, x.display));
        }
      });
      this.quickFiltersList.origanalSeverity = tmp;
    }

    if (!this.appliedQuickFiltersColumnProps.hasOwnProperty(DefectChangeLogDataTableColumns.OriginalType.name)) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.originalCategory.forEach(x => {
        const existingItem = this.quickFiltersList.originalCategory.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(x.isChecked, x.value, x.display));
        }
      });
      this.quickFiltersList.originalCategory = tmp;
    }

    if (!this.appliedQuickFiltersColumnProps.hasOwnProperty(DefectChangeLogDataTableColumns.NewLayer.name)) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.newLayer.forEach(x => {
        const existingItem = this.quickFiltersList.newLayer.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(x.isChecked, x.value, x.display));
        }
      });
      this.quickFiltersList.newLayer = tmp;
    }

    if (!this.appliedQuickFiltersColumnProps.hasOwnProperty(DefectChangeLogDataTableColumns.NewSeverity.name)) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.newSeverity.forEach(x => {
        const existingItem = this.quickFiltersList.newSeverity.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(x.isChecked, x.value, x.display));
        }
      });
      this.quickFiltersList.newSeverity = tmp;
    }

    if (!this.appliedQuickFiltersColumnProps.hasOwnProperty(DefectChangeLogDataTableColumns.NewType.name)) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.newCategory.forEach(x => {
        const existingItem = this.quickFiltersList.newCategory.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(x.isChecked, x.value, x.display));
        }
      });
      this.quickFiltersList.newCategory = tmp;
    }

    if (!this.appliedQuickFiltersColumnProps.hasOwnProperty(DefectChangeLogDataTableColumns.Site.name)) {
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

  updateQuickFilterListOfAppliedFilters(data: DefectChangeLogQuickFilterListModel, columnName: string): void {
    if (columnName === DefectChangeLogDataTableColumns.OriginalLayer.name) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.originalLayer.forEach(x => {
        const existingItem = this.quickFiltersList.originalLayer.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(false, x.value, x.display));
        }
      });
      this.quickFiltersList.originalLayer = tmp;
      return;
    }

    if (columnName === DefectChangeLogDataTableColumns.OriginalSeverity.name) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.origanalSeverity.forEach(x => {
        const existingItem = this.quickFiltersList.origanalSeverity.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(false, x.value, x.display));
        }
      });
      this.quickFiltersList.origanalSeverity = tmp;
      return;
    }

    if (columnName === DefectChangeLogDataTableColumns.OriginalType.name) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.originalCategory.forEach(x => {
        const existingItem = this.quickFiltersList.originalCategory.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(false, x.value, x.display));
        }
      });
      this.quickFiltersList.originalCategory = tmp;
      return;
    }

    if (columnName === DefectChangeLogDataTableColumns.NewLayer.name) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.newLayer.forEach(x => {
        const existingItem = this.quickFiltersList.newLayer.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(false, x.value, x.display));
        }
      });
      this.quickFiltersList.newLayer = tmp;
      return;
    }

    if (columnName === DefectChangeLogDataTableColumns.NewSeverity.name) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.newSeverity.forEach(x => {
        const existingItem = this.quickFiltersList.newSeverity.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(false, x.value, x.display));
        }
      });
      this.quickFiltersList.newSeverity = tmp;
      return;
    }

    if (columnName === DefectChangeLogDataTableColumns.NewType.name) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.newCategory.forEach(x => {
        const existingItem = this.quickFiltersList.newCategory.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(false, x.value, x.display));
        }
      });
      this.quickFiltersList.newCategory = tmp;
      return;
    }

    if (columnName === DefectChangeLogDataTableColumns.Site.name) {
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

  initializeQuickFiltersForTableFilterModel(columnName?: string): void {
    if (this.filter.quickFilters == null) {
      this.filter.quickFilters = new DefectChangeLogsQuickFilterModel();
    }

    if (columnName === undefined || columnName === DefectChangeLogDataTableColumns.OriginalLayer.name) {
      this.filter.quickFilters.originalLayers = this.quickFiltersList.originalLayer
        .filter(x => x.isChecked)
        .map(x => x.value);
      if (columnName !== undefined) {
        return;
      }
    }

    if (columnName === undefined || columnName === DefectChangeLogDataTableColumns.OriginalType.name) {
      this.filter.quickFilters.originalTypes = this.quickFiltersList.originalCategory
        .filter(x => x.isChecked)
        .map(x => x.value);
      if (columnName !== undefined) {
        return;
      }
    }

    if (columnName === undefined || columnName === DefectChangeLogDataTableColumns.OriginalSeverity.name) {
      this.filter.quickFilters.originalSeverities = this.quickFiltersList.origanalSeverity
        .filter(x => x.isChecked)
        .map(x => x.value);
      if (columnName !== undefined) {
        return;
      }
    }

    if (columnName === undefined || columnName === DefectChangeLogDataTableColumns.NewLayer.name) {
      this.filter.quickFilters.newLayers = this.quickFiltersList.newLayer
        .filter(x => x.isChecked)
        .map(x => x.value);
      if (columnName !== undefined) {
        return;
      }
    }

    if (columnName === undefined || columnName === DefectChangeLogDataTableColumns.NewSeverity.name) {
      this.filter.quickFilters.newSeverities = this.quickFiltersList.newSeverity
        .filter(x => x.isChecked)
        .map(x => x.value);
      if (columnName !== undefined) {
        return;
      }
    }

    if (columnName === undefined || columnName === DefectChangeLogDataTableColumns.NewType.name) {
      this.filter.quickFilters.newTypes = this.quickFiltersList.newCategory
        .filter(x => x.isChecked)
        .map(x => x.value);
      if (columnName !== undefined) {
        return;
      }
    }

    if (columnName === undefined || columnName === DefectChangeLogDataTableColumns.Site.name) {
      this.filter.quickFilters.siteIds = this.quickFiltersList.site
        .filter(x => x.isChecked)
        .map(x => x.value);
      if (columnName !== undefined) {
        return;
      }
    }
  }

  getCheckedQuickFiltersModel(excludeQuickFilterColumnName?: string): DefectChangeLogsQuickFilterModel {
    const quickFilterModel = new DefectChangeLogsQuickFilterModel();

    if (this.appliedQuickFiltersColumnProps.hasOwnProperty(DefectChangeLogDataTableColumns.OriginalLayer.name) && excludeQuickFilterColumnName !== DefectChangeLogDataTableColumns.OriginalLayer.name) {
      quickFilterModel.originalLayers = this.filter.quickFilters.originalLayers;
    } else {
      quickFilterModel.originalLayers = null;
    }

    if (this.appliedQuickFiltersColumnProps.hasOwnProperty(DefectChangeLogDataTableColumns.OriginalSeverity.name) && excludeQuickFilterColumnName !== DefectChangeLogDataTableColumns.OriginalSeverity.name) {
      quickFilterModel.originalSeverities = this.filter.quickFilters.originalSeverities;
    } else {
      quickFilterModel.originalSeverities = null;
    }

    if (this.appliedQuickFiltersColumnProps.hasOwnProperty(DefectChangeLogDataTableColumns.OriginalType.name) && excludeQuickFilterColumnName !== DefectChangeLogDataTableColumns.OriginalType.name) {
      quickFilterModel.originalTypes = this.filter.quickFilters.originalTypes;
    } else {
      quickFilterModel.originalTypes = null;
    }

    if (this.appliedQuickFiltersColumnProps.hasOwnProperty(DefectChangeLogDataTableColumns.NewLayer.name) && excludeQuickFilterColumnName !== DefectChangeLogDataTableColumns.NewLayer.name) {
      quickFilterModel.newLayers = this.filter.quickFilters.newLayers;
    } else {
      quickFilterModel.newLayers = null;
    }

    if (this.appliedQuickFiltersColumnProps.hasOwnProperty(DefectChangeLogDataTableColumns.NewSeverity.name) && excludeQuickFilterColumnName !== DefectChangeLogDataTableColumns.NewSeverity.name) {
      quickFilterModel.newSeverities = this.filter.quickFilters.newSeverities;
    } else {
      quickFilterModel.newSeverities = null;
    }

    if (this.appliedQuickFiltersColumnProps.hasOwnProperty(DefectChangeLogDataTableColumns.NewType.name) && excludeQuickFilterColumnName !== DefectChangeLogDataTableColumns.NewType.name) {
      quickFilterModel.newTypes = this.filter.quickFilters.newTypes;
    } else {
      quickFilterModel.newTypes = null;
    }

    if (this.appliedQuickFiltersColumnProps.hasOwnProperty(DefectChangeLogDataTableColumns.Site.name) && excludeQuickFilterColumnName !== DefectChangeLogDataTableColumns.Site.name) {
      quickFilterModel.siteIds = this.filter.quickFilters.siteIds;
    } else {
      quickFilterModel.siteIds = null;
    }

    return quickFilterModel;
  }

  quickFilterSubmitted(columnName: string, quickFilterList: QuickFilterListItemModel[]) {
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
        console.log(checkedQuickFilters)
        this.defectChangeLogsService.getQuickFilters(checkedQuickFilters)
          .subscribe(data => {
            this.updateQuickFilterListOfAppliedFilters(data, key);
          });
      }
    }

    // Update quick filters list of non applied (non touched) qucik filters
    const checkedQuickFiltersModel = this.getCheckedQuickFiltersModel();
    this.defectChangeLogsService.getQuickFilters(checkedQuickFiltersModel)
      .subscribe(data => {
        this.updateQuickFilterListOfNonAppliedFilters(data);
        this.initializeQuickFiltersForTableFilterModel();
        this.filterTable(true);
      });
  }

  viewImage(row) {
    this.findingsService.getAnnotations(row['defectId']).subscribe(annotations => {
      this.images = annotations.images;
      if (this.images.length > 0) {
        this.image = annotations.images[0];
        window.open(`preview/image/${this.image.id}/${row['defectId']}`);
      }
    });
  }

  cancel(row) {
    this.defectChangeLogsService.cancelFinding(row).subscribe(annotations => {
      this.filterTable();
      const message = 'Defect has been successfully reset.';
      this.snackBar.open(message, '', { duration: 2000 });
    });
  }

  generateFindingChangeLogReport() {
    this.reportGeneratorService.reportGenerationStart().subscribe(taskId => {
      const dialog = this.dialog.open(ReportGenerationProgressDialogComponent, { disableClose: true });
      dialog.config.disableClose = true;
      dialog.componentInstance.taskId = taskId;
      dialog.componentInstance.downloadResponse = this.reportGeneratorService.generateFindingChangeLogReport(this.filter, taskId);
      dialog.componentInstance.onCloseEvent = () => {
        dialog.close();
      };
    });
  }
}
