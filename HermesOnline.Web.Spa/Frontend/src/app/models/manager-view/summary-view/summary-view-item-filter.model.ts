
import { Surface } from "../../../models/manager-view/common/model/surface";

export class SummaryViewItemFilter {
    public surface: Surface;
    public selectedMeters: Array<number>;

    constructor(surface: Surface, selectedMeters: Array<number>) {
        this.surface = surface;
        this.selectedMeters = selectedMeters;
    }
}
