

import { DeepZoomLinkDataTableRowModel } from './deep-zoom-link-data-table-row.model';

export class DeepZoomLinkDataTable {
    deepZoomLinkTableRows: DeepZoomLinkDataTableRowModel[];
    totalDisplayedRecords: number;
    totalRecords: number;
}

export class DeepZoomLinkDataTableColumns {
    public static readonly WindFarm = { name: 'Windfarm', isDefault: true };
    public static readonly TurbineSerial = { name: 'Turbine Serial', isDefault: true };
    public static readonly Turbine = { name: 'Turbine', isDefault: true };
    public static readonly Blade = { name: 'Blade', isDefault: true };
    public static readonly Surface = { name: 'Surface', isDefault: true };
    public static readonly Date = { name: 'Date', isDefault: true };
    public static readonly PhotoSource = { name: 'Photo sources', isDefault: true };
    public static readonly Inspection = { name: 'Inspection', isDefault: true };
    public static readonly Actions = { name: 'Actions', isDefault: true };
}
