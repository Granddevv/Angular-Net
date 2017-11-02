import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeepZoomLinkService } from '../../services/data-services/deep-zoom-link.service';

@Component({
  selector: 'app-compare-findings',
  templateUrl: './compare-findings.component.html',
  styleUrls: ['./compare-findings.component.scss'],
  providers: [DeepZoomLinkService]
})
export class CompareFindingsComponent implements OnInit {
  leftImageId: string;
  leftFindingId: string;
  leftDeepZoomLinkId: string;
  rightImageId: string;
  rightFindingId: string;
  rightDeepZoomLinkId: string;

  constructor(private route: ActivatedRoute, private deepZoomLinkService: DeepZoomLinkService) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.leftImageId = param['leftImageId'];
      this.leftFindingId = param['leftFindingId'];
      this.rightImageId = param['rightImageId'];
      this.rightFindingId = param['rightFindingId'];
      this.deepZoomLinkService.getDeepZoomLinkIdByFindingId(this.leftFindingId)
        .subscribe(data => this.leftDeepZoomLinkId = data);
      this.deepZoomLinkService.getDeepZoomLinkIdByFindingId(this.rightFindingId)
        .subscribe(data => this.rightDeepZoomLinkId = data);
    });
  }
}
