import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DeepZoomLinkInfo } from '../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-info.model';
import { DeepZoomLinkImage } from '../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-image.model';
import { DeepZoomWindowPosition } from '../../models/preview/deep-zoom-window-position.enum';
import { DeepZoomLinkService } from '../../services/data-services/deep-zoom-link.service';


@Component({
  selector: 'app-deep-zoom-link-comparison',
  templateUrl: './deep-zoom-link-comparison.component.html',
  styleUrls: ['./deep-zoom-link-comparison.component.scss'],
})
export class DeepZoomLinkComparisonComponent implements OnInit {
  deepZoomLinkInfo: Array<DeepZoomLinkInfo>;
  deepZoomLinkImagesLeft: Array<DeepZoomLinkImage>;
  deepZoomLinkImagesRight: Array<DeepZoomLinkImage>;
  position = DeepZoomWindowPosition;

  constructor(
    private activatedRoute: ActivatedRoute,
    private deepZoomLinkService: DeepZoomLinkService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const leftDeepZoomLinkId = params['leftDeepZoomLinkId'];
      const rightDeepZoomLinkId = params['rightDeepZoomLinkId'];
      Observable.forkJoin(
        this.deepZoomLinkService.getDeepZoomInfo(leftDeepZoomLinkId),
        this.deepZoomLinkService.getDeepZoomInfo(rightDeepZoomLinkId),
      ).subscribe(data => {
        this.deepZoomLinkInfo = new Array<DeepZoomLinkInfo>();
        this.deepZoomLinkInfo['left'] = data[0];
        this.deepZoomLinkInfo['right'] = data[1];
      });
      this.deepZoomLinkService.getDeepZoomImages(leftDeepZoomLinkId).subscribe(data => {
        this.deepZoomLinkImagesLeft = data;
      });
      this.deepZoomLinkService.getDeepZoomImages(rightDeepZoomLinkId).subscribe(data => {
        this.deepZoomLinkImagesRight = data;
      });
    });
  }

}
