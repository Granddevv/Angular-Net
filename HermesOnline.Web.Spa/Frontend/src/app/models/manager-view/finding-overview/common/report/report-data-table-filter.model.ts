

import { NodeType } from "../../../common/model/node-type";

export class ReportTableConstants {
    public static readonly dataTableSizePerPage = 15;
    public static readonly dataTableStartIndex = 0;
    public static readonly dataTableDefaultSortDirection = 0
}

export class ReportTableFilterModel {
    constructor(
        public id: string,
        public type: NodeType,
        public pageSize = ReportTableConstants.dataTableSizePerPage,
        public sortProperty?: string,
        public sortDirection: number = ReportTableConstants.dataTableDefaultSortDirection,
        public pageIndex = 0) {
    }
}
