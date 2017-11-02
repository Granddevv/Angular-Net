import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NodeType } from '../../../../models/manager-view/common/model/node-type';
import { IdValue } from '../../../../models/manager-view/global/idvalue';
import { SummaryViewItemFilter } from '../../../../models/manager-view/summary-view/summary-view-item-filter.model';
import { SiteService } from '../../../../services/data-services/site.service';
import { TurbineService } from '../../../../services/data-services/turbine.service';
import { FindingsFilterManagerService } from '../../../../services/common-services/findings-filter-manager.service';

@Component({
  selector: 'app-turrbine',
  templateUrl: 'turbine.component.html',
  styleUrls: ['../../../manager-view.component.scss'],
  providers: [SiteService, TurbineService]
})
export class TurbineComponent implements OnInit {
  private turbineName: string;
  public site: IdValue;
  public turbineId: string;
  public maxNumOfDefects: number;
  NodeType = NodeType;

  constructor(private route: ActivatedRoute,
    private turbineService: TurbineService,
    private siteService: SiteService,
    private findingsFilterManagerService: FindingsFilterManagerService) { }

  ngOnInit() {
    this.site = new IdValue();
    this.route.params.subscribe(param => {
      this.turbineService.GetMaxNumOfDefects(param['turbineId']).subscribe(max => {
        this.maxNumOfDefects = max;
      });
      this.turbineService.GetName(param['turbineId']).subscribe(turbineName => this.turbineName = turbineName);
      this.siteService.GetSite(param['turbineId']).subscribe(site => {
        this.site = new IdValue();
        this.site.id = site.id;
        this.site.value = site.value;
        this.turbineId = param['turbineId'];
      });
      this.findingsFilterManagerService.applySummaryViewFilter(new Array<SummaryViewItemFilter>());
    });
  }
}
