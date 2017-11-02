import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NodeType } from '../../../../models/manager-view/common/model/node-type';
import { Surface } from '../../../../models/manager-view/common/model/surface';
import { Turbine } from '../../../../models/manager-view/global/turbine';
import { Site } from '../../../../models/manager-view/global/site';
import { SummaryViewItemFilter } from '../../../../models/manager-view/summary-view/summary-view-item-filter.model';
import { SiteService } from '../../../../services/data-services/site.service';
import { BladeService } from '../../../../services/data-services/blade.service';
import { TurbineService } from '../../../../services/data-services/turbine.service';
import { FindingsFilterManagerService } from '../../../../services/common-services/findings-filter-manager.service';

@Component({
    selector: 'app-blade',
    templateUrl: 'blade.component.html',
    styleUrls: ['../../../manager-view.component.scss'],
    providers: [SiteService, BladeService, TurbineService]
})

export class BladeComponent implements OnInit {
    public site: Site;
    public turbine: Turbine;
    private bladeName: string;
    public bladeId: string;
    public maxNumOfDefects: number;
    Surface = Surface;
    NodeType = NodeType;

    constructor(private route: ActivatedRoute,
        private turbineService: TurbineService,
        private siteService: SiteService,
        private bladeService: BladeService,
        private findingsFilterManagerService: FindingsFilterManagerService) { }

    ngOnInit() {
        this.site = new Site();
        this.turbine = new Turbine();
        this.route.params.subscribe(param => {
            this.bladeId = param['bladeId'];

            this.siteService.GetSiteByBladeId(param['bladeId']).subscribe(site => {
                this.site = site;
            });

            this.turbineService.GetTurbineByBladeId(param['bladeId']).subscribe(turbine => {
                this.turbine = turbine;
            });

            this.bladeService.GetName(param['bladeId']).subscribe(bladeName => {
                this.bladeName = bladeName;
            });

            this.bladeService.GetMaxNumOfDefects(param['bladeId']).subscribe(max => {
                this.maxNumOfDefects = max;
            });
            this.findingsFilterManagerService.applySummaryViewFilter(new Array<SummaryViewItemFilter>());
        });
    }
}
