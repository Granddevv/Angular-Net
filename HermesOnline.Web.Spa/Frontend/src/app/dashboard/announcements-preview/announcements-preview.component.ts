import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AnnouncementsTableRowModel } from '../../models/announcements/announcements.model';
import { DownloadHelper } from '../../common/helpers/download.helper';
import { AnnouncementsService } from '../../services/data-services/announcements.service';
import { AnnouncementFileType, ImageVideoPreviewComponent } from './dialogs/image-video-preview.component';
import { MdDialog } from '@angular/material';

@Component({
  selector: 'app-announcements-preview',
  templateUrl: './announcements-preview.component.html',
  styleUrls: ['./announcements-preview.component.scss'],
  providers: [AnnouncementsService],
  encapsulation: ViewEncapsulation.None,
})
export class AnnouncementsPreviewComponent implements OnInit {
  public announcements: Array<AnnouncementsTableRowModel>;
  public AnnouncementFileType = AnnouncementFileType;
  private imageFormats = ['jpg', 'jpeg', 'bmp', 'gif', 'png'];
  private videoFormats = ['mp4', 'webm', 'ogg'];
  interval = 5000;

  constructor(
    private announcementsService: AnnouncementsService,
    private dialog: MdDialog) {
    this.announcements = new Array<AnnouncementsTableRowModel>();
  }

  ngOnInit() {
    this.announcementsService.getLatest().subscribe(announcements => {
      this.announcements = announcements;
    });
  }

  downloadAnnouncement(announcementId: string) {
    const response = this.announcementsService.downloadAttachment(announcementId);
    DownloadHelper.downloadFileFromResponse(response);
  }

  isVideo(fileName: string): boolean {
    const extension = this.getFileExtension(fileName);
    return this.videoFormats.indexOf(extension) >= 0;
  }

  isImage(fileName: string): boolean {
    const extension = this.getFileExtension(fileName);
    return this.imageFormats.indexOf(extension) >= 0;
  }

  preview(id: string, fileType: AnnouncementFileType) {
    const dialogRef = this.dialog.open(ImageVideoPreviewComponent);
    dialogRef.componentInstance.id = id;
    dialogRef.componentInstance.fileType = fileType;
    this.interval = -1;
    dialogRef.afterClosed().subscribe(() => {
      this.interval = 5000;
    });
  }

  private getFileExtension(fileName: string): string {
    const arr = fileName.split('.');
    return arr[arr.length - 1];
  }
}
