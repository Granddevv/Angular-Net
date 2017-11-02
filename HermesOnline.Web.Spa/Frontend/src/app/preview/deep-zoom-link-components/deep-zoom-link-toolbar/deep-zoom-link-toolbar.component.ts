import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-deep-zoom-link-toolbar',
  templateUrl: './deep-zoom-link-toolbar.component.html'
})
export class DeepZoomLinkToolbarComponent implements OnInit {

  @Output()
  public toggleAnnotationChanged = new EventEmitter();
  @Output()
  public toggleScaleChanged = new EventEmitter();
  @Output()
  public toggleMeasureDistanceChanged = new EventEmitter();

  @Input()
  isComparisonWindow;

  constructor() { }

  ngOnInit() {
  }

  public toggleAnnotation(isChecked: boolean): void {
    this.toggleAnnotationChanged.emit(isChecked);
  }

  public toggleScale(isChecked: boolean): void {
    this.toggleScaleChanged.emit(isChecked);
  }

  public toggleMeasureDistance(isChecked: boolean): void {
    this.toggleMeasureDistanceChanged.emit(isChecked);
  }
}
