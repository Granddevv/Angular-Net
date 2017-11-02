import { Component, OnInit } from '@angular/core';
import { MdDialogRef, MdDialog } from '@angular/material';
import { CreateFeedbackComponent } from '../create-feedback/create-feedback.component';
import { Feedback, FeedbackType } from '../../../../models/feedbacks/feedbacks.model';
import { FeedbacksService } from '../../../../services/data-services/feedbacks.service';

@Component({
  selector: 'app-create-feedback-type',
  templateUrl: './create-feedback-type.component.html',
  styleUrls: ['./create-feedback-type.component.scss'],
  providers: [FeedbacksService]
})
export class CreateFeedbackTypeComponent implements OnInit {
  commentExcededMaxCharacters = false;
  type = FeedbackType;
  public listType = [];

  public feedback = new Feedback();
  constructor(public dialogRef: MdDialogRef<CreateFeedbackTypeComponent>,
    private feedbacksService: FeedbacksService,
    public dialog: MdDialog) {
  }

  ngOnInit() {
    this.feedbacksService.getType().subscribe(result => {
      this.listType = result;
    });
  }

  createNewFeedback(feedbacktType: string) {
    const dialog = this.dialog.open(CreateFeedbackComponent);
    dialog.componentInstance.feedback.type = feedbacktType;
    this.dialogRef.close();
  }
}
