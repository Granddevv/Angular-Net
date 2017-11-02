import { QuickFilterListItemModel } from '../../../../common/quick-filter-list-item.model';

export class FindingsQuickFilterListModel {
    constructor(
        public severity = new Array<QuickFilterListItemModel>(),
        public category = new Array<QuickFilterListItemModel>(),
        public layer = new Array<QuickFilterListItemModel>(),
        public site = new Array<QuickFilterListItemModel>(),
        public turbineName = new Array<QuickFilterListItemModel>(),
        public blade = new Array<QuickFilterListItemModel>(),
        public surface = new Array<QuickFilterListItemModel>(),
        public inspectionDate = new Array<QuickFilterListItemModel>(),
        public inspectionType = new Array<QuickFilterListItemModel>(),
        public inspectionCompany = new Array<QuickFilterListItemModel>(),
        public platform = new Array<QuickFilterListItemModel>(),
        public turbineType = new Array<QuickFilterListItemModel>(),
        public dataQuality = new Array<QuickFilterListItemModel>(),
    ) { }
}
