import { Component, OnInit, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { AlertDialogComponent } from '../../../shared/alert-dialog/alert-dialog.component';
import { MdDialog } from '@angular/material';
import { Tab } from '../../../models/manager-view/finding-overview/common/tab/tab';
import { ColumnVisibilityService } from '../../../services/common-services/column-visibility.service';
import { Tables } from '../../../models/manager-view/common/model/table-list';

@Component({
  selector: 'app-column-visibility',
  templateUrl: './column-visibility.component.html',
  styleUrls: ['./column-visibility.component.scss']
})
export class ColumnVisibilityComponent implements OnChanges, OnInit {
  @Input('tableName') tableName: Tables;

  public status: { isopen: boolean } = { isopen: false };
  public columns = [];
  public numOfSelectedColumns: number;

  constructor(private columnVisibilityService: ColumnVisibilityService, public dialog: MdDialog) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.columns = this.columnVisibilityService.getVisibleColumns(this.tableName);
    this.numOfSelectedColumns = this.getNumOfSelectedColumns();
  }

  onSelect(isChecked) {
    if (isChecked) {
      this.numOfSelectedColumns++;
    } else {
      this.numOfSelectedColumns--;
    }
  }

  isDisabled(column): boolean {
    if (column.name === 'Actions') {
      return true;
    } else if (column.checked) {
      return false;
    } else {
      return this.numOfSelectedColumns > 9;
    }
  }

  public save() {
    if (this.getNumOfSelectedColumns() > 10) {
      const dialog = this.dialog.open(AlertDialogComponent);
      dialog.componentInstance.title = 'Maximum number of selected columns can be 10!';
      dialog.afterClosed().subscribe(() => { this.status = { isopen: true }; });
    } else {
      this.columnVisibilityService.setVisibleColumns(this.tableName, this.columns);
    }
    this.status = { isopen: false };
  }

  getNumOfSelectedColumns(): number {
    let cnt = 0;
    this.columns.forEach(column => {
      cnt += column['checked'] ? 1 : 0;
    });
    return cnt;
  }
}
