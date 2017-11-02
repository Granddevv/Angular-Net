import { Component, OnInit, ElementRef, ViewChild, EventEmitter, NgZone, Inject, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NgUploaderOptions, UploadedFile } from '../../../custom_node_modules/ngx-uploader/src/classes/index';
import { MdDialogRef, MdDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MdSnackBar } from '@angular/material';
import { Report } from '../../models/manager-view/finding-overview/common/report/report';
import { NodeType } from '../../models/manager-view/common/model/node-type';
import { AuthConstants } from '../../common/constants/auth.constants';
import { IdText } from '../../models/shared/idtext';
import { SiteService } from '../../services/data-services/site.service';
import { TurbineService } from '../../services/data-services/turbine.service';
import { BladeService } from '../../services/data-services/blade.service';
import { BaseDialog } from '../../common/component-framework/base-dialog';

@Component({
  selector: 'app-attach-report',
  templateUrl: './report-attachment.component.html',
  styleUrls: ['./report-attachment.component.scss'],
  providers: [TurbineService, BladeService, SiteService]
})

export class ReportAttachmentComponent extends BaseDialog implements OnInit {
  options: NgUploaderOptions;
  fileName: '';
  inputUploadEvents: EventEmitter<string>;
  @ViewChild('fileInput') fileInput: ElementRef;
  report = new Report();
  nodeId: string;
  @Input() nodeType: NodeType;
  public siteList: Array<IdText>;
  public turbineList: Array<IdText>;
  public bladeList: Array<IdText>;
  private selectedSiteValue: string;
  private selectedTurbineValue: string;
  private selectedBladeValue: string;
  private value: any = {};
  private steps: number;
  public isSubmitted = false;

  constructor( @Inject(NgZone) private zone: NgZone,
    private siteService: SiteService,
    private turbineService: TurbineService,
    private bladeService: BladeService,
    public dialogRef: MdDialogRef<ReportAttachmentComponent>,
    public dialog: MdDialog,
    private elRef: ElementRef,
    public snackBar: MdSnackBar) {
    super();
    this.inputUploadEvents = new EventEmitter<string>();
  }

  ngOnInit() {
    if (+this.nodeType === NodeType.Site) {
      this.steps = 1;
      this.siteService.getSite().subscribe(result => {
        this.siteList = result;
        this.report.siteName = this.siteList.filter(x => x.id === this.nodeId)[0];
      });
      this.turbineService.getTurbineListBySiteId(this.nodeId).subscribe(data => {
        this.turbineList = data;
      });
    }
    if (+this.nodeType === NodeType.Turbine) {
      this.steps = 2;
      this.siteService.getSiteForTurbine(this.nodeId).subscribe(result => {
        this.report.siteName = result;
        this.turbineService.getTurbineListBySiteId(result.id).subscribe(data => {
          this.turbineList = data;
          this.report.turbineName = this.turbineList.filter(x => x.id === this.nodeId)[0];
        });
        this.bladeService.getBladeByTurbineId(this.nodeId).subscribe(resultList => {
          this.bladeList = resultList;
        });
      });
    }

    if (+this.nodeType === NodeType.Blade) {
      this.steps = 3;
      this.bladeService.getBladeById(this.nodeId).subscribe(result => {
        this.report.bladeName = result;
        this.turbineService.getTurbineForBlade(this.nodeId).subscribe(data => {
          this.report.turbineName = data;
          this.siteService.getSiteForTurbine(data.id).subscribe(resultList => {
            this.report.siteName = resultList;
          });
        });
      });
    }
    this.options = new NgUploaderOptions({
      url: `/api/report/create`,
      autoUpload: false,
      customHeaders: {
        'Authorization': `Bearer ${localStorage.getItem(AuthConstants.tokenLocalStorage)}`,
        maxUploads: 1
      }
    });
  }

  sendData() {
    this.loading = true;
    let selectedNodeId;
    if (this.selectedBladeValue != null) {
      selectedNodeId = this.selectedBladeValue;
    }
    if (this.selectedBladeValue == null && this.selectedTurbineValue != null) {
      selectedNodeId = this.selectedTurbineValue;
    }
    if (this.selectedBladeValue == null && this.selectedTurbineValue == null && this.selectedSiteValue != null) {
      selectedNodeId = this.selectedSiteValue;
    }
    if (this.steps === 1 && this.selectedSiteValue == null) {
      selectedNodeId = this.report.siteName.id;
      if (this.selectedTurbineValue != null) {
        selectedNodeId = this.selectedTurbineValue;
      }
      if (this.selectedBladeValue != null) {
        selectedNodeId = this.selectedBladeValue;
      }
    }
    if (this.steps === 2 && this.selectedTurbineValue == null) {
      selectedNodeId = this.report.turbineName.id;
      if (this.selectedBladeValue != null) {
        selectedNodeId = this.selectedBladeValue;
      }
    }
    if (this.steps === 3 && this.selectedBladeValue == null) {
      selectedNodeId = this.report.bladeName.id;
    }

    this.isSubmitted = true;
    this.options.data.fileName = this.report.fileName;
    this.options.data.nodeId = selectedNodeId;
    this.inputUploadEvents.emit('startUpload');
  }

  public selectedSite(value: any): void {
    this.selectedSite = value.id;
    this.turbineService.getTurbineListBySiteId(value.id).subscribe(data => {
      this.turbineList = data;
    });
  }

  public selectedTurbine(value: any): void {
    this.selectedTurbineValue = value.id;
    this.bladeService.getBladeByTurbineId(value.id).subscribe(resultList => {
      this.bladeList = resultList;
    });
  }

  public selectedBlade(value: any): void {
    this.selectedBladeValue = value.id;
  }

  public refreshValue(value: any): void {
    this.value = value;
  }

  handlePreviewData(data: any) {
    this.report.fileName = this.fileInput.nativeElement.files[0] !== null ? this.fileInput.nativeElement.files[0].name : '';
  }

  onUpload(data: UploadedFile) {
    setTimeout(() => {
      this.zone.run(() => {
        if (data && data.status) {
          if (data.status === 200) {
            this.dialogRef.close();
            const message = 'Your successfully attach report!';
            this.snackBar.open(message, '', { duration: 2000 });
          } else {
            alert(data.response);
          }
        }
      });
    });
  }

  removeFile() {
    this.report.fileName = '';
    this.fileInput.nativeElement.value = '';
  }
}