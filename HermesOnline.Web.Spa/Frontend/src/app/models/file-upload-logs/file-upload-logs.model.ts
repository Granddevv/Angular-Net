export class FileUploadLogTableModel {
    fileUploadLogTableRows: FileUploadLogTableRowModel[];
    totalDisplayedRecords: number;
    totalRecords: number;
}

export class FileUploadLogTableRowModel {
    public id: string;
    public date: string;
    public title: string;
    public description: string;
    public fileName: string;
}

export class FileUploadLogTableFilterModel {
    constructor(public pageSize: number = 15,
        public sortProperty?: string,
        public sortDirection: number = 0,
        public pageIndex: number = 0) {
    }
}
