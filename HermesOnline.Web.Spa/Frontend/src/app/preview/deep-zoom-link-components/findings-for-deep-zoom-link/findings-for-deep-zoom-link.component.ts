// tslint:disable:max-line-length

import { Component, OnInit, ViewChild, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ActivatedRoute, Router } from '@angular/router';
import { Surface } from '../../../models/manager-view/common/model/surface';
import { FindingsForDeepZoomLinksDataTableFilterModel, FindingsForDeepZoomLinksDataTableRowModel, FindingsForDeepZoomLinksDataTableConstants, FindingsForDeepZoomLinksDataTableColumns } from '../../../models/preview/findings-for-deep-zoom-link.model';
import { FindingsDataTableService } from '../../../services/data-services/findings-data-table.service';
import { DeepZoomLinkPreviewManagerService } from '../../../services/common-services/deep-zoom-link-preview-manger.service';

@Component({
  selector: 'app-findings-for-deep-zoom-link',
  templateUrl: './findings-for-deep-zoom-link.component.html',
  styleUrls: ['./findings-for-deep-zoom-link.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FindingsForDeepZoomLinkComponent implements OnInit {

  @ViewChild('table')
  table: DatatableComponent;

  @Input()
  bladeId: string;
  @Input()
  surface: Surface;
  @Input()
  inspectionId: string;

  @Output()
  selectedChanged = new EventEmitter();

  filter: FindingsForDeepZoomLinksDataTableFilterModel;
  columns = [];
  dataRows: FindingsForDeepZoomLinksDataTableRowModel[] = [];
  selected = [];
  limitPerPage = FindingsForDeepZoomLinksDataTableConstants.dataTableSizePerPage;
  count = 0;
  offset = 0;

  constructor(
    private activeRoute: ActivatedRoute,
    private findingsDataTableService: FindingsDataTableService,
    private deepZoomLinkPreviewManagerService: DeepZoomLinkPreviewManagerService) {

  }

  ngOnInit() {
    this.initializeColumns();
    this.filter = new FindingsForDeepZoomLinksDataTableFilterModel(this.bladeId, this.surface, this.inspectionId);
    this.filterTable();
    this.deepZoomLinkPreviewManagerService.annotationSelected.subscribe(selectedFindingId => {
      if (selectedFindingId != null) {
        const selectedRow = this.dataRows.filter(x => x.id === selectedFindingId)[0];
        if (selectedRow) {
          this.selected[0] = selectedRow;
          this.onSelect({ selected: this.selected });
        }
      }
    });
  }

  filterTable() {
    this.findingsDataTableService.filterFindingsForDeepZoomLinkTable(this.filter)
      .subscribe(data => {
        if (this.table && this.table.offset > 0 && data.findingsTableRows.length > 0 && this.isOneElementLeftOnLastPage(data.totalRecords)) {
          this.offset--;
          this.table.offset--;
        }

        this.dataRows = data.findingsTableRows;
        this.count = data.totalRecords;
      });
  }

  isOneElementLeftOnLastPage(totalRecordsCount: number): boolean {
    return (this.filter.pageIndex * this.filter.pageSize) === totalRecordsCount;
  }

  onPage(event) {
    this.filter.pageSize = this.limitPerPage;
    this.filter.pageIndex = event.page - 1;
    this.selected = [];
    this.filterTable();
  }

  onSort(event) {
    this.filter.sortProperty = event.sorts[0].prop;
    this.filter.sortDirection = event.sorts[0].dir === 'asc' ? 0 : 1;
    this.filterTable();
  }

  onSelect({ selected }) {
    this.selectedChanged.emit(selected[0]);
  }

  private initializeColumns() {
    this.columns = [
      { name: FindingsForDeepZoomLinksDataTableColumns.SerialNumber, prop: 'serialNumber' },
      { name: FindingsForDeepZoomLinksDataTableColumns.Name, prop: 'name' },
      { name: FindingsForDeepZoomLinksDataTableColumns.Severity, prop: 'severity', width: 50 },
      { name: FindingsForDeepZoomLinksDataTableColumns.R, prop: 'distanceToRoot', width: 70 },
      { name: FindingsForDeepZoomLinksDataTableColumns.L, prop: 'lengthMm', width: 70 },
      { name: FindingsForDeepZoomLinksDataTableColumns.A, prop: 'areaMm2' },
    ];
  }
}
