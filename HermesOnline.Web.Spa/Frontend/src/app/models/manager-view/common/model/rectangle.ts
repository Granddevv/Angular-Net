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
