export interface IDefect {
    name: string;
    rect: Rectangle;
    color: string;
    contour: any[];
    pixelspermm: number;
}

export interface IPoint {
    x: number;
    y: number;
}

export interface IRectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class Rectangle implements IRectangle {
    constructor(public x: number, public y: number, public width: number, public height: number) {
    }
}
