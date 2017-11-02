// tslint:disable:max-line-length

import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MdDialogRef, MdDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import { EditUserManagmentComponent } from '../user-management/dialog/edit-user-managment/edit-user-managment.component';
import { MdSnackBar } from '@angular/material';
import { IQuickFilter } from '../../common/interface/quick-filter.interface';
import { UserManagementQuickFilterListModel, UserManagementQuickFilterModel } from '../../models/users-management/user-management-quick-filter-list.model';
import { UserManagementTableFilterModel, UserManagementTableRowModel, UserManagementTableModelConstants, UserManagementDataTableColumns } from '../../models/users-management/user-management-table.model';
import { QuickFilterListItemModel } from '../../models/common/quick-filter-list-item.model';
import { UserManagementService } from '../../services/data-services/user-management.service';
import { ReportGeneratorService } from '../../services/data-services/report-generator.service';
import { ReportGenerationProgressDialogComponent } from "../../manager-view/common/dialogs/report-generation-progress/report-generation-progress.component";

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  providers: [UserManagementService, ReportGeneratorService],
  encapsulation: ViewEncapsulation.None
})
export class UserManagementComponent implements OnInit, IQuickFilter<UserManagementQuickFilterListModel, UserManagementQuickFilterModel> {
  columns = [];
  quickFiltersList = new UserManagementQuickFilterListModel();
  filter: UserManagementTableFilterModel;
  limitPerPage = UserManagementTableModelConstants.dataTableSizePerPage;
  count = 0;
  offset = 0;
  user: UserManagementTableRowModel;
  dataRows: UserManagementTableRowModel[] = [];
  @ViewChild('statusTemplate') statusTemplate: TemplateRef<any>;
  @ViewChild('actionsTemplate') actionsTemplate: TemplateRef<any>;
  @ViewChild('statusHeaderTemplate') statusHeaderTemplate: TemplateRef<any>;
  @ViewChild('nameHeaderTemplate') nameHeaderTemplate: TemplateRef<any>;
  @ViewChild('emailHeaderTemplate') emailHeaderTemplate: TemplateRef<any>;
  @ViewChild('actionsHeaderTemplate') actionsHeaderTemplate: TemplateRef<any>;
  @ViewChild('groupHeaderTemplate') groupHeaderTemplate: TemplateRef<any>;
  @ViewChild('table') table: DatatableComponent;
  public searchValue: string;
  public searchControl = new FormControl();
  public isActive = true;
  public isInactive = true;
  public statusName = '2 of 2';
  public isopen: boolean;
  selectAllStatuses = true;
  isDisabled = false;
  appliedQuickFiltersColumnProps = {};
  loadingIndicator: boolean;

  constructor(private userManagementService: UserManagementService,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private reportGeneratorService: ReportGeneratorService)
  { }

  ngOnInit() {
    this.initializeColumns();
    this.filter = new UserManagementTableFilterModel();
    this.initializeSearchControl();
    this.prepareFiltersAndFilterTable();
    this.selectAllStatuses = true;
    this.isopen = false;
    this.filterTable();
  }

