// tslint:disable:max-line-length

import { Component, OnInit, ViewEncapsulation, ViewChild, TemplateRef, EventEmitter, Output } from '@angular/core';
import { MdDialogRef, MdDialog } from '@angular/material';
import { PreviewLogComponent } from './preview-log/preview-log.component';
import { LogTableFilterModel, LogTableRowModel } from '../../models/logs/log.model';
import { LogService } from '../../services/data-services/log.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
  providers: [LogService],
  encapsulation: ViewEncapsulation.None
})
export class LogComponent implements OnInit {
  columns = [];
  @Output()
  rowSelected = new EventEmitter();
  filter: LogTableFilterModel;
  selected = [];
  limitPerPage = 15;
  count = 0;
  offset = 0;
  dataRows: LogTableRowModel[] = [];
  loadingIndicator: boolean;

  @ViewChild('typeTemplate') typeTemplate: TemplateRef<any>;
  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;

  constructor(private logService: LogService, public dialog: MdDialog) { }

  ngOnInit() {
    this.initializeColumns();
    this.filter = new LogTableFilterModel();
    this.filterPage();
  }

  private initializeColumns() {
    this.columns = [
      { name: 'Host', prop: 'host', sortable: false, width: 70, resizeable: false },
      { name: 'Code', prop: 'code', sortable: false, width: 25, resizeable: false },
      { name: 'Type', prop: 'type', sortable: false, width: 200, cellTemplate: this.typeTemplate, resizeable: false },
      { name: 'Error', prop: 'error', sortable: false, width: 200, cellTemplate: this.errorTemplate, resizeable: false },
      { name: 'User', prop: 'user', sortable: false, width: 200, resizeable: false },
      { name: 'Date', prop: 'date', sortable: false, width: 50, resizeable: false }
    ];
  }

  public onPage(event) {
    this.filter.pageSize = event.pageSize;
    this.filter.pageIndex = event.offset;
    this.offset = event.offset;
    this.filterPage();
  }

  filterPage() {
    this.loadingIndicator = true;
    this.logService.filterTable(this.filter).subscribe(data => {
      this.dataRows = data.logTableRows;
      this.count = data.totalRecords;
      setTimeout(() => { this.loadingIndicator = false; }, 1000);
    });
  }

  public onSelect({ selected }) {
    this.logService.getError(selected[0].id).subscribe(response => {
      const dialog = this.dialog.open(PreviewLogComponent);
      dialog.componentInstance.log = response;
    });
  }
}
