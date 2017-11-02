// tslint:disable:max-line-length
import { Component, OnInit, NgZone, Inject, EventEmitter, ViewChildren, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { DownloadHelper } from '../../../../common/helpers/download.helper';
import { MdDialog } from '@angular/material';
import { ReportGenerationProgressDialogComponent } from '../../../common/dialogs/report-generation-progress/report-generation-progress.component';
import { ComparisonReportGenerationModel } from '../../../../models/manager-view/finding-overview/compariosn-report/comparison-report-generation.model';
import { ReportGeneratorService } from '../../../../services/data-services/report-generator.service';
import { BaseDialog } from '../../../../common/component-framework/base-dialog';

@Component({
    selector: 'app-comparison-report-generation',
    templateUrl: './comparison-report-generation.component.html',
    styleUrls: ['./comparison-report-generation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [ReportGeneratorService]
})

export class ComparisonReportGenerationComponent extends BaseDialog implements OnInit {
    public model: ComparisonReportGenerationModel;
    public yearsFrom: Array<number> = [];
    public yearsTo: Array<number>;
    public selectedYearFrom: number;
    public selectedYearTo: number;
    public isInit = false;
    public onCloseEvent;

    constructor(
        private reportGeneratorService: ReportGeneratorService,
        private dialog: MdDialog) {
        super();
        this.model = new ComparisonReportGenerationModel();
    }

    ngOnInit() {
        this.reportGeneratorService.getYears(this.model.nodeId, this.model.nodeType).subscribe(years => {
            this.yearsFrom = years;
            this.isInit = true;
        });
    }

    submit() {
        this.loading = true;
        this.reportGeneratorService.reportGenerationStart().subscribe(taskId => {
            const dialog = this.dialog.open(ReportGenerationProgressDialogComponent, { disableClose: true });
            dialog.config.disableClose = true;
            dialog.componentInstance.taskId = taskId;
            dialog.componentInstance.downloadResponse = this.reportGeneratorService
                .getComparisonReport(this.model.nodeId, this.model.nodeType, this.selectedYearFrom, this.selectedYearTo, taskId);
            dialog.componentInstance.onCloseEvent = () => {
                dialog.close();
                this.onCloseEvent();
                this.loading = false;
            };
        });
    }

    changeYearFrom() {
        this.yearsTo = [];
        this.selectedYearTo = undefined;
        this.yearsFrom.forEach(year => {
            if (year !== this.selectedYearFrom) {
                this.yearsTo.push(year);
            }
        });
    }
}
