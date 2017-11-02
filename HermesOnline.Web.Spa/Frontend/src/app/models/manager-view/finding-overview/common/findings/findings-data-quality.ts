export enum DataQuality {
    Good = 0,
    GoodApproved = 1,
    Medium = 2,
    MediumApproved = 3,
    Bad = 4,
    BadApproved = 5
}

export class DefectChangedQuality {
    id: string;
    updatedQuality: string;
    siteId: string;

    constructor(id?, updatedQuality?, siteId?) {
        this.id = id || '';
        this.updatedQuality = updatedQuality || '';
        this.siteId = siteId || '';
    }
}
