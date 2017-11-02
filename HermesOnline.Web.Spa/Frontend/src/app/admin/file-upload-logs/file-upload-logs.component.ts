import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FileUploadLogTableFilterModel, FileUploadLogTableRowModel } from '../../models/file-upload-logs/file-upload-logs.model';
import { FileUploadLogsService } from '../../services/data-services/file-upload-logs.service';

@Component({
  selector: 'app-file-upload-logs',
  templateUrl: './file-upload-logs.component.html',
  styleUrls: ['./file-upload-logs.component.scss'],
  providers: [FileUploadLogsService],
  encapsulation: ViewEncapsulation.None
})
export class FileUploadLogsComponent implements OnInit {
  columns = [];
  filter: FileUploadLogTableFilterModel;
  selected = [];
  limitPerPage = 15;
  count = 0;
  offset = 0;
  dataRows: FileUploadLogTableRowModel[] = [];

  constructor(private fileUploadLogsService: FileUploadLogsService) { }

  ngOnInit() {
    this.initializeColumns();
    this.filter = new FileUploadLogTableFilterModel();
    this.filterPage();
  }

  private initializeColumns() {
    this.columns = [
      { name: 'File Name', prop: 'fileName', sortable: false, resizeable: false },
      { name: 'Time', prop: 'time', sortable: false, resizeable: false },
      { name: 'Status', prop: 'status', sortable: false, resizeable: false }
    ]
  }

  filterPage() {
    this.fileUploadLogsService.filterTable(this.filter).subscribe(data => {
      this.dataRows = data.fileUploadLogTableRows;
      this.count = data.totalRecords;
    });
  }

  onPage(event) {
    this.filter.pageSize = event.pageSize;
    this.filter.pageIndex = event.offset;
    this.offset = event.offset;
    this.filterPage();
  }
}
