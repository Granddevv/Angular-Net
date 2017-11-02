import { Component, OnInit, NgZone, Inject, EventEmitter, ViewChildren, ElementRef, ViewChild } from '@angular/core';
import { MdDialogRef, MdSnackBar } from '@angular/material';
import { NgUploaderOptions, UploadedFile } from '../../../../../custom_node_modules/ngx-uploader/src/classes/index';
import { AuthConstants } from '../../../../common/constants/auth.constants';
import { Announcement } from '../../../../models/announcements/announcements.model';
import { AnnouncementsService } from '../../../../services/data-services/announcements.service';
import { BaseDialog } from '../../../../common/component-framework/base-dialog';

@Component({
  selector: 'app-create-announcements',
  templateUrl: './create-announcements.component.html',
  styleUrls: ['./create-announcements.component.scss'],
  providers: [AnnouncementsService]
})
export class CreateAnnouncementsComponent extends BaseDialog implements OnInit {
  options: NgUploaderOptions;
  response: any;
  fileName: '';
  inputUploadEvents: EventEmitter<string>;
  @ViewChild('fileInput') fileInput: ElementRef;
  descriptionExcededMaxCharacters = false;
  announcement = new Announcement();
  showTitleError: boolean;
  isSubmitted: boolean;
  showDescriptionError: boolean;

  constructor( @Inject(NgZone) private zone: NgZone,
    public dialogRef: MdDialogRef<CreateAnnouncementsComponent>,
    private announcementsService: AnnouncementsService,
    public snackBar: MdSnackBar) {
    super();
    this.inputUploadEvents = new EventEmitter<string>();
  }

  ngOnInit() {
    this.options = new NgUploaderOptions({
      url: '/api/announcement/create',
      autoUpload: false,
      customHeaders: {
        'Authorization': `Bearer ${localStorage.getItem(AuthConstants.tokenLocalStorage)}`,
        maxUploads: 1
      }
    });
  }

  sendData() {
    this.loading = true;
    if (this.announcement.description.length > 1500) {
      this.descriptionExcededMaxCharacters = true;
      return;
    }
    this.isSubmitted = true;
    this.options.data.id = this.announcement.id;
    this.options.data.title = this.announcement.title;
    this.options.data.description = this.announcement.description;
    this.options.data.fileName = this.announcement.fileName;
    this.inputUploadEvents.emit('startUpload');
  }

  handlePreviewData(data: any) {
    this.announcement.fileName = this.fileInput.nativeElement.files[0] !== null ? this.fileInput.nativeElement.files[0].name : '';
  }

  onUpload(data: UploadedFile) {
    setTimeout(() => {
      this.zone.run(() => {
        if (data && data.status) {
          if (data.status === 200) {
            this.loading = false;
            this.dialogRef.close();
            const message = 'Your announcement has been submitted!';
            this.snackBar.open(message, '', { duration: 2000 });
          } else {
            alert(data.response);
          }
        }
      });
    });
  }

  focusoutTitle() {
    if (this.announcement.title === '') {
      this.showTitleError = true;
    }
  }

  focusTitle() {
    this.showTitleError = false;
  }

  focusoutDescription() {
    if (this.announcement.description === '') {
      this.showDescriptionError = true;
    }

    this.descriptionExcededMaxCharacters = this.announcement.description.length > 1500;
  }

  focusDescription() {
    this.showDescriptionError = false;
  }

  removeFile() {
    this.announcement.fileName = '';
    this.fileInput.nativeElement.value = '';
  }
}
