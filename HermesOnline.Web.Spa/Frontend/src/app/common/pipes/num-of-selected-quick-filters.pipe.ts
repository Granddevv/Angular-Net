import { Pipe, PipeTransform } from '@angular/core';
import { QuickFilterListItemModel } from '../../models/common/quick-filter-list-item.model';

@Pipe({
    name: 'numOfSelectedQuickFilters',
    pure: false
})
export class NumOfSelectedQuickFiltersPipe implements PipeTransform {
    transform(value: QuickFilterListItemModel[]) {
        return value.filter(x => x.isChecked).length;
    }
}
