import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { FindingForDataQuality, FindingsTableRowModel } from '../../../../models/manager-view/finding-overview/common/findings/findings-data-table-row.model';
import { EditFindingComponent } from '../edit-finding/edit-finding.component';
import { ConfirmationDialogComponent } from '../../../../shared/confirmation-dialog/confirmation-dialog.component';
import { FindingsDataTableService } from '../../../../services/data-services/findings-data-table.service';
import { BaseDialog } from '../../../../common/component-framework/base-dialog';

@Component({
  selector: 'app-disapprove-finding',
  templateUrl: './disapprove-finding.component.html',
  styleUrls: ['./disapprove-finding.component.scss']
})
export class DisapproveFindingComponent extends BaseDialog implements OnInit {
  public findings = new FindingForDataQuality();

  constructor(public dialog: MdDialog,
    public dialogRef: MdDialogRef<DisapproveFindingComponent>,
    private findingsDataTableService: FindingsDataTableService,
    public snackBar: MdSnackBar) {
    super();
  }

  ngOnInit() { }

  edit(row, event: Event) {
    const confirmDialog = this.dialog.open(ConfirmationDialogComponent);
    confirmDialog.componentInstance.title = 'Are you sure you want to edit this finding?';
    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        const dialog = this.dialog.open(EditFindingComponent);
        dialog.componentInstance.finding = new FindingsTableRowModel(this.findings.id, this.findings.severity, this.findings.category, this.findings.layer, "", this.findings.dataQuality);
      }
    });
  }

  delete() {
    const confirmDialog = this.dialog.open(ConfirmationDialogComponent);
    confirmDialog.componentInstance.title = 'Are you sure you want to delete this finding?';
    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.findingsDataTableService.deleteFinding(this.findings.id).subscribe(() => {
          const message = 'Finding has been successfully deleted.';
          this.dialogRef.close();
          this.loading = false;
          this.snackBar.open(message, '', { duration: 2000 });
        }
        );
      }
    });
  }
}
