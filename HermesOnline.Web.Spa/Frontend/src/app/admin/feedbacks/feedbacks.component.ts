// tslint:disable:max-line-length

import { Component, OnInit, ViewEncapsulation, ViewChild, TemplateRef, EventEmitter, Input, Output } from '@angular/core';
import { MdDialogRef, MdDialog } from '@angular/material';
import { CreateCommentComponent } from './dialogs/create-comment/create-comment.component';
import { CreateAnnouncementsComponent } from '../announcements/dialogs/create-announcements/create-announcements.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { PreviewFeedbackComponent } from '../feedbacks/dialogs/preview-feedback/preview-feedback.component';
import { IQuickFilter } from '../../common/interface/quick-filter.interface';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { DownloadHelper } from '../../common/helpers/download.helper';
import { Announcement } from '../../models/announcements/announcements.model';
import { FeedbackQuickFilterListModel, FeedbackQuickFilterModel } from '../../models/feedbacks/feedback-quick-filter-list.model';
import { FeedbacksTableFilterModel, FeedbacksTableRowModel, FeedbackDataTableColumns, Feedback, FeedbackStatus } from '../../models/feedbacks/feedbacks.model';
import { QuickFilterListItemModel } from '../../models/common/quick-filter-list-item.model';
import { FeedbacksService } from '../../services/data-services/feedbacks.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss'],
  providers: [FeedbacksService],
  encapsulation: ViewEncapsulation.None
})

export class FeedbacksComponent implements OnInit, IQuickFilter<FeedbackQuickFilterListModel, FeedbackQuickFilterModel> {
  quickFiltersList = new FeedbackQuickFilterListModel();
  columns = [];

  @Input()
  filter: FeedbacksTableFilterModel;

  @Output()
  selected = [];
  limitPerPage = 15;
  count = 0;
  offset = 0;
  dataRows: FeedbacksTableRowModel[] = [];
  @ViewChild('actionsTemplate') actionsTemplate: TemplateRef<any>;
  @ViewChild('descriptionTemplate') descriptionTemplate: TemplateRef<any>;
  @ViewChild('commentTemplate') commentTemplate: TemplateRef<any>;
  @ViewChild('urlTemplate') urlTemplate: TemplateRef<any>;
  @ViewChild('fileTemplate') fileTemplate: TemplateRef<any>;
  @ViewChild('table') table: DatatableComponent;
  @ViewChild('typeHeaderTemplate') typeHeaderTemplate: TemplateRef<any>;
  @ViewChild('categoryHeaderTemplate') categoryHeaderTemplate: TemplateRef<any>;
  @ViewChild('statusHeaderTemplate') statusHeaderTemplate: TemplateRef<any>;
  @ViewChild('dateHeaderTemplate') dateHeaderTemplate: TemplateRef<any>;
  @ViewChild('userHeaderTemplate') userHeaderTemplate: TemplateRef<any>;
  @ViewChild('descriptionHeaderTemplate') descriptionHeaderTemplate: TemplateRef<any>;
  @ViewChild('fileHeaderTemplate') fileHeaderTemplate: TemplateRef<any>;
  @ViewChild('actionHeaderTemplate') actionHeaderTemplate: TemplateRef<any>;
  @ViewChild('commentHeaderTemplate') commentHeaderTemplate: TemplateRef<any>;
  @ViewChild('urlHeaderTemplate') urlHeaderTemplate: TemplateRef<any>;
  @ViewChild('userTemplate') userTemplate: TemplateRef<any>;
  FeedbackStatus = FeedbackStatus;
  appliedQuickFiltersColumnProps = {};
  public searchValue: string;
  public searchControl = new FormControl();
  loadingIndicator: boolean;

  constructor(private feedbacksService: FeedbacksService, public dialog: MdDialog) { }

  ngOnInit() {
    this.initializeColumns();
    this.filter = new FeedbacksTableFilterModel();
    this.initializeSearchControl();
    this.prepareFiltersAndFilterTable();
    this.filterTable();
  }

