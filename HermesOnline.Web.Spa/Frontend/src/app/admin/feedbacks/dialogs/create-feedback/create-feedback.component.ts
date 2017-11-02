import { Component, OnInit, NgZone, Inject, EventEmitter, ViewChildren, ElementRef, ViewChild } from '@angular/core';
import { MdDialogRef, MdDialog } from '@angular/material';
import { NgUploaderOptions, UploadedFile } from '../../../../../custom_node_modules/ngx-uploader/src/classes/index';
import { AuthConstants } from '../../../../common/constants/auth.constants';
import { ConfirmationDialogComponent } from '../../../../shared/confirmation-dialog/confirmation-dialog.component';
import { CreateFeedbackTypeComponent } from '../create-feedback-type/create-feedback-type.component';
import { MdSnackBar } from '@angular/material';
import { Feedback } from '../../../../models/feedbacks/feedbacks.model';
import { FeedbacksService } from '../../../../services/data-services/feedbacks.service';
import { Router } from '@angular/router';
import { BaseDialog } from '../../../../common/component-framework/base-dialog';

@Component({
  selector: 'app-create-feedback',
  templateUrl: './create-feedback.component.html',
  styleUrls: ['./create-feedback.component.scss'],
  providers: [FeedbacksService]
})
export class CreateFeedbackComponent extends BaseDialog implements OnInit {
  options: NgUploaderOptions;
  response: any;
  fileName: '';
  inputUploadEvents: EventEmitter<string>;
  @ViewChild('fileInput') fileInput: ElementRef;
  descriptionExcededMaxCharacters = false;
  feedback = new Feedback();
  showTitleError: boolean;
  showDescriptionError: boolean;
  isSubmitted: boolean;
  public categoryList = [];
  loading = false;

  constructor( @Inject(NgZone) private zone: NgZone,
    public dialogRef: MdDialogRef<CreateFeedbackComponent>,
    public dialog: MdDialog,
    private feedbacksService: FeedbacksService,
    public snackBar: MdSnackBar,
    private router: Router) {
    super();
    this.inputUploadEvents = new EventEmitter<string>();
  }

  ngOnInit() {
    this.options = new NgUploaderOptions({
      url: `/api/feedback/create`,
      autoUpload: false,
      customHeaders: {
        'Authorization': `Bearer ${localStorage.getItem(AuthConstants.tokenLocalStorage)}`,
        maxUploads: 1
      }
    });
    this.feedbacksService.getFeedbackCategory().subscribe(result => {
      this.categoryList = result;
    });
  }

  sendData() {
    this.loading = true;
    if (this.feedback.description.length > 4000) {
      this.descriptionExcededMaxCharacters = true;
      return;
    }
    this.options.data.link = this.router.url;
    this.isSubmitted = true;
    this.options.data.id = this.feedback.id;
    this.options.data.type = this.feedback.type;
    this.options.data.description = this.feedback.description;
    this.options.data.category = this.feedback.category;
    this.options.data.status = this.feedback.status;
    this.options.data.fileName = this.feedback.fileName;
    this.options.data.notificationOfStatus = this.feedback.notificationOfStatus;
    this.inputUploadEvents.emit('startUpload');
  }

  handlePreviewData(data: any) {
    this.feedback.fileName = this.fileInput.nativeElement.files[0] !== null ? this.fileInput.nativeElement.files[0].name : '';
  }

  onUpload(data: UploadedFile) {
    setTimeout(() => {
      this.zone.run(() => {
        if (data && data.status) {
          if (data.status === 200) {
            this.dialogRef.close();
            const message = 'Your feedback has been submitted!';
            this.loading = false;
            this.snackBar.open(message, '', { duration: 2000 });
          } else {
            alert(data.response);
          }
        }
      });
    });
  }

  focusoutDescription() {
    if (this.feedback.description === '') {
      this.showDescriptionError = true;
    }
  }

  focusDescription() {
    this.showDescriptionError = false;
  }

  focusCategory() {
    this.showDescriptionError = false;
  }

  removeFile() {
    this.feedback.fileName = '';
    this.fileInput.nativeElement.value = '';
  }
}