  delete(row: any) {
    let confirmDialog = this.dialog.open(ConfirmationDialogComponent);
    confirmDialog.componentInstance.title = `Are you sure you want to delete ${row['name']}?`;
    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.userManagementService.delete(row['id']).subscribe(() => {
          this.filterTable();
          const message = 'User has been successfully deleted.';
          this.snackBar.open(message, '', { duration: 2000 });
        }
        );
      }
    });
  }

  allowAccess(row: any) {
    let confirmDialog = this.dialog.open(ConfirmationDialogComponent);
    confirmDialog.componentInstance.title = `Are you sure you want to allow access for ${row['name']}?`;
    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.userManagementService.allowAccess(row['id']).subscribe(() => {
          this.filterTable();
          const message = 'You have successfully allowed access to user.';
          this.snackBar.open(message, '', { duration: 2000 });
        }
        );
      }
    });
  }

  revokeAccess(row: any) {
    let confirmDialog = this.dialog.open(ConfirmationDialogComponent);
    confirmDialog.componentInstance.title = `Are you sure you want to revoke access for ${row['name']}?`;
    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.userManagementService.revokeAccess(row['id']).subscribe(() => {
          this.filterTable();
          const message = 'You have successfully revoked access to user.';
          this.snackBar.open(message, '', { duration: 2000 });
        }
        );
      }
    });
  }

  statusChanged() {
    this.table.offset = 0;
    this.filter.pageIndex = 0;
    this.offset = 0;
    this.filter.statuses = [];
    if (this.isActive) {
      this.filter.statuses.push('active');
    };
    if (this.isInactive) {
      this.filter.statuses.push('inactive');
    }
    this.isopen = false;
    this.filterTable();
    this.statusName = `${this.filter.statuses.length} of 2`;
  }

  openDropdown() {
    this.isopen = true;
  }

  public change() {
    if (this.isActive === false && this.isInactive === false) {
      this.selectAllStatuses = false;
      this.isDisabled = true;
    }
    else if (this.isActive === true && this.isInactive === true) {
      this.selectAllStatuses = true;
      this.isDisabled = false;
    }
    else {
      this.selectAllStatuses = false;
      this.isDisabled = false;
    }
  }

  selecteAll() {
    this.table.offset = 0;
    this.filter.pageIndex = 0;
    this.offset = 0;
    this.filter.statuses = [];
    if (this.selectAllStatuses === false) {
      this.isActive = false;
      this.isInactive = false;
      this.selectAllStatuses = false
      this.filter.statuses.push('active');
      this.filter.statuses.push('inactive');;
      this.isDisabled = true;
      this.statusName = `0 of 2`;
    } else {
      this.isActive = true;
      this.isInactive = true;
      this.selectAllStatuses = true;
      this.isDisabled = false;
      this.filter.statuses.push('active');
      this.filter.statuses.push('inactive');
      this.statusName = `2 of 2`;
    }
  }

  onPage(event) {
    this.filter.pageSize = event.pageSize;
    this.filter.pageIndex = event.offset;
    this.offset = event.offset;
    this.filterTable();
  }

  onSort(event) {
    this.filter.sortProperty = event.sorts[0].prop;
    this.filter.sortDirection = event.sorts[0].dir === 'asc' ? 0 : 1;
    this.filterTable();
  }
  removingLastElemInPage(count: number): boolean {
    return (this.filter.pageIndex * this.filter.pageSize) === count;
  }

  private initializeColumns() {
    this.columns = [
      { name: UserManagementDataTableColumns.Name, prop: 'name', headerTemplate: this.nameHeaderTemplate, sortable: true, resizeable: false },
      { name: UserManagementDataTableColumns.Email, prop: 'email', headerTemplate: this.emailHeaderTemplate, sortable: true, resizeable: false },
      { name: UserManagementDataTableColumns.Status, prop: 'isActive', headerTemplate: this.statusHeaderTemplate, cellTemplate: this.statusTemplate, resizeable: false },
      { name: UserManagementDataTableColumns.Group, prop: 'groupName', headerTemplate: this.groupHeaderTemplate, sortable: true, resizeable: false },
      { name: UserManagementDataTableColumns.Actions, prop: 'action', headerTemplate: this.actionsHeaderTemplate, cellTemplate: this.actionsTemplate, resizeable: false }
    ];
  }

  initializeSearchControl() {
    this.searchValue = '';
    this.searchControl.valueChanges
      .debounceTime(600)
      .distinctUntilChanged()
      .subscribe(newValue => {
        this.filter.searchName = this.searchValue.toLocaleLowerCase();
        this.filter.pageIndex = 0;
        this.table.offset = 0;
        this.filterTable();
      });
  }

  edit(row) {
    let dialog = this.dialog.open(EditUserManagmentComponent);
    dialog.componentInstance.userManagementTableRowModel = new UserManagementTableRowModel(row['id'], row['email'], row['firstName'], row['lastName'], row['phoneNumber'], row['groupId'], row['isActive']);
    dialog.afterClosed().subscribe(() => {
      this.filterTable();
    });
  }

  prepareFiltersAndFilterTable() {
    this.userManagementService.getQuickFilters()
      .subscribe(data => {
        this.quickFiltersList = data;
        this.initializeQuickFiltersForTableFilterModel();
      });
  }

  initializeQuickFiltersForTableFilterModel(columnName?: string) {
    if (this.filter.quickFilters == null) {
      this.filter.quickFilters = new UserManagementQuickFilterModel();
    }

    if (columnName === undefined || columnName === UserManagementDataTableColumns.Group) {
      this.filter.quickFilters.groupIds = this.quickFiltersList.group
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
        this.userManagementService.getQuickFilters(checkedQuickFilters)
          .subscribe(data => {
            this.updateQuickFilterListOfAppliedFilters(data, key);
          });
      }
    }

    // Update quick filters list of non applied (non touched) qucik filters
    const checkedQuickFiltersModel = this.getCheckedQuickFiltersModel();
    this.userManagementService.getQuickFilters(checkedQuickFiltersModel)
      .subscribe(data => {
        this.updateQuickFilterListOfNonAppliedFilters(data);
        this.initializeQuickFiltersForTableFilterModel();
        this.filterTable(true);
      });
  }

  updateQuickFilterListOfNonAppliedFilters(data: UserManagementQuickFilterListModel) {
    if (!this.appliedQuickFiltersColumnProps.hasOwnProperty(UserManagementDataTableColumns.Group)) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.group.forEach(x => {
        const existingItem = this.quickFiltersList.group.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(x.isChecked, x.value, x.display));
        }
      });
      this.quickFiltersList.group = tmp;
    }
  }

  updateQuickFilterListOfAppliedFilters(data: UserManagementQuickFilterListModel, columnName: string) {
    if (columnName === UserManagementDataTableColumns.Group) {
      const tmp = new Array<QuickFilterListItemModel>();
      data.group.forEach(x => {
        const existingItem = this.quickFiltersList.group.filter(y => y.display === x.display);
        if (existingItem.length > 0) {
          tmp.push(existingItem[0]);
        } else {
          tmp.push(new QuickFilterListItemModel(false, x.value, x.display));
        }
      });
      this.quickFiltersList.group = tmp;
      return;
    }
  }

  getCheckedQuickFiltersModel(excludeQuickFilterColumnName?: string): UserManagementQuickFilterModel {
    const quickFilterModel = new UserManagementQuickFilterModel();

    if (this.appliedQuickFiltersColumnProps.hasOwnProperty(UserManagementDataTableColumns.Group)
      && excludeQuickFilterColumnName !== UserManagementDataTableColumns.Group) {
      quickFilterModel.groupIds = this.filter.quickFilters.groupIds;
    } else {
      quickFilterModel.groupIds = null;
    }
    return quickFilterModel;
  }

  filterTable(resetPage = false) {
    this.loadingIndicator = true;
    if (resetPage) {
      this.filter.pageIndex = 0;
      this.table.offset = 0;
    }
    this.userManagementService.filterTable(this.filter)
      .subscribe(
      data => {
        if (data.userManagmentTableRows.length > 0 && this.removingLastElemInPage(data.totalRecords)) {
          this.offset--;
          this.table.offset--;
        }

        this.dataRows = data.userManagmentTableRows;
        this.count = data.totalRecords;
        setTimeout(() => { this.loadingIndicator = false; }, 1000);
      });
  }

  generateUserListReport() {
    this.reportGeneratorService.reportGenerationStart().subscribe(taskId => {
      const dialog = this.dialog.open(ReportGenerationProgressDialogComponent, { disableClose: true });
      dialog.config.disableClose = true;
      dialog.componentInstance.taskId = taskId;
      dialog.componentInstance.downloadResponse = this.reportGeneratorService.generateUserListReport(this.filter, taskId);
      dialog.componentInstance.onCloseEvent = () => {
        dialog.close();
      };
    });
  }
}
