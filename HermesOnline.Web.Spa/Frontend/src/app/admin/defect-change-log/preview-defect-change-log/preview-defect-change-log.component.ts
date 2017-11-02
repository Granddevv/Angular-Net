import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { DefectChangeLogsTableRowModel } from '../../../models/manager-view/finding-overview/common/findings/findings-change-log.model';

@Component({
  selector: 'app-preview-defect-change-log',
  templateUrl: './preview-defect-change-log.component.html',
  styleUrls: ['./preview-defect-change-log.component.scss']
})
export class PreviewDefectChangeLogComponent implements OnInit {
  public defectChangeLog = new DefectChangeLogsTableRowModel();
  constructor() {
  }

  ngOnInit() { }
}