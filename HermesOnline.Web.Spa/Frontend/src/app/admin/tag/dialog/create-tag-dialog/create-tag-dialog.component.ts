import { Component, OnInit } from '@angular/core';
import { MdDialogRef, MdDialog } from '@angular/material';
import { MdSnackBar } from '@angular/material';
import { Tag } from '../../../../models/tags/tag.model';
import { TagService } from '../../../../services/data-services/tag.service';
import { BaseDialog } from '../../../../common/component-framework/base-dialog';

@Component({
  selector: 'app-create-tag-dialog',
  templateUrl: './create-tag-dialog.component.html',
  styleUrls: ['./create-tag-dialog.component.scss'],
  providers: [TagService]
})
export class CreateTagDialogComponent extends BaseDialog implements OnInit {
  tag: Tag;
  showDescriptionError: boolean;
  showNameError: boolean;
  isSubmitted: boolean;
  loading = false;

  constructor(private tagsService: TagService,
    public dialogRef: MdDialogRef<CreateTagDialogComponent>,
    public dialog: MdDialog,
    public snackBar: MdSnackBar) {
    super();
  }

  ngOnInit() {
    if (!this.tag) {
      this.tag = new Tag();
    }
  }

  public focusoutName() {
    this.showNameError = this.tag.name.length === 0;
  }

  public focusName() {
    this.showNameError = false;
  }

  public focusoutDescription() {
    this.showDescriptionError = this.tag.description.length === 0;
  }

  public focusDescription() {
    this.showDescriptionError = false;
  }

  public sendData() {
    this.isSubmitted = true;
    this.loading = true;
    this.tagsService.create(this.tag).subscribe(() => {
      this.loading = false;
      this.dialogRef.close();
      const message = 'Your tag has been submitted!';
      this.snackBar.open(message, '', { duration: 2000 });
    });
  }
}
