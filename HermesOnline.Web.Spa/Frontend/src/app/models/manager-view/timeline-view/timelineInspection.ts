import { TimelineFinding } from './timelineFinding';

export interface TimelineInspection {
    id: string;
    inspectionDate: string;
    inspectionYear: string;
    findings: Array<TimelineFinding>;
};
