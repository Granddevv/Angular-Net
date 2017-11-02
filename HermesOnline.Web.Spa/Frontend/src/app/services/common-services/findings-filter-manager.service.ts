// tslint:disable:max-line-length

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SummaryViewItemFilter } from '../../models/manager-view/summary-view/summary-view-item-filter.model';
import { FindingsDataTableFilterModel } from '../../models/manager-view/finding-overview/common/findings/findings-data-table-filter.model';
import { BladeOverviewItemFilter } from '../../models/blade-overview-item/blade-overview-item-filter.model';

@Injectable()
export class FindingsFilterManagerService {
    public summaryViewFilterChange: BehaviorSubject<Array<SummaryViewItemFilter>> = new BehaviorSubject<Array<SummaryViewItemFilter>>(null);
    public timeLineViewFilterChange: BehaviorSubject<Array<string>> = new BehaviorSubject<Array<string>>(null);
    public quickFilterChange: BehaviorSubject<FindingsDataTableFilterModel> = new BehaviorSubject<FindingsDataTableFilterModel>(null);
    public findingsGroupFilterChange: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    public resetDataTableChange: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public moveSelectedFindingChange: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    public turbineOverviewFilterChange: BehaviorSubject<BladeOverviewItemFilter> = new BehaviorSubject<BladeOverviewItemFilter>(null);
    public customFilterChange: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    applyFindingsGroupFilter(findingId: string) {
        this.findingsGroupFilterChange.next(findingId);
    }

    resetFindingsGroupFilter() {
        this.findingsGroupFilterChange.next(null);
    }

    applySummaryViewFilter(filter: Array<SummaryViewItemFilter>) {
        this.summaryViewFilterChange.next(filter);
    }

    applyTimeLingViewFilter(filter: Array<string>) {
        this.timeLineViewFilterChange.next(filter);
    }

    applyQuickFilter(filter: FindingsDataTableFilterModel) {
        this.quickFilterChange.next(filter);
    }

    resetDataTable(reset: boolean) {
        this.resetDataTableChange.next(reset);
    }

    moveSelectedFinding(moveUp: boolean) {
        this.moveSelectedFindingChange.next(moveUp);
    }

    applyTurbineOverviewFilter(filter: BladeOverviewItemFilter) {
        this.turbineOverviewFilterChange.next(filter);
    }

    applyCustomFilter(customFilterId: string) {
        this.customFilterChange.next(customFilterId);
    }
}
