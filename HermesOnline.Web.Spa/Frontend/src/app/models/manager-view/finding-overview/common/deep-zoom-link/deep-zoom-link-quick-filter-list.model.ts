
import { QuickFilterListItemModel } from '../../../../common/quick-filter-list-item.model';

export class DeepZoomLinkQuickFilterListModel {
    constructor(
        public site = new Array<QuickFilterListItemModel>(),
        public turbineSerial = new Array<QuickFilterListItemModel>(),
        public turbine = new Array<QuickFilterListItemModel>(),
        public blade = new Array<QuickFilterListItemModel>(),
        public surface = new Array<QuickFilterListItemModel>(),
        public date = new Array<QuickFilterListItemModel>(),
        public photoSource = new Array<QuickFilterListItemModel>(),
        public inspection = new Array<QuickFilterListItemModel>(),
        public region = new Array<QuickFilterListItemModel>(),
        public country = new Array<QuickFilterListItemModel>()
    ) { }
}
