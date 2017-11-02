// tslint:disable:max-line-length
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BladeOverviewItemFilter } from '../../../../../models/blade-overview-item/blade-overview-item-filter.model';
import { Tab } from '../../../../../models/manager-view/finding-overview/common/tab/tab';
import { FindingsDataTableFilterModel } from '../../../../../models/manager-view/finding-overview/common/findings/findings-data-table-filter.model';
import { NodeType } from '../../../../../models/manager-view/common/model/node-type';
import { Blade } from "../../../../../models/manager-view/global/blade";
import { Severity } from "../../../../../models/shared/severity.model";
import { BladeService } from "../../../../../services/data-services/blade.service";
import { FindingsFilterManagerService } from "../../../../../services/common-services/findings-filter-manager.service";

@Component({
    selector: 'app-blade-overview',
    templateUrl: 'blade-overview.component.html',
    providers: [BladeService],
    styleUrls: ['../../../../manager-view.component.scss', './blade-overview.component.scss'],
})
export class BladeOverviewComponent implements OnInit {
    @Input()
    bladeOrder: string;
    @Input()
    maxNumOfDefects: string;
    public nodeType = NodeType;
    public Tab = Tab;
    public blade: Blade;
    public filter: BladeOverviewItemFilter;
    public turbineId: string;
    public Severity = Severity;

    constructor(private route: ActivatedRoute,
        private bladeService: BladeService,
        private findingsFilterManagerService: FindingsFilterManagerService) { }

    ngOnInit() {
        this.blade = new Blade();
        this.route.params.subscribe(params => {
            this.turbineId = params['turbineId'];
            this.findingsFilterManagerService.applyTurbineOverviewFilter(null);
            this.bladeService.GetBladeOverview(this.turbineId, this.bladeOrder, new FindingsDataTableFilterModel(this.turbineId, NodeType.Turbine)).subscribe(blade => {
                this.blade = new Blade(blade.id, blade.value, blade.severityDefects);
            });
        });
        this.findingsFilterManagerService.turbineOverviewFilterChange.subscribe((filter) => {
            this.filter = filter;
            if (filter == null) {
                this.bladeService.GetBladeOverview(this.route.snapshot.params['turbineId'], this.bladeOrder, new FindingsDataTableFilterModel(this.turbineId, NodeType.Turbine)).subscribe(blade => {
                    this.blade = new Blade(blade.id, blade.value, blade.severityDefects);
                });
            }
        });

        this.findingsFilterManagerService.quickFilterChange.subscribe(filter => {
            if (filter) {
                this.bladeService.GetBladeOverview(this.route.snapshot.params['turbineId'], this.bladeOrder, filter).subscribe(blade => {
                    this.blade = new Blade(blade.id, blade.value, blade.severityDefects);
                });
            }
        });
    }

    public setFilter(severity: Severity) {
        if (this.filter && this.filter.bladeId === this.blade.id && this.filter.severity === severity) { // 'uncheck'
            this.findingsFilterManagerService.applyTurbineOverviewFilter(null);
        } else {
            this.filter = new BladeOverviewItemFilter();
            this.filter.bladeId = this.blade.id;
            this.filter.severity = severity;
            this.findingsFilterManagerService.applyTurbineOverviewFilter(this.filter);
        }
    }

    public getOpacity(severity) {
        if (this.filter == null) {
            return 1;
        } else if (this.filter === null || this.filter.bladeId === this.blade.id && this.filter.severity === severity) {
            return 1;
        } else {
            return 0.3;
        }
    }

    public isFilterApplied(severity) {
        return this.filter !== null && this.filter.bladeId === this.blade.id && this.filter.severity === severity;
    }
}
