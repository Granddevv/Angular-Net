import { Component, Input, OnChanges, OnDestroy, Output, EventEmitter, OnInit, } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { Breadcrumb } from '../../../models/breadcrumb/breadcrumb.model';
import { Tab } from '../../../models/manager-view/finding-overview/common/tab/tab';
import { NodeType } from '../../../models/manager-view/common/model/node-type';
import { BreadcrumbService } from '../../../services/data-services/breadcrumb.service';
import { FindingsFilterManagerService } from '../../../services/common-services/findings-filter-manager.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./../../manager-view.component.scss'],
  providers: [BreadcrumbService]
})
export class BreadcrumbComponent implements OnChanges {

  @Input() siteId: string;
  @Input() turbineId: string;
  @Input() bladeId: string;
  @Input() surface: string;
  @Input() defectId: string;
  @Output() isInit = new EventEmitter();
  private nodeType = NodeType;
  private Tab = Tab;
  private breadcrumb = new Breadcrumb();

  constructor(private router: Router,
    private findingsFilterManagerService: FindingsFilterManagerService,
    private breadcrumbService: BreadcrumbService) {
  }

  ngOnChanges() {
    if (this.siteId) {
      this.breadcrumbService.getSiteBreadcrumb(this.siteId).subscribe(response => {
        this.breadcrumb = response;
        this.isInit.emit(true);
      });
    }

    if (this.turbineId) {
      this.breadcrumbService.getTurbineBreadcrumb(this.turbineId).subscribe(response => {
        this.breadcrumb = response;
        this.isInit.emit(true);
      });
    }

    if (this.bladeId) {
      this.breadcrumbService.getBladeBreadcrumb(this.bladeId).subscribe(response => {
        this.breadcrumb = response;
        this.isInit.emit(true);
      });
    }

    if (this.defectId) {
      this.breadcrumbService.getFindingBreadcrumb(this.defectId).subscribe(response => {
        this.breadcrumb = response;
        this.isInit.emit(true);
      });
    }
  }

  navigateToBladeOverview() {
    this.findingsFilterManagerService.resetDataTable(true);
    this.router.navigate(['/managerview',
      {
        outlets: {
          'filter': ['blade', this.breadcrumb.blade.id],
          'findings': ['tab', Tab.Findings, 'type', NodeType.Blade, 'id', this.breadcrumb.blade.id]
        }
      }]);
  }
}
