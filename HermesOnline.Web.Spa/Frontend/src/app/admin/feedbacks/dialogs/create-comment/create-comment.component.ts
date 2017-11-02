import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { MdDialog } from '@angular/material';
import { FeedbacksComponent } from '../../feedbacks.component';
import { MdSnackBar } from '@angular/material';
import { Feedback } from '../../../../models/feedbacks/feedbacks.model';
import { FeedbacksService } from '../../../../services/data-services/feedbacks.service';
import { BaseDialog } from '../../../../common/component-framework/base-dialog';

@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.scss'],
  providers: [FeedbacksService]
})
export class CreateCommentComponent extends BaseDialog implements OnInit {
  commentExcededMaxCharacters = false;
  public component: FeedbacksComponent;
  public feedback = new Feedback();
  isSubmitted: boolean;
  showCommentError: boolean;

  constructor(public dialog: MdDialog,
    private feedbacksService: FeedbacksService,
    public snackBar: MdSnackBar) {
      super();
  }

  ngOnInit() { }

  sendFeedbackData(event) {
    if (this.feedback.comment.length > 4000) {
      this.commentExcededMaxCharacters = true;
      return;
    }
    this.isSubmitted = true;
    this.loading = true;
    this.feedbacksService.addCommentForFeedback(this.feedback).subscribe(() => {
      this.dialog.closeAll();
      const message = 'Your successfully added comment for feedback!';
      this.snackBar.open(message, '', { duration: 2000 });
      this.loading = false;
      this.component.filterTable();
    });
  }

  focusoutComment() {
    if (this.feedback.comment === '') {
      this.showCommentError = true;
    }
  }

  focusComment() {
    this.showCommentError = false;
  }
}
