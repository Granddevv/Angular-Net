import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigateBy } from '../navigate-by';
import { Tab } from '../../../../models/manager-view/finding-overview/common/tab/tab';
import { NodeType } from '../../../../models/manager-view/common/model/node-type';
import { IdValue } from '../../../../models/manager-view/global/idvalue';
import { Region } from '../../../../models/manager-view/global/region';
import { RegionService } from '../../../../services/data-services/region.service';
import { CountryService } from '../../../../services/data-services/country.service';

@Component({
    selector: 'app-country',
    templateUrl: 'country.component.html',
    styleUrls: ['../../../manager-view.component.scss', '../navigate-by.component.scss'],
    providers: [CountryService, RegionService]
})
export class CountryComponent extends NavigateBy implements OnInit {
    public countries: Array<IdValue>;
    public regions: Array<Region>;
    private selectedRegionId: string;
    private nodeType = NodeType;
    private Tab = Tab;

    constructor(private route: ActivatedRoute, private countryService: CountryService, private regionService: RegionService) {
        super();
     }

    ngOnInit() {
        this.route.params.subscribe(param => {
            this.selectedRegionId = param['regionId'];

            this.countryService.GetCountries(param['regionId']).subscribe(countries => {
                this.countries = countries;
            });
        });

        this.regionService.GetRegions().subscribe(regions => {
            this.regions = regions;
        });
    }

    numOfColumn(array): number {
       return this.getNumOfColumn(array);
    }
}
