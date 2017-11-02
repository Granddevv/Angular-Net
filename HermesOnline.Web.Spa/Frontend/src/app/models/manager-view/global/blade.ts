export class Blade {
    public id: string;
    public serialNumber: string;
    public severities: Array<string>;

    constructor(id?, serialNumber?, severities?) {
        this.id = id || '';
        this.serialNumber = serialNumber || '';
        this.severities = severities || new Array<string>();
    }
}
