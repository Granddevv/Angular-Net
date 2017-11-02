// tslint:disable:max-line-length

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigateBy } from '../navigate-by';
import { Tab } from '../../../../models/manager-view/finding-overview/common/tab/tab';
import { FindingsDataTableFilterModel } from '../../../../models/manager-view/finding-overview/common/findings/findings-data-table-filter.model';
import { NodeType } from '../../../../models/manager-view/common/model/node-type';
import { Region } from '../../../../models/manager-view/global/region';
import { IdValue } from '../../../../models/manager-view/global/idvalue';
import { Site } from '../../../../models/manager-view/global/site';
import { RegionService } from '../../../../services/data-services/region.service';
import { CountryService } from '../../../../services/data-services/country.service';
import { SiteService } from '../../../../services/data-services/site.service';

@Component({
    selector: 'app-site-nav',
    templateUrl: 'site-nav.component.html',
    styleUrls: ['../../../manager-view.component.scss', '../navigate-by.component.scss'],
    providers: [SiteService, RegionService, CountryService]
})
export class SiteNavComponent extends NavigateBy implements OnInit {
    public countries: Array<IdValue>;
    public regions: Array<Region>;
    public sites: Array<Site>;
    private selectedRegionId: string;
    private selectedCountryId: string;
    private filter: FindingsDataTableFilterModel;
    private nodeType = NodeType;
    private Tab = Tab;

    constructor(private route: ActivatedRoute,
        private siteService: SiteService,
        private regionService: RegionService,
        private countryService: CountryService) {
        super();
    }

    ngOnInit() {
        this.regionService.GetRegions().subscribe(regions => {
            this.regions = regions;
        });
        this.route.params.subscribe(params => {
            this.filter = new FindingsDataTableFilterModel(params['countryId'], NodeType.Country);

            this.selectedRegionId = params['regionId'];
            this.selectedCountryId = params['countryId'];
            this.countryService.GetCountries(params['regionId']).subscribe(countries => {
                this.countries = countries;
            });
            this.siteService.getSitesForCountry(params['countryId']).subscribe(sites => {
                this.sites = sites;
            });
        });
    }

    numOfColumn(array): number {
        return this.getNumOfColumn(array);
    }
}
