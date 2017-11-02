import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NodeType } from '../../models/manager-view/common/model/node-type';
import { Surface } from '../../models/manager-view/common/model/surface';
import { SummaryViewItemFilter } from '../../models/manager-view/summary-view/summary-view-item-filter.model';
import { TurbineService } from '../../services/data-services/turbine.service';
import { BladeService } from '../../services/data-services/blade.service';
import { FindingsFilterManagerService } from '../../services/common-services/findings-filter-manager.service';

@Component({
  selector: 'app-summary-view',
  templateUrl: './summary-view.component.html',
  styleUrls: ['./summary-view.component.scss'],
  providers: [BladeService, TurbineService]
})
export class SummaryViewComponent implements OnInit {
  private filter: Array<SummaryViewItemFilter> = new Array<SummaryViewItemFilter>();
  private bins = new Array<number>().fill(1);
  public bladeLength: number;
  Surface = Surface;
  @Input()
  nodeType: NodeType;

  constructor(
    private route: ActivatedRoute,
    private bladeService: BladeService,
    private turbineService: TurbineService,
    private findingsFilterManagerService: FindingsFilterManagerService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (this.nodeType === NodeType.Turbine) {
        if (params['turbineId']) {
          this.turbineService.GetBladeLength(params['turbineId']).subscribe(length => {
            this.bladeLength = length;
          });
        }
      } else if (this.nodeType === NodeType.Blade) {
        if (params['bladeId']) {
          this.bladeService.GetLength(params['bladeId']).subscribe(length => {
            this.bladeLength = length;
          });
        }
      }
    });
  }

  filterChange(summaryViewItemFilter: SummaryViewItemFilter) {
    const existingFilterObject = this.filter.findIndex(x => x.surface === summaryViewItemFilter.surface);
    if (existingFilterObject === -1) {
      this.filter.push(summaryViewItemFilter);
    } else {
      this.filter.splice(existingFilterObject, 1);
      if (summaryViewItemFilter.selectedMeters.length > 0) {
        this.filter.push(summaryViewItemFilter);
      }
    }
    this.findingsFilterManagerService.applySummaryViewFilter(this.filter);
  }
}
