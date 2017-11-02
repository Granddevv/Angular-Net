export class LogTableModel {
    logTableRows: LogTableRowModel[];
    totalDisplayedRecords: number;
    totalRecords: number;
}

export class LogTableRowModel {
    public id: string;
    public host: string;
    public code: string;
    public type: string;
    public error: string;
    public user: string;
    public date: string;
    public source: string;
    public detail: string;
}

export class LogTableFilterModel {
    constructor(public pageSize: number = 15,
        public sortProperty?: string,
        public sortDirection: number = 0,
        public pageIndex: number = 0) {
    }
}

export class Log {
    public id: string;
    public host: string;
    public code: string;
    public type: string;
    public error: string;
    public user: string;
    public date: string;
    public source: string;
    public detail: string;

    constructor(id?, host?, code?, type?, error?, user?, date?, source?, detail?) {
        this.id = id || '';
        this.host = host || '';
        this.code = code || '';
        this.type = type || '';
        this.error = error || '';
        this.user = user || '';
        this.date = date || '';
        this.source = source || '';
        this.detail = detail || '';
    }
}