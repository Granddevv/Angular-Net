import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import { Router } from '@angular/router';
import { Tab } from '../../../models/manager-view/finding-overview/common/tab/tab';
import { NodeType } from '../../../models/manager-view/common/model/node-type';
import { IdValue } from '../../../models/manager-view/global/idvalue';
import { SpinnerService } from '../../../services/common-services/spinner.service';
import { SiteService } from '../../../services/data-services/site.service';
import { TurbineService } from '../../../services/data-services/turbine.service';
import { BladeService } from '../../../services/data-services/blade.service';

@Component({
    selector: 'app-search-by-index',
    templateUrl: './search-by.component.html',
    styleUrls: ['../../manager-view.component.scss'],
    providers: [TurbineService, BladeService, SiteService]
})
export class SearchByComponent implements OnInit, OnDestroy {
    public searchValue: string;
    private sites: IdValue[];
    private turbines: IdValue[];
    private blades: IdValue[];
    public searchControl = new FormControl();
    private nodeType = NodeType;
    private Tab = Tab;
    @ViewChild('autofocus') autofocus: any;

    constructor(
        private siteService: SiteService,
        private turbineService: TurbineService,
        private bladeService: BladeService,
        private spinnerService: SpinnerService,
        public router: Router) { }

    ngOnInit() {
        this.searchValue = '';
        this.router.navigateByUrl('/managerview/(filter:searchby)');
        this.autofocus.nativeElement.focus();
        this.spinnerService.setRouterName('searchBy');
        this.searchControl.valueChanges
            .debounceTime(600)
            .distinctUntilChanged()
            .subscribe(newValue => {
                this.siteService.SearchSites(this.searchValue.toLowerCase()).subscribe(sites => {
                    this.sites = sites;
                });

                this.turbineService.SearchTurbines(this.searchValue.toLowerCase()).subscribe(turbines => {
                    this.turbines = turbines;
                });

                this.bladeService.SearchBlades(this.searchValue.toLowerCase()).subscribe(blades => {
                    this.blades = blades;
                });
            });
    }

    ngOnDestroy() {
        this.spinnerService.setRouterName(undefined);
    }
}
