import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild, EventEmitter } from '@angular/core';
import { Response } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { DownloadHelper } from '../../../../common/helpers/download.helper';
import { MdProgressBarModule } from '@angular/material';
import { ReportGeneratorService } from '../../../../services/data-services/report-generator.service';

@Component({
    selector: 'app-report-generation-progress',
    templateUrl: './report-generation-progress.component.html',
    providers: [ReportGeneratorService]
})

export class ReportGenerationProgressDialogComponent implements OnInit, OnDestroy {
    public progressValue: number;
    public taskId: string;
    public onCloseEvent: Function;
    private interval: any;
    public loading = false;
    public downloadResponse: Observable<Response>;

    constructor(private reportGeneratorService: ReportGeneratorService) {
        this.progressValue = 0;
    }

    ngOnInit() {
        this.downloadResponse.subscribe();
        this.interval = setInterval(() => {
            this.reportGeneratorService.getReportGenerationProgress(this.taskId).subscribe(
                response => {
                    if (this.progressValue == 0) {
                        this.loading = true;
                    }
                    else {
                        this.loading = false;
                    }
                    this.progressValue = response.progress;
                    if (response.isCompleted) {
                        clearInterval(this.interval);
                        DownloadHelper.downloadFileFromUrl(this.reportGeneratorService.generateGetReportFileUrl(response.result));
                        this.onCloseEvent();
                    };
                });
        }, 1000);
    }

    cancel() {
        this.reportGeneratorService.reportGenerationCancel(this.taskId).subscribe();
        this.onCloseEvent();
    }

    ngOnDestroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}
