import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TimelineFinding } from '../../../models/manager-view/timeline-view/timelineFinding';
import { SeverityColorMapper } from '../../../common/helpers/severity-color-mapper.helper';

@Component({
  selector: 'app-timeline-view-item',
  templateUrl: './timeline-view-item.component.html',
  styleUrls: ['../../manager-view.component.scss', './timeline-view-item.component.scss']
})

export class TimelineViewItemComponent implements OnInit {
  @Input()
  public findings: Array<TimelineFinding>;
  public finding: TimelineFinding;
  private currentPosition: number = 0;

  constructor(
    private elRef: ElementRef) {
  }

  ngOnInit() {
    this.setFinding();
  }

  setFinding() {
    this.finding = this.findings[this.currentPosition];
  }

  imageLoadError(event: any) {
    const element = jQuery(event.srcElement);
    element.addClass('noImage');
    element.removeAttr('src').removeAttr('onclick');
  }

  getCssClassBySeverity(): string {
    return SeverityColorMapper.getCssClassBySeverity(this.finding.severity);
  }

  severityColor(): string {
    return SeverityColorMapper.getColorHexValueBySeverity(this.finding.severity);
  }

  slideUp() {
    this.currentPosition++;
    if (this.currentPosition === this.findings.length) {
      this.currentPosition = 0;
    }
    this.setFinding();
  }

  slideDown() {
    this.currentPosition--;
    if (this.currentPosition === -1) {
      this.currentPosition = this.findings.length - 1;
    }
    this.setFinding();
  }
}