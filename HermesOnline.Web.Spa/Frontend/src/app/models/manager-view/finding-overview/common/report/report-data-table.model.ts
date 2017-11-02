
import { ReportDataTableRowModel } from './report-data-table-row.model';
import { Permissions } from '../../../../common/permissions.enum';

export class ReportDataTable {
    reportTableRows: ReportDataTableRowModel[];
    totalDisplayedRecords: number;
    totalRecords: number;
}

export class ReportDataTableColumns {
    public static readonly Name = { name: 'Name', isDefault: true };
    public static readonly Site = { name: 'Site', isDefault: true };
    public static readonly Turbine = { name: 'Turbine', isDefault: true };
    public static readonly Blade = { name: 'Blade', isDefault: true };
    public static readonly QueueDate = { name: 'Queue date', isDefault: true };
    public static readonly Size = { name: 'Size (MB)', isDefault: true };
    public static readonly Actions = {
        name: 'Actions', isDefault: true,
        permissions: [Permissions.DeleteDeepZoomLinks]
    };
}
