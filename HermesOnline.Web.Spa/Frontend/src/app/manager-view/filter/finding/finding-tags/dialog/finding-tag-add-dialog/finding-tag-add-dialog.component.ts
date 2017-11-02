import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Tag } from '../../../../../../models/tags/tag.model';
import { TagService } from '../../../../../../services/data-services/tag.service';

@Component({
  selector: 'app-finding-tag-add-dialog',
  templateUrl: './finding-tag-add-dialog.component.html',
  providers: [TagService]
})
export class FindingTagAddDialogComponent implements OnInit {
  public tags: Tag[] = [];
  public selectedTagId: string;
  public findingId: string;
  public isInit: boolean;
  constructor(private tagService: TagService, public dialogRef: MdDialogRef<FindingTagAddDialogComponent>) { }

  ngOnInit() {
    this.tagService.getAllAvailableForFinding(this.findingId).subscribe(tags => {
      this.tags = tags;
      this.isInit = true;
    });
  }

  add() {
    this.tagService.addTagToDefect(this.findingId, this.selectedTagId).subscribe(() => {
      this.dialogRef.close();
    });
  }
}
