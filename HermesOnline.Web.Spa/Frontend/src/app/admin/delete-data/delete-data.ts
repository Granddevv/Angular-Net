import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { DeleteData } from '../../models/delete-data/deleted-data.model';
import { IdText } from '../../models/shared/idtext';
import { NodeService } from '../../services/data-services/node.service';
import { SiteService } from '../../services/data-services/site.service';
import { TurbineService } from '../../services/data-services/turbine.service';
import { BaseDialog } from '../../common/component-framework/base-dialog';

@Component({
  selector: 'app-delete-data',
  templateUrl: './delete-data.html',
  styleUrls: ['./delete-data.scss'],
  providers: [NodeService]
})

export class DeleteDataComponent extends BaseDialog implements OnInit {
  public deleteData: DeleteData;
  public fleetList: Array<IdText>;
  public siteList: Array<IdText>;
  public turbineList: Array<IdText>;
  public inspectionList: Array<IdText>;
  private value: any = {};

  constructor(public dialog: MdDialog,
    private nodeService: NodeService,
    private siteService: SiteService,
    private turbineService: TurbineService,
    public snackBar: MdSnackBar,
    ) {
    super();
    this.deleteData = new DeleteData;
  }

  ngOnInit() {
    this.nodeService.getFleets().subscribe(result => {
      this.fleetList = result;
    });
  }
  public selectedFleet(value: any): void {
    this.deleteData.fleetId = value.id;
    this.siteService.getSites(this.deleteData.fleetId).subscribe(result => {
      this.siteList = result;
    });
  }

  public selectedSite(value: any): void {
    this.deleteData.siteId = value.id;
    this.turbineService.getTurbineBySiteId(this.deleteData.siteId).subscribe(result => {
      this.turbineList = result;
    });
  }

  public selectedTurbine(value: any): void {
    this.deleteData.turbineId = value.id;
    this.nodeService.getInspections(this.deleteData.turbineId).subscribe(result => {
      this.inspectionList = result;
    });
  }

  public selectedInspection(value: any): void {
    this.deleteData.inspectionId = value.id;
  }

  public refreshValue(value: any): void {
    this.value = value;
  }

  sendData(event) {
    this.loading = true;
    if (this.deleteData.inspectionId == null) {
      this.nodeService.deleteTurbine(this.deleteData.turbineId).subscribe(() => {
        this.loading = false;
        this.dialog.closeAll();
        const message = 'Turbine has been successfully deleted.';
        this.snackBar.open(message, '', { duration: 2000 });
      });
    } else {
      this.nodeService.deleteInspection(this.deleteData.inspectionId, this.deleteData.turbineId).subscribe(() => {
        this.loading = false;
        this.dialog.closeAll();
        const message = 'Inspection has been successfully deleted.';
        this.snackBar.open(message, '', { duration: 2000 });
      });
    }
  }
}
