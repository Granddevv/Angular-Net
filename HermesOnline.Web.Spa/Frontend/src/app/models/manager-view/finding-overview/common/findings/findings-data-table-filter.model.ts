
import { FindingsQuickFilterModel } from './findings-quick-filter.model';
import { BladeOverviewItemFilter } from '../../../../blade-overview-item/blade-overview-item-filter.model';
import { FindingGroupType } from '../../../common/model/finding-group-type';
import { NodeType } from '../../../common/model/node-type';
import { SummaryViewItemFilter } from '../../../summary-view/summary-view-item-filter.model';


export class FindingsDataTableConstants {
    public static readonly dataTableSizePerPage = 15;
    public static readonly dataTableStartIndex = 0;
    public static readonly dataTableDefaultSortDirection = 0;
}

export class FindingsDataTableFilterModel {
    public customFilterId: string;

    constructor(
        public id: string,
        public type: NodeType,
        public quickFilters?: FindingsQuickFilterModel,
        public summaryViewFilter?: Array<SummaryViewItemFilter>,
        public timeLineFilter?: Array<string>,
        public bladeOverViewItemFilter?: BladeOverviewItemFilter,
        public groupFilter?: string,
        public sortProperty?: string,
        public sortDirection: number = FindingsDataTableConstants.dataTableDefaultSortDirection,
        public pageSize: number = FindingsDataTableConstants.dataTableSizePerPage,
        public pageIndex: number = FindingsDataTableConstants.dataTableStartIndex
    ) {
    }
}

export class FindingsActionsDataTableFilterModel extends FindingsDataTableFilterModel {
    constructor(
        public id: string,
        public nodeId: string,
        public nodeType: NodeType,
        public defectAction: FindingGroupType,
        public quickFilters?: FindingsQuickFilterModel
    ) {
        super(nodeId, nodeType, quickFilters);
    }
}