  private initializeColumns() {
    this.columns = [
      { name: FeedbackDataTableColumns.Date, headerTemplate: this.dateHeaderTemplate, prop: 'date', sortable: true, resizeable: false },
      { name: FeedbackDataTableColumns.User, headerTemplate: this.userHeaderTemplate, cellTemplate: this.userTemplate, prop: 'user', sortable: true, resizeable: false },
      { name: FeedbackDataTableColumns.Type, headerTemplate: this.typeHeaderTemplate, prop: 'type', sortable: true, resizeable: false },
      { name: FeedbackDataTableColumns.Category, headerTemplate: this.categoryHeaderTemplate, prop: 'category', sortable: true, resizeable: false },
      { name: FeedbackDataTableColumns.Description, prop: 'description', cellTemplate: this.descriptionTemplate, headerTemplate: this.descriptionHeaderTemplate, sortable: false, resizeable: false },
      { name: FeedbackDataTableColumns.File, prop: 'fileName', cellTemplate: this.fileTemplate, headerTemplate: this.fileHeaderTemplate, sortable: false, resizeable: false },
      { name: FeedbackDataTableColumns.Status, headerTemplate: this.statusHeaderTemplate, prop: 'status', sortable: true, Type: this.FeedbackStatus, resizeable: false },
      { name: FeedbackDataTableColumns.Comment, cellTemplate: this.commentTemplate, headerTemplate: this.commentHeaderTemplate, prop: 'comment', sortable: false, resizeable: false },
      { name: FeedbackDataTableColumns.Url, cellTemplate: this.urlTemplate, headerTemplate: this.urlHeaderTemplate, prop: 'url', sortable: false, resizeable: false },
      { name: FeedbackDataTableColumns.Actions, cellTemplate: this.actionsTemplate, headerTemplate: this.actionHeaderTemplate, sortable: false, resizeable: false }
    ];
  }

  public onSort(event) {
    this.filter.sortProperty = event.sorts[0].prop;
    this.filter.sortDirection = event.sorts[0].dir === 'asc' ? 0 : 1;
    this.filterTable();
  }

  public onPage(event) {
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
    this.feedbacksService.filterTable(this.filter)
      .subscribe(
      data => {
        if (this.table && this.table.offset > 0 && data.feedbacksTableRows.length > 0 && this.isOneElementLeftOnLastPage(data.totalRecords)) {
          this.offset--;
          this.table.offset--;
        }
        this.dataRows = data.feedbacksTableRows;
        this.count = data.totalRecords;
        setTimeout(() => { this.loadingIndicator = false; }, 1000);
      });
  }

  public reject(row) {
    const dialog = this.dialog.open(CreateCommentComponent);
    dialog.componentInstance.feedback.id = row['id'];
    dialog.afterClosed().subscribe(() => {
      this.filterTable();
    });
  }

