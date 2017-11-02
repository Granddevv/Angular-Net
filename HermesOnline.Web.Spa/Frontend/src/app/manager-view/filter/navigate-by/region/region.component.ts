import { Component, OnInit } from '@angular/core';
import { NavigateBy } from '../navigate-by';
import { Router } from '@angular/router';
import { Tab } from '../../../../models/manager-view/finding-overview/common/tab/tab';
import { NodeType } from '../../../../models/manager-view/common/model/node-type';
import { Region } from '../../../../models/manager-view/global/region';
import { RegionService } from '../../../../services/data-services/region.service';

@Component({
    selector: 'app-region',
    templateUrl: 'region.component.html',
    styleUrls: ['../../../manager-view.component.scss', '../navigate-by.component.scss'],
    providers: [RegionService]
})
export class RegionComponent extends NavigateBy implements OnInit {
    public regions: Array<Region> = new Array<Region>();
    private nodeType = NodeType;
    private Tab = Tab;

    constructor(private regionService: RegionService, public router: Router) {
        super();
    }

    ngOnInit() {
        this.router.navigateByUrl('/managerview/(filter:navigateby)');
        this.regionService.GetRegions().subscribe(regions => {
            this.regions = regions;
        });
    }

    numOfColumn(array): number {
        return this.getNumOfColumn(array);
    }
}