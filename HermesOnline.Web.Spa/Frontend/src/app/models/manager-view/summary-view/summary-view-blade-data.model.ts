export class SummaryViewBladeData {
    public severity: number;
    public meterFromRoot: number;

    constructor(severity: number, meterFromRoot: number) {
        this.severity = severity;
        this.meterFromRoot = meterFromRoot;
    }
}
