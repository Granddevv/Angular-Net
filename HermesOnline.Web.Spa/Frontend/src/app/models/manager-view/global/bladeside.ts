export class BladeSide {
    public DefectId: string;
    public BladeId: string;
    public Severity: Array<string>;

    constructor(defectId?, bladeId?, severity?) {
        this.DefectId = defectId || '';
        this.BladeId = bladeId || '';
        this.Severity = severity || new Array<string>();
    }
}
