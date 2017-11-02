// tslint:disable:max-line-length

import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbInfoComponent } from '../breadcrumb-info/breadcrumb-info.component';
import { DeepZoomLinkComponent } from '../deep-zoom-link-components/deep-zoom-link/deep-zoom-link.component';
import { DeepZoomLinkInfo } from '../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-info.model';
import { DeepZoomLinkImage } from '../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-image.model';
import { DeepZoomWindowPosition } from '../../models/preview/deep-zoom-window-position.enum';
import { DeepZoomLinkService } from '../../services/data-services/deep-zoom-link.service';
import { FindingsForDeepZoomLinkComponent } from '../deep-zoom-link-components/findings-for-deep-zoom-link/findings-for-deep-zoom-link.component';
import { DeepZoomLinkPreviewManagerService } from '../../services/common-services/deep-zoom-link-preview-manger.service';

@Component({
  selector: 'app-deep-zoom-link-preview',
  templateUrl: './deep-zoom-link-preview.component.html',
  styleUrls: ['./deep-zoom-link-preview.component.scss'],
})
export class DeepZoomLinkPreviewComponent implements OnInit {
  @Input()
  deepZoomLinkInfo: DeepZoomLinkInfo;

  @Input()
  deepZoomLinkImages: Array<DeepZoomLinkImage>;

  @Input()
  deepZoomWindowPosition = DeepZoomWindowPosition.Right;
  position = DeepZoomWindowPosition;

  @Input()
  isComparisonWindow = false;

  @ViewChild(DeepZoomLinkComponent)
  deepZoomLinkComponent: DeepZoomLinkComponent;
  @ViewChild(BreadcrumbInfoComponent)
  breadCrumbInfoComponent: BreadcrumbInfoComponent;
  @ViewChild(FindingsForDeepZoomLinkComponent)
  findingsForDeepZoomLinkComponent: FindingsForDeepZoomLinkComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private deepZoomLinkService: DeepZoomLinkService,
    private deepZoomLinkPreviewManagerService: DeepZoomLinkPreviewManagerService
  ) { }

  ngOnInit() {
    this.handleFullScreen();

    if (!this.deepZoomLinkInfo) {
      this.activatedRoute.params.subscribe(params => {
        const deepZoomLinkId = params['deepZoomLinkId'];
        this.getDeepZoomInfo(deepZoomLinkId);
        this.getDeepZoomLinkImages(deepZoomLinkId);
      });
    }
  }

  getDeepZoomInfo(deepZoomLinkId: string) {
    this.deepZoomLinkService.getDeepZoomInfo(deepZoomLinkId)
      .subscribe(data => {
        this.deepZoomLinkInfo = data;
      });
  }

  getDeepZoomLinkImages(deepZoomLinkId: string) {
    this.deepZoomLinkService.getDeepZoomImages(deepZoomLinkId).subscribe(data => {
      this.deepZoomLinkImages = data;
    });
  }

  toggleAnnotationChanged(isChecked: boolean) {
    this.deepZoomLinkComponent.toggleAnnotation(isChecked);
  }

  toggleScaleChanged(isChecked: boolean) {
    this.deepZoomLinkComponent.toggleScale(isChecked);
  }

  toggleMeasureDistanceChanged(isChecked: boolean) {
    this.deepZoomLinkComponent.toggleMeasureDistance(isChecked);
  }

  handleFullScreen() {
    this.deepZoomLinkPreviewManagerService.fullScreenChanged.subscribe(isFullScreen => {
      if (!isFullScreen && isFullScreen != null) {
        this.findingsForDeepZoomLinkComponent.filterTable();
      }
    });
  }

  findingSelected(finding) {
    this.deepZoomLinkComponent.zoomToFinding(finding.id);
    this.breadCrumbInfoComponent.setFinding(finding.serialNumber);
  }
}
