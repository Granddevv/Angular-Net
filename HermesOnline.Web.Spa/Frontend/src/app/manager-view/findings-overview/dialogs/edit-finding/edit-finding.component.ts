import { Component, OnInit, NgZone, Inject, ViewChild } from '@angular/core';
import { MdDialog } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { FindingsTableRowModel } from '../../../../models/manager-view/finding-overview/common/findings/findings-data-table-row.model';
import { FindingsDataTableService } from '../../../../services/data-services/findings-data-table.service';
import { IdText } from '../../../../models/shared/idtext';
import { Router } from '@angular/router';
import { FindingForEdit } from '../../../../models/manager-view/finding-overview/common/findings/findings-change-log.model';
import { BaseDialog } from '../../../../common/component-framework/base-dialog';
import { SelectComponent } from 'ng2-select';

@Component({
  selector: 'app-edit-finding',
  templateUrl: './edit-finding.component.html',
  styleUrls: ['./edit-finding.component.scss'],
  providers: [FindingsDataTableService]
})
export class EditFindingComponent extends BaseDialog implements OnInit {
  public finding = new FindingsTableRowModel();
  public findingForEdit = new FindingForEdit();
  public categoryList: Array<IdText>;
  public layerList: Array<IdText>;
  public severityList: Array<string>;
  private value: any = {};
  private selectedCategoryValue: string;
  private selectedLayerValue: string;
  private selectedSeverityValue: string;
  commentExcededMaxCharacters = false;
  isSubmitted: boolean;
  showCommentError: boolean;
  @ViewChild('chosenLayer') public chosenLayer: SelectComponent;
  @ViewChild('chosenSeverity') public chosenSeverity: SelectComponent;

  constructor(public dialog: MdDialog,
    private findingsDataTableService: FindingsDataTableService,
    public snackBar: MdSnackBar,
    private router: Router) {
    super();
  }

  public selectedCategory(value: any): void {
    this.selectedCategoryValue = value.id;
    this.findingsDataTableService.getLayer(this.selectedCategoryValue).subscribe(result => {
      this.layerList = result;
      this.chosenLayer.active = [];
      this.chosenSeverity.active = [];
    });
  }

  public selectedLayer(value: any): void {
    this.selectedLayerValue = value.id;
    this.findingsDataTableService.getSeverity(this.selectedLayerValue, this.selectedCategoryValue).subscribe(result => {
      this.severityList = result;
      this.chosenSeverity.active = [];
    });
  }

  public selectedSeverity(value: any): void {
    this.selectedSeverityValue = value.text;
  }

  public refreshValue(value: any): void {
    this.value = value;
  }

  ngOnInit() {
    this.findingsDataTableService.getDefectCategory().subscribe(result => {
      this.categoryList = result;
    });
  }

  sendFindingData(event) {
    this.isSubmitted = true;
    this.loading = true;
    this.findingForEdit.newType = this.selectedCategoryValue == null ? null : this.selectedCategoryValue;
    this.findingForEdit.newSeverity = this.selectedSeverityValue == null ? null : this.selectedSeverityValue;
    this.findingForEdit.newLayer = this.selectedLayerValue == null ? null : this.selectedLayerValue;
    this.findingForEdit.originalType = this.finding.type;
    this.findingForEdit.originalSeverity = this.finding.severity;
    this.findingForEdit.originalLayer = this.finding.layer;
    this.findingForEdit.comment = this.finding.comment;
    this.findingForEdit.id = this.finding.id;
    this.findingsDataTableService.editFinding(this.findingForEdit).subscribe(() => {
      this.dialog.closeAll();
      const message = 'Your finding has been submitted!';
      this.loading = false;
      this.snackBar.open(message, '', { duration: 2000 });
    });
  }

  focusoutComment() {
    if (this.finding.comment === '') {
      this.showCommentError = true;
    }
    this.commentExcededMaxCharacters = this.finding.comment.length > 1500;
  }

  focusComment() {
    this.showCommentError = false;
  }
}
