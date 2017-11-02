export class UserActivityTableRowModel {
    public id: string;
    public viewType: string;
    public viewedOn: string;
    public path: string;
    public filters: string;
    public urlFilter: string;
}

export class UserActivityRequest {
    public url: string;
    public nodeType: string;
    public nodeId: string;
    public tabView: string;
    public rowId: string;
}
