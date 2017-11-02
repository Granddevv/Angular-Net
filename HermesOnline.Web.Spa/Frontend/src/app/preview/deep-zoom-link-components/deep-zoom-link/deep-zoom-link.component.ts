import { Component, Input, AfterViewInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { DeepZoomLinkInfo } from '../../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-info.model';
import { DeepZoomLinkImage } from '../../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-image.model';
import { AnnotationsDto } from '../../../models/manager-view/common/model/defect-annotation';
import { DeepZoomLinkPreviewManagerService } from "../../../services/common-services/deep-zoom-link-preview-manger.service";

declare var OpenSeadragon;

@Component({
  selector: 'app-deep-zoom-link',
  templateUrl: './deep-zoom-link.component.html',
  styleUrls: ['./deep-zoom-link.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeepZoomLinkComponent implements AfterViewInit {
  @Input()
  deepZoomLinkInfo: DeepZoomLinkInfo;

  @Input()
  deepZoomLinkImages: Array<DeepZoomLinkImage>;

  readonly animationTime = 0;
  readonly maxZoomPixelRatio = 2;

  measureDistance = false;
  selectedFinding: AnnotationsDto;
  tileSource: any;
  viewer: any;
  id: string;
  overlay: any;
  ruler: any;
  measure: any;

  constructor(
    private deepZoomLinkPreviewManagerService: DeepZoomLinkPreviewManagerService
  ) { }

  ngAfterViewInit(): void {
    this.initializeTileSource(this.deepZoomLinkInfo);
    this.initalizeViewer(this.deepZoomLinkInfo.deepZoomLinkId);
    this.drawAnnotations(this.deepZoomLinkInfo.deepZoomLinkId, this.deepZoomLinkInfo.annotations, this.deepZoomLinkImages);
    this.drawRuler(this.deepZoomLinkInfo.annotations[0].pixelsPerMM, this.deepZoomLinkInfo.deepZoomLinkId);
    this.viewer.fullScreenActivated(this.deepZoomLinkPreviewManagerService.fullScreenChanged);
  }

  private initializeTileSource(deepZoomLinkInfo: DeepZoomLinkInfo) {
    this.tileSource = {
      Image: {
        xmlns: 'http://schemas.microsoft.com/deepzoom/2008',
        Url: `/api/deepZoomLink/tiles?deepZoomLinkId=${deepZoomLinkInfo.deepZoomLinkId}&tile=`,
        Format: 'jpg',
        Overlap: deepZoomLinkInfo.overlap,
        TileSize: deepZoomLinkInfo.tileSize,
        Size: {
          Height: deepZoomLinkInfo.height,
          Width: deepZoomLinkInfo.width
        }
      }
    };
  }

  private initalizeViewer(deepZoomLinkId: string) {
    this.viewer = new OpenSeadragon({
      id: `openSeadragon-${deepZoomLinkId}`,
      prefixUrl: 'assets/images/openseadragon/',
      tileSources: [{
        tileSource: this.tileSource
      }],
      animationTime: this.animationTime,
      maxZoomPixelRatio: this.maxZoomPixelRatio
    });
  }

  private drawAnnotations(deepZoomLinkId: string, annotations: AnnotationsDto[], deepZoomLinkImagesInfo: DeepZoomLinkImage[]) {
    this.overlay = this.viewer.svgOverlay(deepZoomLinkId, deepZoomLinkImagesInfo);
    annotations.forEach(annotation => {
      this.overlay.addFinding(annotation, this.deepZoomLinkPreviewManagerService.annotationSelected);
    });
  }

  public zoomToFinding(findingId: string) {
    const zoomRatio = 3.5;
    const offsetRatio = 2;
    const findingView = new OpenSeadragon.Rect();
    const findingArea = new OpenSeadragon.Rect();

    this.selectedFinding = this.deepZoomLinkInfo.annotations.filter(x => x.id === findingId)[0];
    if (this.measureDistance) {
      this.drawMeasure();
    }

    findingArea.x = this.selectedFinding.xCenter / this.viewer.source.width;
    findingArea.y = this.selectedFinding.yCenter / this.viewer.source.width;
    findingArea.height = this.selectedFinding.height / this.viewer.source.width;
    findingArea.width = this.selectedFinding.width / this.viewer.source.width;

    findingView.x = findingArea.x - zoomRatio * findingArea.width;
    findingView.y = findingArea.y - zoomRatio * findingArea.height;
    findingView.height = offsetRatio * zoomRatio * findingArea.height;
    findingView.width = offsetRatio * zoomRatio * findingArea.width;

    this.viewer.viewport.fitBounds(findingView);
    this.viewer.animateSelectedFinding(findingId);
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
      this.drawMeasure();
    } else {
      this.measureDistance = false;
    }
  }

  private drawRuler(pixelsPerMm: number, deepZoomLinkId: string) {
    this.ruler = this.viewer.svgRuler(pixelsPerMm, deepZoomLinkId);
  }

  private drawMeasure() {
    const pixelsPerMm = this.selectedFinding ? this.selectedFinding.pixelsPerMM : this.deepZoomLinkInfo.annotations[0].pixelsPerMM;
    this.measure = this.viewer.svgMeasure(pixelsPerMm, this.deepZoomLinkInfo.deepZoomLinkId);
    this.measure.clearArea();
  }
}
