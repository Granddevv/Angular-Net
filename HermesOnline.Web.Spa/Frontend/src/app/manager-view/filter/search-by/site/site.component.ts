import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NodeType } from '../../../../models/manager-view/common/model/node-type';
import { Turbine } from '../../../../models/manager-view/global/turbine';
import { Tab } from '../../../../models/manager-view/finding-overview/common/tab/tab';
import { TurbineService } from '../../../../services/data-services/turbine.service';
import { SiteService } from '../../../../services/data-services/site.service';
import { FindingsDataTableService } from '../../../../services/data-services/findings-data-table.service';

@Component({
    selector: 'app-site',
    templateUrl: 'site.component.html',
    styleUrls: ['../../../manager-view.component.scss', './site.component.scss'],
    providers: [TurbineService]
})
export class SiteComponent implements OnInit {
    private siteName: string;
    public siteId: string;
    private nodeType = NodeType;
    private Tab = Tab;
    public turbinesMatrix = new Array<Turbine[]>();

    constructor(private route: ActivatedRoute,
        private router: Router,
        private siteService: SiteService,
        private turbineService: TurbineService,
        private findingsDataTableService: FindingsDataTableService) {
    }

    ngOnInit() {
        this.route.params.subscribe(param => {
            this.siteId = param['siteId'];
            this.siteService.GetName(param['siteId']).subscribe(siteName => this.siteName = siteName);
            this.turbineService.GetTurbinesBySiteId(param['siteId']).subscribe(turbines => {
                let turbine20 = new Array<Turbine>();
                for (let i = 0; i < turbines.length; i++) {
                    if (i % 20 === 0 && i !== 0) {
                        this.turbinesMatrix.push(Array.from(turbine20));
                        turbine20 = new Array<Turbine>();
                    }
                    turbine20.push(turbines[i]);
                }
                this.turbinesMatrix.push(Array.from(turbine20));
            });
        });
    }

    public getSeverityClass(severity: string) {
        switch (severity) {
            case '0':
                return 'severity_0';
            case '1':
                return 'severity_1';
            case '2':
                return 'severity_2';
            case '3':
                return 'severity_3';
            case '4':
                return 'severity_4';
            case '5':
                return 'severity_5';
        }
    }
}
