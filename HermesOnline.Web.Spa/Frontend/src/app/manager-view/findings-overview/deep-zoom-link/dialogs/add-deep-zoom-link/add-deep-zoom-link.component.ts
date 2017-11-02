// tslint:disable:max-line-length

import { Component, OnInit, NgZone, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AddDeepZoomLinkFolderTreeComponent } from './../add-deep-zoom-link-folder-tree/add-deep-zoom-link-folder-tree.component';
import { AlertDialogComponent } from '../../../../../shared/alert-dialog/alert-dialog.component';
import { FormGroup, FormControl } from '@angular/forms';
import { AddDeepZoomLinkModel } from '../../../../../models/manager-view/finding-overview/common/deep-zoom-link/add-deep-zoom-link.model';
import { Tab } from '../../../../../models/manager-view/finding-overview/common/tab/tab';
import { NodeType } from '../../../../../models/manager-view/common/model/node-type';
import { IdText } from '../../../../../models/shared/idtext';
import { AddDeepZoomLinkService } from '../../../../../services/data-services/add-deep-zoom-link.service';
import { NodeService } from '../../../../../services/data-services/node.service';
import { BaseDialog } from '../../../../../common/component-framework/base-dialog';
import { SelectComponent } from 'ng2-select';

@Component({
  selector: 'app-add-deep-zoom-link',
  templateUrl: './add-deep-zoom-link.component.html',
  styleUrls: ['./add-deep-zoom-link.component.scss'],
  providers: [AddDeepZoomLinkService, NodeService]
})
export class AddDeepZoomLinkComponent extends BaseDialog implements OnInit {
  addDeepZoomLinkModel: AddDeepZoomLinkModel;
  private values;
  public fleetList: Array<IdText>;
  public siteList: Array<IdText>;
  public inspectionList: Array<IdText>;
  private value: any = {};
  @ViewChild('chosenInspection') public chosenInspection: SelectComponent;
  @ViewChild('chosenSite') public chosenSite: SelectComponent;

  constructor(
    private deepZoomLinksService: AddDeepZoomLinkService,
    private nodeService: NodeService,
    private dialogRef: MdDialogRef<AddDeepZoomLinkComponent>,
    private folderTreeDialog: MdDialog,
    public alertDialog: MdDialog,
    private router: Router) {
    super();
    this.addDeepZoomLinkModel = new AddDeepZoomLinkModel();
  }

  ngOnInit() {
    this.nodeService.getFleets().subscribe(result => {
      this.fleetList = result;
    });
  }
  public selectedFleet(value: any): void {
    this.addDeepZoomLinkModel.fleetId = value.id;
    this.deepZoomLinksService.getSites(this.addDeepZoomLinkModel.fleetId).subscribe(result => {
      this.siteList = result;
      this.chosenSite.active = [];
      this.chosenInspection.active = [];
    });
  }

  public selectedSite(value: any): void {
    this.addDeepZoomLinkModel.siteId = value.id;
    this.deepZoomLinksService.getInspections(this.addDeepZoomLinkModel.siteId).subscribe(result => {
      this.inspectionList = result;
      this.chosenInspection.active = [];
    });
  }

  public selectedInspection(value: any): void {
    this.addDeepZoomLinkModel.inspectionId = value.id;
  }

  public refreshValue(value: any): void {
    this.value = value;
  }

  selectDeepZoomLink() {
    const dialogRef = this.folderTreeDialog.open(AddDeepZoomLinkFolderTreeComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.addDeepZoomLinkModel.folderPath = result;
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  addDeepZoomLink() {
    this.loading = true;
    this.deepZoomLinksService.addDeepZoomLink(this.addDeepZoomLinkModel).subscribe((response) => {
      const alert = this.alertDialog.open(AlertDialogComponent);
      alert.componentInstance.title = response;
      this.loading = false;
      alert.afterClosed().subscribe(() => {
        this.dialogRef.close();
        this.router.navigate(['/managerview',
          {
            outlets: {
              'filter': ['site', this.addDeepZoomLinkModel.siteId],
              'findings': ['tab', Tab.DeepZoomLinks, 'type', NodeType.Site, 'id', this.addDeepZoomLinkModel.siteId]
            }
          }]);
      });
    });
  }
}
