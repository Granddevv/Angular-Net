import { QuickFilterListItemModel } from '../common/quick-filter-list-item.model';

export class UserManagementQuickFilterListModel {
    constructor(
        public group = new Array<QuickFilterListItemModel>()
    ) { }
}

export class UserManagementQuickFilterModel {
    constructor(
        public groupIds = new Array<string>(),
    ) { }
}
