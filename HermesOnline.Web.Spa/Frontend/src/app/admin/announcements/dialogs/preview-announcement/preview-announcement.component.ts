import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Announcement } from '../../../../models/announcements/announcements.model';


@Component({
  selector: 'app-preview-announcement',
  templateUrl: './preview-announcement.component.html',
  styleUrls: ['./preview-announcement.component.scss']
})
export class PreviewAnnouncementComponent implements OnInit {
  public announcement = new Announcement();
  constructor() {
  }

  ngOnInit() { }
}