import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { TimelineInspection } from '../../models/manager-view/timeline-view/timelineInspection';
import { TimelineFinding } from '../../models/manager-view/timeline-view/timelineFinding';
import { TimelineService } from '../../services/data-services/timeline-view.service';
import { FindingsFilterManagerService } from '../../services/common-services/findings-filter-manager.service';
import { FindingsDataTableService } from '../../services/data-services/findings-data-table.service';

@Component({
  selector: 'app-timeline-view',
  templateUrl: './timeline-view.component.html',
  styleUrls: ['./timeline-view.component.scss', '../manager-view.component.scss'],
  providers: [TimelineService]
})

export class TimelineViewComponent implements OnInit, OnDestroy {
  public selectedFindingId: string;
  private allInspections: Array<TimelineInspection>;
  private inspections: Array<TimelineInspection>;
  private numOfVisibleInspections: number = 3;
  private sliderStart: number = 0;
  private sliderEnd: number = this.numOfVisibleInspections;
  public isInitialized: boolean = false;
  private quickFilterChangeSubscription: Subscription

  constructor(
    private route: ActivatedRoute,
    private timelineService: TimelineService,
    private elRef: ElementRef,
    private findingsFilterManagerService: FindingsFilterManagerService,
    private findingsService: FindingsDataTableService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedFindingId = params['findingId'];
      this.timelineService.getTimelineInspectionList(this.selectedFindingId).subscribe(data => {
        this.allInspections = data;
        this.prepareInspectionList();
        this.isInitialized = true;
        this.findingsFilterManagerService.applyTimeLingViewFilter(this.getAllFindingIds());
      });
    });

    this.quickFilterChangeSubscription = this.findingsFilterManagerService.quickFilterChange.subscribe(filter => {
      if (this.allInspections && this.allInspections.length > 0 && filter) {
        this.isInitialized = false;
        this.findingsService.getDefectsIds(filter).subscribe(ids => {

          const filteredInspections = Array<TimelineInspection>();
          this.timelineService.getTimelineInspectionList(this.selectedFindingId).subscribe(inspections => {

            inspections.forEach(inspection => {
              let filteredFindings = Array<TimelineFinding>();
              ids.forEach(id => {
                let finding = inspection.findings.find(i => i.id === id);
                if (finding) {
                  filteredFindings.push(finding);
                }
              });
              inspection.findings = filteredFindings;
              filteredInspections.push(inspection);
            });

            let emptyInspections = filteredInspections.filter(x => x.findings.length === 0);
            emptyInspections.forEach(inspection => {
              filteredInspections.splice(filteredInspections.findIndex(x => x.id === inspection.id), 1);
            });

            this.allInspections = filteredInspections;
            this.prepareInspectionList();
            this.isInitialized = true;
          });
        });
      }
    });
  }

  ngOnDestroy() {
    this.quickFilterChangeSubscription.unsubscribe();
  }

  imageLoadError(event: any) {
    let element = jQuery(event.srcElement);
    element.addClass('noImage');
    element.removeAttr('src').removeAttr('onclick');
  }

  prepareInspectionList() {
    this.inspections = this.allInspections.slice(this.sliderStart, this.sliderEnd);
  }

  slideRight() {
    if (!this.canSlideRight()) {
      throw new Error(`Can't slide to right.`)
    }
    this.sliderStart++;
    this.sliderEnd++;
    this.prepareInspectionList();
  }

  slideLeft() {
    if (!this.canSlideLeft()) {
      throw new Error(`Can't slide to left.`)
    }
    this.sliderStart--;
    this.sliderEnd--;
    this.prepareInspectionList();
  }

  canSlideLeft(): boolean {
    return this.sliderStart !== 0;
  }

  canSlideRight(): boolean {
    if (this.allInspections) {
      return this.allInspections.length > this.numOfVisibleInspections && this.sliderEnd !== this.allInspections.length;
    }
    return false;
  }

  getDefectYearsForCompare(defectId: string): Array<string> {
    const defectYears = new Array<string>();
    this.allInspections.filter(x => x.id !== defectId).forEach(defect => {
      defectYears.push(defect.inspectionYear);
    });
    return defectYears;
  }

  getAllFindingIds(): Array<string> {
    const result = Array<string>();
    this.allInspections.forEach(inspection => {
      inspection.findings.forEach(finding => {
        result.push(finding.id);
      });
    });
    return result;
  }
}
