import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Surface } from '../../../../../models/manager-view/common/model/surface';
import { BladeSide } from '../../../../../models/manager-view/global/bladeside';
import { BladeService } from '../../../../../services/data-services/blade.service';

@Component({
    selector: 'app-blade-side-overview',
    templateUrl: 'blade-side-overview.component.html',
    styleUrls: ['../../../../manager-view.component.scss', './blade-side-overview.component.scss']
})
export class BladeSideOverviewComponent implements OnInit {
    @Input()
    surface: Surface;
    @Input()
    maxNumOfDefects = 1;

    public bladeSide: BladeSide;
    Surface = Surface;
    constructor(private route: ActivatedRoute, private bladeService: BladeService) { }

    ngOnInit() {
        this.bladeSide = new BladeSide();
        this.route.params.subscribe(params => {
            this.bladeService.GetBladeSideOverview(params['bladeId'], this.surface).subscribe(blade => {
                this.bladeSide = new BladeSide(blade.defectId, blade.bladeId, blade.severityDefects);
            });
        });
    }
}
