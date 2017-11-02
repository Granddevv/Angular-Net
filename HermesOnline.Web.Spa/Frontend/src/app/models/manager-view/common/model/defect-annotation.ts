

import { Image } from "./image";

export class DefectAnnotation {
    public images: Array<Image>;
    public annotationData: AnnotationsDto;
}

export class AnnotationsDto {
    public id: string;
    public serialNumber: string;
    public name: string;
    public color: string;
    public xCenter: number;
    public yCenter: number;
    public width: number;
    public height: number;
    public shape: PointDto[];
    public pixelsPerMM: number;
    public url: string;
}

export class PointDto {
    public x: number;
    public y: number;
}
