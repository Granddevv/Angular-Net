import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Tag } from '../../../../models/tags/tag.model';

@Component({
  selector: 'app-preview-tag',
  templateUrl: './preview-tag.component.html',
  styleUrls: ['./preview-tag.component.scss']
})
export class PreviewTagComponent implements OnInit {
  public tag = new Tag();
  constructor() {
  }

  ngOnInit() { }
}