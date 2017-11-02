
import { FindingGroupType } from '../common/model/finding-group-type';
import { IdValue } from "./idvalue";

export class Defect {
    public id: string;
    public name: string;
    public severity: number;
    public layer: string;
    public imageSrc: string;
    public areaMM2: string;
    public lengthMM: string;
    public distanceToRoot: number;
    public bladeId: string;
    public turbineId: string;
    public siteId: string;
    public surface: string;
    public serialNumber: string;
    public pixelsPerMM: number;
    public country: IdValue;
    public region: IdValue;
    public isInGroup: boolean;
    public groupType: FindingGroupType;
};
