import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdDialogRef, MdDialog } from '@angular/material';
import { FindingTagAddDialogComponent } from './dialog/finding-tag-add-dialog/finding-tag-add-dialog.component';
import { AlertDialogComponent } from '../../../../shared/alert-dialog/alert-dialog.component';
import { ConfirmationDialogComponent } from '../../../../shared/confirmation-dialog/confirmation-dialog.component';
import { MdSnackBar } from '@angular/material';
import { Tag } from '../../../../models/tags/tag.model';
import { Permissions } from '../../../../models/common/permissions.enum';
import { TagService } from '../../../../services/data-services/tag.service';

@Component({
    selector: 'app-finding-tags',
    templateUrl: './finding-tags.component.html',
    styleUrls: ['./finding-tags.component.scss'],
    providers: [TagService]
})
export class FindingTagsComponent implements OnInit {
    public PermissisPermissionsons = Permissions;
    public tags: Tag[];
    public findingId: string;

    constructor(private tagService: TagService, private route: ActivatedRoute, private dialog: MdDialog, public snackBar: MdSnackBar) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.findingId = params['findingId'];
            this.initTags();
        });
    }

    addTag() {
        if (this.tags.length > 4) {
            let dialog = this.dialog.open(AlertDialogComponent);
            dialog.componentInstance.title = 'You cannot have more than 5 tags per finding.';
        } else {
            let dialog = this.dialog.open(FindingTagAddDialogComponent);
            dialog.componentInstance.findingId = this.findingId;
            dialog.afterClosed().subscribe(() => this.initTags());
        }
    }

    deleteTag(tagId) {
        let confirmDialog = this.dialog.open(ConfirmationDialogComponent);
        confirmDialog.componentInstance.title = `Are you sure you want to delete tag?`;
        confirmDialog.afterClosed().subscribe(result => {
            if (result) {
                this.tagService.deleteTagFromDefect(this.findingId, tagId).subscribe(() => {
                    const message = 'Tag has been successfully deleted.';
                    this.snackBar.open(message, '', { duration: 2000 });
                    this.snackBar._openedSnackBarRef.afterDismissed().subscribe(() => {
                        this.dialog.closeAll();
                    });
                }
                );
            }
        });
    }

    initTags() {
        this.tagService.get(this.findingId).subscribe(tags => {
            this.tags = tags;
        });
    }
}
