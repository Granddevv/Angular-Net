import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { DataQuality, DefectChangedQuality } from '../../../../models/manager-view/finding-overview/common/findings/findings-data-quality';
import { FindingForDataQuality } from '../../../../models/manager-view/finding-overview/common/findings/findings-data-table-row.model';
import { FindingsDataTableService } from '../../../../services/data-services/findings-data-table.service';
import { AlertDialogComponent } from '../../../../shared/alert-dialog/alert-dialog.component';
import { DisapproveFindingComponent } from '../disapprove -finding/disapprove-finding.component';
import { FindingsFilterManagerService } from '../../../../services/common-services/findings-filter-manager.service';
import { ConfirmationDialogComponent } from '../../../../shared/confirmation-dialog/confirmation-dialog.component';
import { BaseDialog } from '../../../../common/component-framework/base-dialog';

@Component({
  selector: 'app-data-quality',
  templateUrl: './data-quality.component.html',
  styleUrls: ['./data-quality.component.scss'],
  providers: [FindingsDataTableService]
})
export class DataQualityComponent extends BaseDialog implements OnInit {
  commentExcededMaxCharacters = false;
  public dataQuality = DataQuality;
  public findings = new FindingForDataQuality();
  public findingChangedQoulity: Array<DefectChangedQuality>;
  selectedRowsForValidation = {};
  isValidateFromImagePreview: boolean;

  constructor(public dialog: MdDialog,
    private findingsDataTableService: FindingsDataTableService,
    public dialogRef: MdDialogRef<DataQualityComponent>) {
    super();
  }

  ngOnInit() { }

  validateSelectedFindings() {
    if (this.isValidateFromImagePreview == true) {
      const confirmDialog = this.dialog.open(ConfirmationDialogComponent);
      confirmDialog.componentInstance.title = 'Please make sure you have checked the findings accorrding to the Finding Quality Check procedure, before approving!';
      confirmDialog.afterClosed().subscribe(result => {
        if (result) {
          this.loading = true;
          this.selectedRowsForValidation[this.findings.id] = true
          const findingIds = Object.keys(this.selectedRowsForValidation).map(key => { return key; });
          this.findingsDataTableService.changeDataQualityForSelectedFinding(findingIds).subscribe(result => {
            this.loading = false;
            this.findingChangedQoulity = result;
            this.dialog.closeAll();
          });
        }
      });
    }
    else {
      if (Object.keys(this.selectedRowsForValidation).length === 0) {
        const dialog = this.dialog.open(AlertDialogComponent);
        dialog.componentInstance.title = 'No findings selected.';
      }
      else {
        const confirmDialog = this.dialog.open(ConfirmationDialogComponent);
        confirmDialog.componentInstance.title = 'Please make sure you have checked the findings accorrding to the Finding Quality Check procedure, before approving!';
        confirmDialog.afterClosed().subscribe(result => {
          if (result) {
            this.loading = true;
            const findingIds = Object.keys(this.selectedRowsForValidation).map(key => { return key; });
            this.findingsDataTableService.changeDataQualityForSelectedFinding(findingIds).subscribe(result => {
              this.loading = false;
              this.findingChangedQoulity = result;
              this.dialog.closeAll();
            });
          }
        });
      }
    }
  }

  validateFindingsOfTheInspection() {
    const confirmDialog = this.dialog.open(ConfirmationDialogComponent);
    confirmDialog.componentInstance.title = 'Please make sure you have checked the findings accorrding to the Finding Quality Check procedure, before approving!';
    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.findingsDataTableService.changeDataQualityForFindingsOfTheInspection(this.findings.id).subscribe(result => {
          this.loading = false;
          this.findingChangedQoulity = result;
          this.dialog.closeAll();
        });
      }
    });
  }

  disapproveFindings() {
    const dialog = this.dialog.open(DisapproveFindingComponent);
    dialog.componentInstance.findings = this.findings;
    dialog.afterClosed().subscribe(result => {
        this.dialog.closeAll();
    });
  }
}
