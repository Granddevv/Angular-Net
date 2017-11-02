import { Component, OnInit } from '@angular/core';
import { CreateFeedbackTypeComponent } from '../../admin/feedbacks/dialogs/create-feedback-type/create-feedback-type.component';
import { MdDialogRef, MdDialog } from '@angular/material';
import { Permissions } from '../../models/common/permissions.enum';
import { ApplicationService } from '../../services/data-services/application.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  providers: [ApplicationService]
})
export class FooterComponent implements OnInit {
  public Permissions = Permissions;
  public version: string;
  public year = new Date().getFullYear();

  constructor(private applicationService: ApplicationService, public dialog: MdDialog) { }

  ngOnInit() {
    this.applicationService.GetVersion().subscribe(version => this.version = version);
  }

  openFeedbackTypeDialog() {
    const dialog = this.dialog.open(CreateFeedbackTypeComponent);
  }
}
