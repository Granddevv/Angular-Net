
import { NodeType } from '../common/model/node-type';
import { Surface } from '../common/model/surface';

export class DetailedViewFilterModel {
    constructor(
        public nodeId: string,
        public nodeType: NodeType
    ) { }
}

export class DetailedViewDto {
    constructor(
        public id: string,
        public surface: Surface,
        public severity: number,
        public distToLe: number,
        public distToTe: number,
        public distanceToRoot: number,
        public bladeLength: number,
        public bladeWidth: number,
        public name: string,
        public lpsReading: number
    ) { }
}

