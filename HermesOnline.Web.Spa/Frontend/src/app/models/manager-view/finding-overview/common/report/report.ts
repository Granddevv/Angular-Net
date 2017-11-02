import { IdText } from '../../../../shared/idtext';

export class Report {
    fileName: string;
    nodeId: string;
    siteName: IdText;
    turbineName: IdText;
    bladeName: IdText;

    constructor(fileName?, nodeId?, siteName?, turbineName?, bladeName?) {
        this.fileName = fileName || '';
        this.nodeId = nodeId || '';
        this.siteName = siteName || '';
        this.turbineName = turbineName || '';
        this.bladeName = bladeName || '';
    }
}
