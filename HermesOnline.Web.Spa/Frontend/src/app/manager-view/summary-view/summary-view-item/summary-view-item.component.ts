import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NodeType } from '../../../models/manager-view/common/model/node-type';
import { Surface } from '../../../models/manager-view/common/model/surface';
import { SummaryViewBladeData } from '../../../models/manager-view/summary-view/summary-view-blade-data.model';
import { SummaryViewFilterModel } from '../../../models/manager-view/summary-view/summary-view-filter.model';
import { SummaryViewItemFilter } from '../../../models/manager-view/summary-view/summary-view-item-filter.model';
import { SummaryViewService } from '../../../services/data-services/summary-view.service';
import { FindingsFilterManagerService } from '../../../services/common-services/findings-filter-manager.service';
import { SeverityColorMapper } from '../../../common/helpers/severity-color-mapper.helper';

@Component({
  selector: 'app-summary-view-item',
  templateUrl: './summary-view-item.component.html',
  styleUrls: ['./summary-view-item.component.scss', '../../manager-view.component.scss'],
  providers: [SummaryViewService]
})

export class SummaryViewItemComponent implements OnInit, OnChanges {
  @Input() nodeType: NodeType;
  @Input() bladeSurface: Surface;
  @Input() bladeLength: number;
  @Input() showScaleNumbers = false;
  private nodeId: string;
  public bins: Array<string>;
  private originBladeSummaryData: Array<SummaryViewBladeData>;
  private filteredBladeSummaryData: Array<SummaryViewBladeData>;
  public selectedMeters: Array<number> = new Array<number>();
  private filter: SummaryViewFilterModel;

  Surface = Surface;
  @Output()
  public onFilterChange: EventEmitter<SummaryViewItemFilter> = new EventEmitter<SummaryViewItemFilter>();

  constructor(
    private route: ActivatedRoute,
    private summaryViewService: SummaryViewService,
    private findingsFilterManagerService: FindingsFilterManagerService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (this.nodeType === NodeType.Turbine) {
        this.nodeId = params['turbineId'];
      } else if (this.nodeType === NodeType.Blade) {
        this.nodeId = params['bladeId'];
      }

      this.filter = new SummaryViewFilterModel();
      this.filter.nodeId = this.nodeId;
      this.filter.type = this.nodeType;
      this.filter.surface = this.bladeSurface;

      this.summaryViewService.getBladeSurfaceData(this.nodeId, this.nodeType, this.bladeSurface)
        .subscribe(bladeSummaryData => {
          this.originBladeSummaryData = bladeSummaryData;
          this.prepareBins();
        });
    });

    this.findingsFilterManagerService.summaryViewFilterChange.subscribe(filter => {
      if (filter) {
        this.filter.summaryViewFilter = filter;
        this.summaryViewService.getFilteredBladeSurfaceData(this.filter).subscribe(bladeSummaryData => {
          this.filteredBladeSummaryData = bladeSummaryData;
          this.prepareBins();
        });
      } else {
        this.resetAllFilters();
        this.summaryViewService.getBladeSurfaceData(this.nodeId, this.nodeType, this.bladeSurface)
          .subscribe(bladeSummaryData => {
            this.originBladeSummaryData = bladeSummaryData;
            this.prepareBins();
          });
      }
    });

    this.findingsFilterManagerService.quickFilterChange.subscribe(filter => {
      if (filter) {
        this.filter.quickFilters = filter.quickFilters;
        this.summaryViewService.getFilteredBladeSurfaceData(this.filter).subscribe(bladeSummaryData => {
          this.filteredBladeSummaryData = bladeSummaryData;
          this.prepareBins();
        });
      }
    });
  }

  ngOnChanges() {
    if (this.originBladeSummaryData) {
      this.prepareBins();
    }
  }

  public binClick(index: number) {
    const selectedMeter = index + 1;
    if (!this.selectedMeters) {
      this.selectedMeters = new Array<number>();
    }
    if (this.selectedMeters.indexOf(selectedMeter) !== -1) {
      this.selectedMeters.splice(this.selectedMeters.indexOf(selectedMeter), 1);
    } else {
      this.selectedMeters.push(selectedMeter);
    }
    this.prepareBins();
    this.onFilterChange.emit(new SummaryViewItemFilter(this.bladeSurface, this.selectedMeters));
  }

  public resetFilter(index: number) {
    this.selectedMeters = new Array<number>();
    this.onFilterChange.emit(new SummaryViewItemFilter(this.bladeSurface, this.selectedMeters));
  }

  public resetAllFilters() {
    for (let i = 0; i < 3; i++) {
      this.resetFilter(i);
    }
  }

  prepareBins() {
    if (!this.originBladeSummaryData) {
      return;
    }
    this.bins = Array<string>();
    for (let i = 1; i < this.bladeLength + 1; i++) {
      const findDefect = this.originBladeSummaryData.filter((defectData) => defectData.meterFromRoot === i);
      const severity = findDefect.length === 0 ? -1 : findDefect[0].severity;

      if (this.filteredBladeSummaryData) {
        const defectExist = this.filteredBladeSummaryData.filter((defectData) => defectData.meterFromRoot === i);
        if (defectExist.length > 0) {
          this.bins.push(SeverityColorMapper.getCssClassBySeverity(severity));
        } else {
          this.bins.push(SeverityColorMapper.getCssClassBySeverityUnselected(severity));
        }
      } else {
        this.bins.push(SeverityColorMapper.getCssClassBySeverity(severity));
      }
    }
  }
}
