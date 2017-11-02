const DefaultColor  = '#e6f8f6';

export class Tag {
    public id: string;
    public name: string;
    public description: string;
    public color: string;
    public createdOn: string;
    public modifiedBy: string;

    constructor(id?, name?, description?, color?, createdOn?, modifiedBy?) {
        this.id = id;
        this.name = name || '';
        this.description = description || '';
        this.color = color || DefaultColor;
        this.createdOn = createdOn || '';
        this.modifiedBy = modifiedBy || '';
    }
}

export class TagsTableFilterModel {
    constructor(public pageSize: number = 15,
        public sortProperty?: string,
        public sortDirection: number = 0,
        public pageIndex: number = 0) {
    }
}

export class TagsTableRowModel {
    public name;
    public description;
    public createdOn;
    public createdBy;
    public color;
}

export class TagsTableModel {
    tagsTableRows: TagsTableRowModel[];
    totalDisplayedRecords: number;
    totalRecords: number;
}
