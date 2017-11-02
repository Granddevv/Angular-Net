export class AnnouncementsTableModel {
    announcementsTableRows: AnnouncementsTableRowModel[];
    totalDisplayedRecords: number;
    totalRecords: number;
}

export class AnnouncementsTableRowModel {
    public id: string;
    public date: string;
    public title: string;
    public description: string;
    public fileName: string;
}

export class AnnouncementsTableFilterModel {
    constructor(public pageSize: number = 15,
        public sortProperty?: string,
        public sortDirection: number = 0,
        public pageIndex: number = 0) {
    }
}

export class Announcement {
    public id: string;
    public title: string;
    public description: string;
    public fileName: string;
    public date: string;

    constructor(id?, title?, description?, fileName?, date?) {
        this.id = id || '';
        this.title = title || '';
        this.description = description || '';
        this.fileName = fileName || '';
        this.date = date || '';
    }
}