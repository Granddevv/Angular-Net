import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-image-video-preview',
  templateUrl: './image-video-preview.component.html',
  styleUrls: ['./image-video-preview.component.scss']
})
export class ImageVideoPreviewComponent implements OnInit {
  id: string;
  fileType: AnnouncementFileType;
  AnnouncementFileType = AnnouncementFileType;

  constructor(public dialogRef: MdDialogRef<ImageVideoPreviewComponent>) { }

  ngOnInit() {
  }

  close(){
    this.dialogRef.close();
  }
}

export enum AnnouncementFileType {
  Video = 1,
  Image = 2,
  Other = 3
}
