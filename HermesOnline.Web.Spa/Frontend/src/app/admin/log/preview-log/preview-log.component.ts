import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Log} from '../../../models/logs/log.model';

@Component({
  selector: 'app-preview-log',
  templateUrl: './preview-log.component.html',
  styleUrls: ['./preview-log.component.scss']
})
export class PreviewLogComponent implements OnInit {
  public log = new Log();
  constructor() {
  }

  ngOnInit() { }
}