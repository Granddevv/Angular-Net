
import { DeepZoomLinkQuickFilterModel } from './deep-zoom-link-quick-filter.model';
import { NodeType } from "../../../common/model/node-type";

export class DeepZoomDataTableConstants {
    public static readonly dataTableSizePerPage = 15;
    public static readonly dataTableStartIndex = 0;
    public static readonly dataTableDefaultSortDirection = 0;
}

export class DeepZoomDataTableFilterModel {
    constructor(
        public id: string,
        public type: NodeType,
        public quickFilters?: DeepZoomLinkQuickFilterModel,
        public excludeDeepZoomLinkId?,
        public isCompareToSameBlade?: boolean,
        public pageSize = DeepZoomDataTableConstants.dataTableSizePerPage,
        public sortProperty?: string,
        public sortDirection: number = DeepZoomDataTableConstants.dataTableDefaultSortDirection,
        public pageIndex = 0) {
    }
}
