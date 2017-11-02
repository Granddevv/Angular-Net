import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Feedback } from '../../../../models/feedbacks/feedbacks.model';

@Component({
  selector: 'app-preview-feedback',
  templateUrl: './preview-feedback.component.html',
  styleUrls: ['./preview-feedback.component.scss']
})
export class PreviewFeedbackComponent implements OnInit {
  public feedback = new Feedback();
  constructor() {
  }

  ngOnInit() { }
}