// tslint:disable:max-line-length
import { Component, OnInit, NgZone, Inject, EventEmitter, ViewChildren, ElementRef, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { DownloadHelper } from '../../../../common/helpers/download.helper';
import { UtilityHelper } from '../../../../common/helpers/utility.helper';
import { MdDialog } from '@angular/material';
import { ReportGenerationProgressDialogComponent } from '../../../common/dialogs/report-generation-progress/report-generation-progress.component';
import { Subscription } from 'rxjs/Subscription';
import { GenerateDataExtractModel } from '../../../../models/manager-view/finding-overview/generate-data-extract/generate-data-extract.model';
import { SummaryViewItemFilter } from '../../../../models/manager-view/summary-view/summary-view-item-filter.model';
import { ReportGeneratorService } from '../../../../services/data-services/report-generator.service';
import { FindingsFilterManagerService } from '../../../../services/common-services/findings-filter-manager.service';

@Component({
  selector: 'app-generate-data-extract',
  templateUrl: './generate-data-extract.component.html',
  styleUrls: ['./generate-data-extract.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ReportGeneratorService]
})

export class GenerateDataExtractDialogComponent implements OnInit, OnDestroy {
  public onCloseEvent: Function;
  public model: GenerateDataExtractModel;
  private quickFilterChangeSubscription: Subscription;
  private timeLineViewFilterChangeSubscription: Subscription;
  private summaryViewFilterChangeSubscription: Subscription;

  constructor(
    private reportGeneratorService: ReportGeneratorService,
    private dialog: MdDialog,
    private findingsFilterManagerService: FindingsFilterManagerService) {
    this.model = new GenerateDataExtractModel();
  }

  ngOnInit() {
    this.quickFilterChangeSubscription = this.findingsFilterManagerService.quickFilterChange.subscribe(filter => {
      if (filter) {
        this.model.quickFilters = filter.quickFilters;
      }
    });

    this.summaryViewFilterChangeSubscription = this.findingsFilterManagerService.summaryViewFilterChange.subscribe((filter: Array<SummaryViewItemFilter>) => {
      if (filter) {
        this.model.summaryViewFilter = filter;
      }
    });

    this.timeLineViewFilterChangeSubscription = this.findingsFilterManagerService.timeLineViewFilterChange.subscribe((filter: Array<string>) => {
      if (filter) {
        this.model.timeLineFilter = filter;
      }
    });
  }

  ngOnDestroy() {
    this.quickFilterChangeSubscription.unsubscribe();
    this.summaryViewFilterChangeSubscription.unsubscribe();
    this.timeLineViewFilterChangeSubscription.unsubscribe();
  }

  submit() {
    this.reportGeneratorService.reportGenerationStart().subscribe(taskId => {
      this.model.TaskId = taskId;
      const dialog = this.dialog.open(ReportGenerationProgressDialogComponent, { disableClose: true });
      dialog.config.disableClose = true;
      dialog.componentInstance.taskId = taskId;
      dialog.componentInstance.downloadResponse = this.reportGeneratorService.getDataExtractReport(this.model);
      dialog.componentInstance.onCloseEvent = () => {
        dialog.close();
      };
      this.onCloseEvent();
    });
  }
}
