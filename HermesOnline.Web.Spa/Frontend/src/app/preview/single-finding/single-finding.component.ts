import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeepZoomLinkService } from '../../services/data-services/deep-zoom-link.service';

@Component({
  selector: 'app-single-finding',
  templateUrl: './single-finding.component.html',
  providers: [DeepZoomLinkService]
})
export class SingleFindingComponent implements OnInit {
  singleImageId: string;
  singleFindingId: string;
  singleDeepZoomLinkId: string;

  constructor(private route: ActivatedRoute, private deepZoomLinkService: DeepZoomLinkService) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.singleImageId = param['imageId'];
      this.singleFindingId = param['findingId'];
      this.deepZoomLinkService.getDeepZoomLinkIdByFindingId(this.singleFindingId)
        .subscribe(data => this.singleDeepZoomLinkId = data);
    });
  }
}
