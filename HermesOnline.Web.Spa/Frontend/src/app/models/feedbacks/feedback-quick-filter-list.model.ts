
import { QuickFilterListItemModel } from '../common/quick-filter-list-item.model';

export class FeedbackQuickFilterListModel {
    constructor(
        public type = new Array<QuickFilterListItemModel>(),
        public category = new Array<QuickFilterListItemModel>(),
        public status = new Array<QuickFilterListItemModel>(),
    ) { }
}

export class FeedbackQuickFilterModel {
    constructor(
        public types = new Array<string>(),
        public categories = new Array<string>(),
        public statuses = new Array<string>()
    ) { }
}
