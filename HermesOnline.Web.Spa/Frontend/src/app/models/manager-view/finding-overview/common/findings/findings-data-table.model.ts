import { FindingsTableRowModel } from './findings-data-table-row.model';
import { Permissions } from '../../../../common/permissions.enum';

export class FindingsDataTableModel {
    findingsTableRows: FindingsTableRowModel[];
    totalRecords: number;
}

export class FindingsDataTableColumns {
    public static readonly DataQuality = { name: 'Data Quality', isDefault: false };
    public static readonly Severity = { name: 'Severity', isDefault: true };
    public static readonly Category = { name: 'Category', isDefault: true };
    public static readonly Layer = { name: 'Layer', isDefault: true };
    public static readonly R = { name: 'R [m]', isDefault: true };
    public static readonly T = { name: 'T [m]', isDefault: false };
    public static readonly L = { name: 'L [mm]', isDefault: true };
    public static readonly A = { name: 'A [mm²]', isDefault: true };
    public static readonly Site = { name: 'Site', isDefault: false };
    public static readonly Turbine = { name: 'Turbine', isDefault: true };
    public static readonly TurbineType = { name: 'Turbine Type', isDefault: false };
    public static readonly Platform = { name: 'Platform', isDefault: false };
    public static readonly Blade = { name: 'Blade', isDefault: true };
    public static readonly Surface = { name: 'Surface', isDefault: false };
    public static readonly InspectionDate = { name: 'Inspection Date', isDefault: false };
    public static readonly InspectionType = { name: 'Inspection Type', isDefault: false };
    public static readonly InspectionCompany = { name: 'Inspection Company', isDefault: false };
    public static readonly SerialNumber = { name: 'Finding Number', isDefault: false };
    public static readonly Selection = { name: 'Selection', isDefault: false };
    public static readonly Actions = {
        name: 'Actions', isDefault: true,
        permissions: [Permissions.EditFinding, Permissions.DeleteFinding, Permissions.ValidateDataQuality]
    };
}
