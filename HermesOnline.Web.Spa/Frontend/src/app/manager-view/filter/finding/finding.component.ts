import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FindingGroupType } from '../../../models/manager-view/common/model/finding-group-type';
import { Defect } from '../../../models/manager-view/global/defect';
import { SeverityColorMapper } from '../../../common/helpers/severity-color-mapper.helper';
import { SpinnerService } from '../../../services/common-services/spinner.service';
import { FindingsFilterManagerService } from '../../../services/common-services/findings-filter-manager.service';
import { FindingsDataTableService } from '../../../services/data-services/findings-data-table.service';

@Component({
  selector: 'app-finding',
  templateUrl: 'finding.component.html',
  styleUrls: ['finding.component.scss'],
  providers: [FindingsDataTableService]
})
export class FindingComponent implements OnInit {
  public defect: Defect = new Defect();
  public scaleVisible = true;
  public SeverityColorMapper = SeverityColorMapper;
  public FindingGroupType = FindingGroupType;
  private groupFilterApllied = false;

  constructor(private findingsService: FindingsDataTableService,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    private findingsFilterManagerService: FindingsFilterManagerService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.spinnerService.requestSpinner(true);
      this.findingsService.getDefect(params['findingId']).subscribe(defect => {
        this.defect = defect;
      });
    });
  }

  applyGroupFilter() {
    this.groupFilterApllied = !this.groupFilterApllied;
    if (this.groupFilterApllied) {
      this.findingsFilterManagerService.applyFindingsGroupFilter(this.defect.id);
    } else {
      this.findingsFilterManagerService.resetFindingsGroupFilter();
    }
  }

  isInit(isInit): void {
    if (isInit) {
      this.spinnerService.requestSpinner(false);
    }
  }

  move(moveUp: boolean) {
    this.findingsFilterManagerService.moveSelectedFinding(moveUp);
  }
}
