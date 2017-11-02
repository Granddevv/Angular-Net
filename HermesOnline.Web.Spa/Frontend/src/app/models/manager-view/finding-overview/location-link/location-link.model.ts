
import { FindingGroupType } from '../../common/model/finding-group-type';
import { NodeType } from '../../common/model/node-type';
import { QuickFilterListItemModel } from '../../../common/quick-filter-list-item.model';

export class LocationLinkDataTableConstants {
    public static readonly dataTableSizePerPage = 15;
    public static readonly dataTableStartIndex = 0;
    public static readonly dataTableDefaultSortDirection = 0;
}

export class LocationLinkDataTableFilterModel {
    public defectAction = FindingGroupType.LocationLink;

    constructor(
        public id: string,
        public nodeId: string,
        public nodeType: NodeType,
        public quickFilters?: LocationLinkQuickFilterModel,
        public sortProperty?: string,
        public sortDirection: number = LocationLinkDataTableConstants.dataTableDefaultSortDirection,
        public pageSize: number = LocationLinkDataTableConstants.dataTableSizePerPage,
        public pageIndex: number = LocationLinkDataTableConstants.dataTableStartIndex
    ) {
    }
}

export class LocationLinkQuickFilterModel {
    constructor(
        public severities = new Array<number>(),
        public categories = new Array<string>(),
        public layers = new Array<number>(),
        public surfaces = new Array<number>()
    ) { }
}

export class LocationLinkTableRowModel {
    id: string;
    serialNumber: string;
    type: string;
    severity: string;
    layer: string;
    surface: string;
    distanceToRoot: string;
    lengthMm: string;
    areaMm2: string;
    selected: boolean;
}

export class LocationLinkDataTableModel {
    findingsTableRows: LocationLinkTableRowModel[];
    totalRecords: number;
}

export class LocationLinkQuickFilterListModel {
    constructor(
        public severity = new Array<QuickFilterListItemModel>(),
        public category = new Array<QuickFilterListItemModel>(),
        public layer = new Array<QuickFilterListItemModel>(),
        public surface = new Array<QuickFilterListItemModel>()
    ) { }
}
