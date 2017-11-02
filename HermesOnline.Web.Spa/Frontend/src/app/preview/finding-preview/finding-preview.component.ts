import { Component, AfterViewInit, Input, OnInit } from '@angular/core';
import 'openseadragon';
import { ActivatedRoute } from '@angular/router';
import '../openseadragon-svg-overlay/openseadragon-svg-overlay';
import { FindingsDataTableService } from '../../services/data-services/findings-data-table.service';
import { FindingsTableRowModel, FindingForDataQuality } from '../../models/manager-view/finding-overview/common/findings/findings-data-table-row.model';
import { DataQualityComponent } from '../../manager-view/findings-overview/dialogs/data-quality/data-quality.component';
import { MdDialog } from '@angular/material';

declare var OpenSeadragon;
declare var fabric;

@Component({
  selector: 'app-finding-preview',
  templateUrl: './finding-preview.component.html',
  styleUrls: ['./finding-preview.component.scss'],
})
export class FindingPreviewComponent implements AfterViewInit, OnInit {
  public measureDistance = false;
  viewer: any;
  ruler: any;
  overlay: any;
  pixelsPerMM: number;
  public findings = new FindingsTableRowModel();
  deepZoomLinkUrl = '';

  @Input() imageId: string;
  @Input() findingId: string;
  @Input() deepZoomLinkId: string;
  @Input() isComparisonWindow = false;

  constructor(private findingService: FindingsDataTableService,
    public dialog: MdDialog) { }

  ngOnInit() {
    this.findingService.getFinding(this.findingId).subscribe(data => {
      this.findings = data;
    });
  }

  ngAfterViewInit() {
    const imageSrc = `/api/defects/imagepreview/${this.imageId}`;
    this.viewer = OpenSeadragon({
      id: `openSeadragon-${this.findingId}`,
      prefixUrl: 'assets/images/openseadragon/',
      tileSources: {
        type: 'image',
        url: imageSrc
      },
      animationTime: 0,
      maxZoomPixelRatio: 8
    });
    this.findingService.getAnnotations(this.findingId).subscribe(annotations => {
      this.pixelsPerMM = annotations.annotationData.pixelsPerMM;
      this.overlay = this.viewer.svgOverlay(this.findingId);
      this.overlay.addFinding(annotations.annotationData);
      this.ruler = this.viewer.svgRuler(this.pixelsPerMM, this.findingId);

      this.deepZoomLinkUrl = this.deepZoomLinkId;
    });
  }

  public toggleAnnotation(isChecked: boolean): void {
    this.overlay.display(isChecked);
  }

  public toggleScale(isChecked: boolean): void {
    this.ruler.display(isChecked);
  }

  public toggleMeasureDistance(isChecked: boolean): void {
    if (isChecked) {
      this.measureDistance = true;
      const measure = this.viewer.svgMeasure(this.pixelsPerMM, this.findingId);
      measure.clearArea();
    } else {
      this.measureDistance = false;
    }
  }

  changeDataQuality() {
    const dialog = this.dialog.open(DataQualityComponent);
    dialog.componentInstance.findings = new FindingForDataQuality(this.findings.id, this.findings.dataQuality, "", this.findings.severity, this.findings.type, this.findings.layer);
    dialog.componentInstance.isValidateFromImagePreview = true;
    dialog.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }
}
