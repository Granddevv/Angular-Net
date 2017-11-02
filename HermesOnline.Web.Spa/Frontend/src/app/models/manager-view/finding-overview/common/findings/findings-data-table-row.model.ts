

import { NodeType } from "../../../common/model/node-type";

export class FindingsTableRowModel {
    id: string;
    severity: string;
    type: string;
    layer: string;
    distanceToRoot: string;
    distanceToTip: string;
    lengthMm: string;
    areaMm2: string;
    site: string;
    turbineSerialNumber: string;
    turbineName: string;
    turbineType: string;
    platform: string;
    blade: string;
    surface: string;
    actions: string;
    inspectionDate: string;
    inspectionType: string;
    inspectionCompany: string;
    serialNumber: string;
    dataQuality: string;
    selected: boolean;
    siteId: string;
    comment: string;

    constructor(id?, severity?, type?, layer?, comment?, dataQuality?) {
        this.id = id || '';
        this.severity = severity || '';
        this.type = type || '';
        this.layer = layer || '';
        this.comment = comment || '';
        this.dataQuality = dataQuality || '';
    }
}

export class FindingForDataQuality {
    id: string;
    type: NodeType;
    dataQuality: string;
    severity: string;
    category: string;
    layer: string;

    constructor(id?, dataQuality?, type?, severity?, category?, layer?) {
        this.id = id || '';
        this.dataQuality = dataQuality || '';
        this.type = type || '';
        this.severity = severity || '';
        this.category = category || '';
        this.layer = layer || '';
    }
}