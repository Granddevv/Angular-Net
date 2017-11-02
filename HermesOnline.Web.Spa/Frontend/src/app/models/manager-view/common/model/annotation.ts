// TODO After refactoring of finding image, this class should be deleted or refactored

import { Rectangle } from './rectangle';

export abstract class Annotation {
    protected papers: RaphaelPaper[] = [];
    protected focusedDefect: IDefect;
    protected showDefects: boolean = true;
    Defect: IDefect[] = [];
    thickness = 2;
    transparency = 1;

    constructor(public canvasElement: JQuery) {
    }

    public clearDefects = () => {
        this.papers.forEach((paper) => {
            paper.clear();
        });
    }

    protected abstract genEmptyDefect();

    private convertDefect(defectDatas: Array<any>) {
        defectDatas.forEach((defectData) => {
            if (defectData.shape) {
                let defect = this.genEmptyDefect();
                defect.id = defectData.id;
                defect.name = defectData.name;
                defect.color = defectData.color;
                defect.rect.x = defectData.xCenter;
                defect.rect.y = defectData.yCenter;
                defect.rect.height = defectData.height;
                defect.rect.width = defectData.width;
                defect.contour = defectData.shape;
                defect.pixelspermm = defectData.pixelsPerMM;
                this.Defect.push(defect);
            }
        });
    }

    protected setDefects = (defectDatas: Array<any>) => {
        this.convertDefect(defectDatas);
        let scaledFactor: IPoint = this.getScaleFactor();
        this.Defect.forEach((defect, index) => {
            let element;
            if (this.canvasElement) {
                this.canvasElement.css({ left: defect.rect.x * scaledFactor.x + 2 + 'px', top: defect.rect.y * scaledFactor.y + 2 + 'px' });
                this.canvasElement.addClass('overlay');
                element = this.canvasElement.get(0);
            } else {
                let div = document.createElement('div');
                div.className = 'overlay' + index.toString();
                element = div;
            }
            let paper = Raphael(element, defect.rect.x, defect.rect.y);
            this.papers.push(paper);
            this.addOverlay(defect, element);
        });

        this.PaintDefects();
    }

    protected abstract addOverlay(defect, div);

    protected abstract getScaleFactor(): IPoint;

    protected abstract attachEventsOnAnnotation(overlay, defect);

    protected PaintDefects = () => {

        if (!this.showDefects) return;

        let scaledFactor: IPoint = this.getScaleFactor();
        this.Defect.forEach((defect, index) => {
            let paper = this.papers[index];
            paper.clear();
            let scaledData = this.toSVG(defect, scaledFactor);
            paper.setSize(scaledData.scaledWidth, scaledData.scaledHeight);
            let c = paper.path(scaledData.svg).attr({
                'stroke': defect.color, 'stroke-width': this.thickness, 'stroke-opacity': this.transparency, 'fill': 'transparent'
            });

            if (this.focusedDefect == defect) {
                c.attr('fill', defect.color);
                c.attr('fill-opacity', 1);
                c.animate({ 'fill-opacity': 0.0, fill: defect.color }, 2000);
                this.focusedDefect = null;
            }
        });
    }

    protected toSVG(defect: IDefect, scaledFactor: IPoint) {
        let x = 0, y = 0;
        let xoffset = defect.rect.x;
        let yoffset = defect.rect.y;

        let contour = defect.contour;
        if (contour.length <= 0) return;

        x = (contour[0].x - xoffset) * scaledFactor.x;
        y = (contour[0].y - yoffset) * scaledFactor.y;
        let svg = 'M' + x.toString() + ' ' + y.toString();
        for (let i = 1; i < contour.length; i++) {
            x = (contour[i].x - xoffset) * scaledFactor.x;
            y = (contour[i].y - yoffset) * scaledFactor.y;
            svg += 'L' + x.toString() + ' ' + y.toString();
        }
        return { svg: svg, scaledWidth: defect.rect.width * scaledFactor.x, scaledHeight: defect.rect.height * scaledFactor.y };
    }
}

interface IDefect {
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
