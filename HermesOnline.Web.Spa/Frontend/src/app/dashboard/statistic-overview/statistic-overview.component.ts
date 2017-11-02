import { Component, OnInit } from '@angular/core';
import { DashboardPreview } from '../../models/dashboard/dashboard.model';
import { DashboardService } from '../../services/data-services/dashboard.service';

@Component({
  selector: 'app-statistic-overview',
  templateUrl: './statistic-overview.component.html',
  styleUrls: ['./statistic-overview.component.scss'],
  providers: [DashboardService]
})
export class StatisticOverviewComponent implements OnInit {
  public dashboardPreview: DashboardPreview;
  public isInit: boolean;

  constructor(private dashboardService: DashboardService) { 
    this.dashboardPreview = new DashboardPreview();
  }

  ngOnInit() {
    this.dashboardService.getDashboardPreview().subscribe(preview => {
      this.dashboardPreview = preview;
      this.isInit = true;
    });
  }
}