  public resolve(row) {
    const confirmDialog = this.dialog.open(ConfirmationDialogComponent);
    confirmDialog.componentInstance.title = 'Do you want to make an announcement regarding this resolved feedback?';
    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        const dialog = this.dialog.open(CreateAnnouncementsComponent);
        dialog.componentInstance.announcement = new Announcement('', '', row['description']);
        dialog.afterClosed().subscribe(() => {
          this.feedbacksService.addAnnouncementForFeedback(row['id']).subscribe(() => {
          });
          this.filterTable();
        });
      }
    });
  }

  public view(row) {
    const dialog = this.dialog.open(PreviewFeedbackComponent);
    dialog.componentInstance.feedback = new Feedback(row['id'], '', row['description'], row['fileName'], row['comment'], row['type'], row['user'], '', row['url']);
  }

  isOneElementLeftOnLastPage(totalRecordsCount: number): boolean {
    return (this.filter.pageIndex * this.filter.pageSize) === totalRecordsCount;
  }

  prepareFiltersAndFilterTable() {
    this.feedbacksService.getQuickFilters()
      .subscribe(data => {
        this.quickFiltersList = data;
        this.initializeQuickFiltersForTableFilterModel();
      });
  }

  initializeQuickFiltersForTableFilterModel(columnName?: string) {
    if (this.filter.quickFilters == null) {
      this.filter.quickFilters = new FeedbackQuickFilterModel();
    }

    if (columnName === undefined || columnName === FeedbackDataTableColumns.Type) {
      this.filter.quickFilters.types = this.quickFiltersList.type
        .filter(x => x.isChecked)
        .map(x => x.value);
      if (columnName !== undefined) {
        return;
      }
    }

    if (columnName === undefined || columnName === FeedbackDataTableColumns.Category) {
      this.filter.quickFilters.categories = this.quickFiltersList.category
        .filter(x => x.isChecked)
        .map(x => x.value);
      if (columnName !== undefined) {
        return;
      }
    }

    if (columnName === undefined || columnName === FeedbackDataTableColumns.Status) {
      this.filter.quickFilters.statuses = this.quickFiltersList.status
        .filter(x => x.isChecked)
        .map(x => x.value);
      if (columnName !== undefined) {
        return;
      }
    }
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
        this.feedbacksService.getQuickFilters(checkedQuickFilters)
          .subscribe(data => {
            this.updateQuickFilterListOfAppliedFilters(data, key);
          });
      }
    }

    // Update quick filters list of non applied (non touched) qucik filters
    const checkedQuickFiltersModel = this.getCheckedQuickFiltersModel();
    this.feedbacksService.getQuickFilters(checkedQuickFiltersModel)
      .subscribe(data => {
        this.updateQuickFilterListOfNonAppliedFilters(data);
        this.initializeQuickFiltersForTableFilterModel();
        this.filterTable(true);
      });
  }

  updateQuickFilterListOfNonAppliedFilters(data: FeedbackQuickFilterListModel) {
    if (!this.appliedQuickFiltersColumnProps.hasOwnProperty(FeedbackDataTableColumns.Type)) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.type.forEach(x => {
        const existingItem = this.quickFiltersList.type.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(x.isChecked, x.value, x.display));
        }
      });
      this.quickFiltersList.type = tmp;
    }

    if (!this.appliedQuickFiltersColumnProps.hasOwnProperty(FeedbackDataTableColumns.Category)) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.category.forEach(x => {
        const existingItem = this.quickFiltersList.category.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(x.isChecked, x.value, x.display));
        }
      });
      this.quickFiltersList.category = tmp;
    }

    if (!this.appliedQuickFiltersColumnProps.hasOwnProperty(FeedbackDataTableColumns.Status)) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.status.forEach(x => {
        const existingItem = this.quickFiltersList.status.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(x.isChecked, x.value, x.display));
        }
      });
      this.quickFiltersList.status = tmp;
    }
  }

  updateQuickFilterListOfAppliedFilters(data: FeedbackQuickFilterListModel, columnName: string) {
    if (columnName === FeedbackDataTableColumns.Type) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.type.forEach(x => {
        const existingItem = this.quickFiltersList.type.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(false, x.value, x.display));
        }
      });
      this.quickFiltersList.type = tmp;
      return;
    }

    if (columnName === FeedbackDataTableColumns.Category) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.category.forEach(x => {
        const existingItem = this.quickFiltersList.category.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(false, x.value, x.display));
        }
      });
      this.quickFiltersList.category = tmp;
      return;
    }

    if (columnName === FeedbackDataTableColumns.Status) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.status.forEach(x => {
        const existingItem = this.quickFiltersList.status.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(false, x.value, x.display));
        }
      });
      this.quickFiltersList.status = tmp;
      return;
    }
  }

  getCheckedQuickFiltersModel(excludeQuickFilterColumnName?: string): FeedbackQuickFilterModel {
    const quickFilterModel = new FeedbackQuickFilterModel();

    if (this.appliedQuickFiltersColumnProps.hasOwnProperty(FeedbackDataTableColumns.Type)
      && excludeQuickFilterColumnName !== FeedbackDataTableColumns.Type) {
      quickFilterModel.types = this.filter.quickFilters.types;
    } else {
      quickFilterModel.types = null;
    }

    if (this.appliedQuickFiltersColumnProps.hasOwnProperty(FeedbackDataTableColumns.Category)
      && excludeQuickFilterColumnName !== FeedbackDataTableColumns.Category) {
      quickFilterModel.categories = this.filter.quickFilters.categories;
    } else {
      quickFilterModel.categories = null;
    }

    if (this.appliedQuickFiltersColumnProps.hasOwnProperty(FeedbackDataTableColumns.Status)
      && excludeQuickFilterColumnName !== FeedbackDataTableColumns.Status) {
      quickFilterModel.statuses = this.filter.quickFilters.statuses;
    } else {
      quickFilterModel.statuses = null;
    }
    return quickFilterModel;
  }

  public downloadFile(row) {
    const response = this.feedbacksService.downloadAttachment(row['id']);
    DownloadHelper.downloadFileFromResponse(response);
  }

  initializeSearchControl() {
    this.searchValue = '';
    this.searchControl.valueChanges
      .debounceTime(600)
      .distinctUntilChanged()
      .subscribe(newValue => {
        this.filter.searchUser = this.searchValue.toLocaleLowerCase();
        this.filter.pageIndex = 0;
        this.table.offset = 0;
        this.filterTable();
      });
  }
}
