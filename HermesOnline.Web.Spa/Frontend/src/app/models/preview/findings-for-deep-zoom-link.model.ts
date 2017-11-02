
import { Surface } from "../../models/manager-view/common/model/surface";

export class FindingsForDeepZoomLinksDataTableConstants {
    public static readonly dataTableSizePerPage = 15;
    public static readonly dataTableStartIndex = 0;
    public static readonly dataTableDefaultSortDirection = 0;
}

export class FindingsForDeepZoomLinksDataTableFilterModel {
    constructor(
        public id: string,
        public surface: Surface,
        public inspectionId: string,
        public sortProperty?: string,
        public sortDirection: number = FindingsForDeepZoomLinksDataTableConstants.dataTableDefaultSortDirection,
        public pageSize: number = FindingsForDeepZoomLinksDataTableConstants.dataTableSizePerPage,
        public pageIndex: number = FindingsForDeepZoomLinksDataTableConstants.dataTableStartIndex
    ) {
    }
}

export class FindingsForDeepZoomLinksDataTableRowModel {
    id: string;
    type: string;
    distanceToRoot: string;
    lengthMm: string;
    areaMm2: string;
    turbineSerialNumber: string;
}

export class FindingsForDeepZoomLinksDataTableModel {
    findingsTableRows: FindingsForDeepZoomLinksDataTableRowModel[];
    totalRecords: number;
}

export class FindingsForDeepZoomLinksDataTableColumns {
    public static readonly SerialNumber = 'Serial number';
    public static readonly Name = 'Name';
    public static readonly Severity = 'Sev.';
    public static readonly R = 'R [m]';
    public static readonly L = 'L [mm]';
    public static readonly A = 'A [mm²]';
}
