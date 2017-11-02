import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation, EventEmitter } from '@angular/core';
import { CustomFilterService } from '../../../../../services/data-services/custom-filters.service';
import { CustomFiltersTableRowModel, CustomFiltersTableFilterModel, CustomFilterModel } from '../../../../../models/custom-filters/custom-filters.model';
import { MdDialog, MdSnackBar, MdDialogRef } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../../../shared/confirmation-dialog/confirmation-dialog.component';
import { FindingsCustomFilterBuilderComponent } from '../findings-custom-filter-builder/findings-custom-filter-builder.component';
import { FindingsFilterManagerService } from '../../../../../services/common-services/findings-filter-manager.service';

@Component({
  selector: 'app-findings-custom-filter',
  templateUrl: './findings-custom-filter.component.html',
  styleUrls: ['./findings-custom-filter.component.scss'],
  providers: [CustomFilterService],
  encapsulation: ViewEncapsulation.None
})
export class FindingsCustomFilterComponent implements OnInit {

  public columns = [];
  public limitPerPage = 15;
  public count = 0;
  public offset = 0;
  public dataRows: CustomFiltersTableRowModel[] = [];
  public isCustomFilterApplied: boolean;
  filter: CustomFiltersTableFilterModel;
  appliedFilter: string;
  loadingIndicator: boolean;
  selected = [];

  @ViewChild('dateHeaderTemplate')
  dateHeaderTemplate: TemplateRef<any>;
  @ViewChild('actionsTemplate')
  actionsTemplate: TemplateRef<any>;
  @ViewChild('nameCellTemplate')
  nameCellTemplate: TemplateRef<any>;
  @ViewChild('nameHeaderTemplate')
  nameHeaderTemplate: TemplateRef<any>;
  @ViewChild('actionHeaderTemplate')
  actionHeaderTemplate: TemplateRef<any>;

  constructor(private customFilterService: CustomFilterService,
    public dialog: MdDialog,
    public dialogRef: MdDialogRef<FindingsCustomFilterComponent>,
    public snackBar: MdSnackBar,
    public findingsFilterManagerService: FindingsFilterManagerService) { }

  ngOnInit() {
    this.initializeColumns();
    this.filter = new CustomFiltersTableFilterModel();
    this.filterPage();
  }

  private initializeColumns() {
    this.columns = [
      { name: 'Date', headerTemplate: this.dateHeaderTemplate, sortable: true, resizeable: false },
      { name: 'Name', headerTemplate: this.nameHeaderTemplate, cellTemplate: this.nameCellTemplate, sortable: false, resizeable: false },
      { name: 'Actions', headerTemplate: this.actionHeaderTemplate, cellTemplate: this.actionsTemplate, sortable: false, resizeable: false }
    ]
  }

  public onPage(event) {
    this.filter.pageSize = event.pageSize;
    this.filter.pageIndex = event.offset;
    this.offset = event.offset;
    this.filterPage();
  }

  public onSort(event) {
    this.filter.sortProperty = event.sorts[0].prop;
    this.filter.sortDirection = event.sorts[0].dir === 'asc' ? 0 : 1;
    this.filterPage();
  }

  filterPage() {
    this.loadingIndicator = true;
    this.customFilterService.filterTable(this.filter).subscribe(data => {
      this.dataRows = data.customFiltersTableRows;
      this.count = data.totalRecords;
      setTimeout(() => { this.loadingIndicator = false; }, 1000);
      if (this.isCustomFilterApplied) {
        this.dataRows.forEach(x => {
          if (x.id === this.appliedFilter) {
            this.selected = [x];
          };
        });
      }
    });
  }

  delete(row) {
    let confirmDialog = this.dialog.open(ConfirmationDialogComponent);
    confirmDialog.componentInstance.title = 'Are you sure you want to delete custom filter?';
    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.customFilterService.delete(row['id']).subscribe(() => {
          this.filterPage();
          const message = 'Custom filter has been successfully deleted.';
          this.snackBar.open(message, '', { duration: 2000 });
        }
        );
      }
    });
  }

  public createNewDialog() {
    const dialog = this.dialog.open(FindingsCustomFilterBuilderComponent);
    dialog.afterClosed().subscribe(result => {
      this.filterPage();
    });
  };

  public edit(row) {
    this.customFilterService.getById(row['id']).subscribe((data) => {
      const dialog = this.dialog.open(FindingsCustomFilterBuilderComponent);
      dialog.componentInstance.model.id = data.id;
      dialog.componentInstance.model.name = data.name;
      dialog.componentInstance.model.values = JSON.parse(data.values);
      dialog.afterClosed().subscribe(result => {
        this.filterPage();
      });
    });
  }

  public apply(row) {
    this.findingsFilterManagerService.applyCustomFilter(row['id']);
    this.dialogRef.close(true);
  }

  public resetAppliedFilter() {
    this.findingsFilterManagerService.applyCustomFilter(null);
    this.dialogRef.close(false);
  }
}
