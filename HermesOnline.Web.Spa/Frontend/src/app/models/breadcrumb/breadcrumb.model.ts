
import { IdValue } from "../manager-view/global/idvalue";

export class Breadcrumb {
    public region: IdValue;
    public country: IdValue;
    public site: IdValue;
    public turbine: IdValue;
    public blade: IdValue;
    public surface: string;
    public serialNumber: string;

    constructor() {
        this.region = new IdValue();
        this.country = new IdValue();
        this.site = new IdValue();
        this.turbine = new IdValue();
        this.blade = new IdValue();
        this.blade = new IdValue();
    }
}