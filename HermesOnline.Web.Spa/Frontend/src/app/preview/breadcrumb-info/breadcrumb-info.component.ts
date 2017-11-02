import { Component, OnInit, Input } from '@angular/core';
import { BreadcrumbInfo } from '../../models/preview/breadcrumb-info.model';
import { DeepZoomLinkService } from '../../services/data-services/deep-zoom-link.service';
import { FindingsDataTableService } from '../../services/data-services/findings-data-table.service';

@Component({
  selector: 'app-breadcrumb-info',
  templateUrl: './breadcrumb-info.component.html',
  styleUrls: ['./breadcrumb-info.component.scss']
})
export class BreadcrumbInfoComponent implements OnInit {
  @Input()
  deepZoomLinkId: string;

  @Input()
  findingId: string;

  @Input()
  isComparisonWindow = false;

  breadcrumbInfo = new BreadcrumbInfo();

  constructor(
    private deepZoomLinkService: DeepZoomLinkService,
    private findingsDataService: FindingsDataTableService
  ) { }

  ngOnInit() {
    if (this.deepZoomLinkId) {
      this.deepZoomLinkService.getBreadcrumbInfo(this.deepZoomLinkId).subscribe(data => {
        this.breadcrumbInfo = data;
      });
    } else if (this.findingId) {
      this.findingsDataService.getBreadcrumbInfo(this.findingId).subscribe(data => {
        this.breadcrumbInfo = data;
      });
    }

  }

  setFinding(finding: string) {
    this.breadcrumbInfo.finding = finding;
  }

}
