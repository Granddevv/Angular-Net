import { NodeType } from '../../../common/model/node-type';
import { QuickFilterListItemModel } from '../../../../common/quick-filter-list-item.model';

export class FindingForEdit {
    id: string;
    newSeverity: string;
    newType: string;
    newLayer: string;
    originalSeverity: string;
    originalType: string;
    originalLayer: string;
    comment: string;

    constructor(id?, newSeverity?, newType?, newLayer?, originalSeverity?, originalType?, originalLayer?, comment?) {
        this.id = id || '';
        this.newSeverity = newSeverity || '';
        this.newType = newType || '';
        this.newLayer = newLayer || '';
        this.originalSeverity = originalSeverity || '';
        this.originalType = originalType || '';
        this.originalLayer = originalLayer || '';
        this.comment = comment || '';
    }
}

export class DefectChangeLogsTableModel {
    defectChangeLogsTableRows: DefectChangeLogsTableRowModel[];
    totalDisplayedRecords: number;
    totalRecords: number;
}

export class DefectChangeLogsTableRowModel {
    public id: string;
    public dateModified: string;
    public originalSeverity: string;
    public originalLayer: string;
    public originalType: string;
    public newSeverity: string;
    public newLayer: string;
    public newType: string;
    public user: string;
    public site: string;
    public serialNumber: string;
    public comment: string;
    public defectId: string;

    constructor(id?, dateModified?, originalSeverity?, originalLayer?, originalType?, newSeverity?, newLayer?, newType?, user?, site?, serialNumber?, comment?, defectId?) {
        this.id = id || '';
        this.dateModified = dateModified || '';
        this.originalSeverity = originalSeverity || '';
        this.originalLayer = originalLayer || '';
        this.originalType = originalType || '';
        this.newSeverity = newSeverity || '';
        this.newLayer = newLayer || '';
        this.newType = newType || '';
        this.user = user || '';
        this.site = site || '';
        this.serialNumber = serialNumber || '';
        this.comment = comment || '';
        this.defectId = defectId || '';
    }
}

export class DefectChangeLogsTableFilterModel {
    constructor(public pageSize: number = 15,
        public pageIndex: number = 0,
        public sortProperty?: string,
        public sortDirection: number = 0,
        public quickFilters?: DefectChangeLogsQuickFilterModel) {
    }
}

export class DefectChangeLogDataTableColumns {
    public static readonly DateModified = { name: 'Date Modified', isDefault: true};
    public static readonly User = { name: 'User', isDefault: true};
    public static readonly OriginalLayer = { name: 'Original Layer', isDefault: true};
    public static readonly OriginalType =  { name: 'Original Type', isDefault: true};
    public static readonly OriginalSeverity =  { name: 'Original Severity', isDefault: true};
    public static readonly NewLayer = { name: 'New Layer', isDefault: true};
    public static readonly NewType =  { name: 'New Type', isDefault: true};
    public static readonly NewSeverity = { name: 'New Severity', isDefault: true};
    public static readonly Site =  { name: 'Site', isDefault: true};
    public static readonly SerialNumber = { name: 'Finding Number', isDefault: true};
    public static readonly Comment =  { name: 'Comment', isDefault: false};
    public static readonly Actions =  { name: 'Actions', isDefault: true};
}

export class DefectChangeLogQuickFilterListModel {
    constructor(
        public origanalSeverity = new Array<QuickFilterListItemModel>(),
        public originalCategory = new Array<QuickFilterListItemModel>(),
        public originalLayer = new Array<QuickFilterListItemModel>(),
        public site = new Array<QuickFilterListItemModel>(),
        public newSeverity = new Array<QuickFilterListItemModel>(),
        public newCategory = new Array<QuickFilterListItemModel>(),
        public newLayer = new Array<QuickFilterListItemModel>()
    ) { }
}

export class DefectChangeLogsQuickFilterModel {
    constructor(
        public originalTypes = new Array<string>(),
        public originalSeverities = new Array<string>(),
        public originalLayers = new Array<string>(),
        public newTypes = new Array<string>(),
        public newSeverities = new Array<string>(),
        public newLayers = new Array<string>(),
        public siteIds = new Array<string>(),
    ) { }
}