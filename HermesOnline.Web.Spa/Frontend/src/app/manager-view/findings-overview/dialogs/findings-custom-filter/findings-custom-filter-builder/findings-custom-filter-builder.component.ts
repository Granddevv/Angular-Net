import { Component, AfterViewInit, OnInit, ViewEncapsulation } from '@angular/core';
import { CustomFilterService } from '../../../../../services/data-services/custom-filters.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { CustomFilterModel, FilterModel } from '../../../../../models/custom-filters/custom-filters.model';

declare var $: any;

@Component({
    selector: 'app-findings-custom-filter-builder',
    templateUrl: './findings-custom-filter-builder.component.html',
    styleUrls: ['./findings-custom-filter-builder.component.scss'],
    providers: [CustomFilterService],
    encapsulation: ViewEncapsulation.None
})

export class FindingsCustomFilterBuilderComponent implements AfterViewInit, OnInit {
    public model = new CustomFilterModel();
    showNameError: boolean;
    protected filterModel: Array<FilterModel> = [
        {
            id: 'severity',
            label: 'Severity',
            type: 'integer',
            input: 'select',
            values: {
                0: '0',
                1: '1',
                2: '2',
                3: '3',
                4: '4',
                5: '5'
            },
            operators: ['equal', 'not_equal']
        },
        {
            id: 'category',
            label: 'Category',
            type: 'integer',
            input: 'select',
            values: {
                0: 'Undefined',
                1: 'Contamination',
                2: 'No annotation',
                3: 'Previous repairs',
                4: 'Chipped paint',
                5: 'Drain hole',
                6: 'LPS',
                7: 'Observation',
                8: 'Peeling paint',
                9: 'Pinholes',
                10: 'Superficial transverse crack',
                11: 'Superficial longitudinal crack',
                12: 'Scratches',
                13: 'Gouges',
                14: 'Structural cracks',
                15: 'Trailing edge damage',
                16: 'Surface delamination',
                17: 'Erosion',
                18: 'Surface voids',
                19: 'Unknown',
                20: 'Blade bearing covers',
                21: 'Gurney flap',
                22: 'Vortex generator',
                23: 'Damage',
                24: 'Dino Tail',
                25: 'Dino Shell',
                26: 'Stall Strip',
                27: 'Edge Delamination',
            },
            operators: ['equal', 'not_equal']
        },
        {
            id: 'layer',
            label: 'Layer',
            type: 'integer',
            input: 'select',
            values: {
                0: 'Unknown',
                1: 'Surface',
                2: 'AddOn',
                3: 'LEP',
                4: 'Paint',
                5: 'Filler',
                6: 'Laminate',
                7: 'CriticalDefect',
                8: 'Wood'
            },
            operators: ['equal', 'not_equal']
        }];
    constructor(private customFilterService: CustomFilterService, private dialogRef: MdDialogRef<FindingsCustomFilterBuilderComponent>) {
    }

    ngOnInit() {

    }

    private getQueryBuilder() {
        $('#builder').queryBuilder({
            filters: this.filterModel,
            rules: this.model.values,
            icons: {
                add_group: 'fa fa-plus-square',
                add_rule: 'fa fa-plus-circle',
                remove_group: 'fa fa-minus-square',
                remove_rule: 'fa fa-minus-circle',
                error: 'fa fa-exclamation-triangle'
            }
        });
    }

    ngAfterViewInit() {
        this.getQueryBuilder();
    }

    public saveFilter() {
        this.model.values = JSON.stringify($('#builder').queryBuilder('getRules'));
        this.customFilterService.save(this.model).subscribe(() => {
            this.dialogRef.close();
        })
    }

    focusoutName() {
        if (!this.model.name) {
            this.showNameError = true;
        }
    }

    focusName() {
        this.showNameError = false;
    }
}
