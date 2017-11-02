import { UserManagementQuickFilterModel } from './user-management-quick-filter-list.model';

export class UserManagementTableFilterModel {
    public pageSize: number;
    public pageIndex: number;
    public searchName: string;
    public statuses: Array<string>;
    public sortProperty?: string;
    public sortDirection: number;
    public quickFilters: UserManagementQuickFilterModel;

    constructor() {
        this.pageIndex = 0;
        this.pageSize = UserManagementTableModelConstants.dataTableSizePerPage;
        this.statuses = ['active', 'inactive'];
        this.sortDirection = 0;
    }
}

export class UserManagementTableRowModel {
    public id: string;
    public name: string;
    public email: string;
    public isActive: boolean;
    public firstName: string;
    public lastName: string;
    public phoneNumber: string;
    public groupId: string;
    public groupName: string;

    constructor(id?, email?, firstName?, lastName?, phoneNumber?, groupId?, isActive?, groupName?) {
        this.id = id || '';
        this.firstName = firstName || '';
        this.lastName = lastName || '';
        this.phoneNumber = phoneNumber || '';
        this.email = email || '';
        this.groupId = groupId || '';
        this.isActive = isActive;
        this.groupName = groupName || '';
    }
}

export class UserManagementTableModel {
    userManagmentTableRows: UserManagementTableRowModel[];
    totalDisplayedRecords: number;
    totalRecords: number;
}

export class UserManagementTableModelConstants {
    public static readonly dataTableSizePerPage = 15;
    public static readonly dataTableStartIndex = 0;
}

export class UserManagementDataTableColumns {
    public static readonly Name = 'Name';
    public static readonly Email = 'Email';
    public static readonly Status = 'Status';
    public static readonly Group = 'Group';
    public static readonly Actions = 'Actions';
}
