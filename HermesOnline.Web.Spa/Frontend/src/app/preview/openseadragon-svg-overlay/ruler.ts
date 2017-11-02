import * as $ from 'jquery';

import { EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare var OpenSeadragon;
const svgNS = 'http://www.w3.org/2000/svg';

export class Ruler {

    private dragging = null;
    private pixelsPerMM: any;
    private _id: any;
    private _viewer: any;
    private _display: any;
    private _svg: any;
    private _node: any;
    private draggingOffset: any;

    constructor(viewer, pixelsPerMM, id) {
        this._viewer = viewer;
        this.pixelsPerMM = pixelsPerMM;
        this._id = id;
        this._display = true;

        this._svg = document.createElementNS(svgNS, 'svg');
        this._svg.setAttribute('id', `ruler-${id}`);
        this._svg.setAttribute('style', 'cursor: move');
        this._svg.style.position = 'relative';
        this._svg.style.left = 0 + 'px';
        this._svg.style.top = 30 + 'px';
        this._node = document.createElementNS(svgNS, 'g');
        this._svg.appendChild(this._node);
        this._viewer.canvas.appendChild(this._svg);


        this._viewer.addHandler('animation', () => {
            this.resize();
        });

        this._viewer.addHandler('open', () => {
            this.resize();
        });

        this._viewer.addHandler('resize', () => {
            this.resize();
        });

        $(this._svg).on('pointerdown touchstart', (e) => {
                e.stopPropagation();
            });

        $(`#ruler-${id}`).on('mousemove', (e) => {
            if (this.dragging) {
                this.dragging.offset({
                    top: e.pageY - this.draggingOffset.top,
                    left: e.pageX - this.draggingOffset.left
                });
            }
        });

        $(`#ruler-${id}`).on('mousedown', this._svg, (e) => {
            this.dragging = $(e.target);
            const position = $(e.target).position();
            this.draggingOffset = { top: e.pageY - position.top, left: e.pageX - position.left };
            e.stopPropagation();
        });

        $(document).on('mouseup', (e) => {
            if (this.dragging) {
                this.dragging = null;
                e.stopPropagation();
            }
        });
    }

    public node() {
        return this._node;
    }

    public display(display) {
        this._display = display;
        this.resize();
    }

    public hide() {
        this._svg.setAttribute('width', 0);
        this._svg.setAttribute('height', 0);
    }

    public resize() {
        const p = this._viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(0, 0), true);
        const imageRect = this._viewer.viewport.viewportToImageRectangle(this._viewer.viewport.getBounds());
        const scale = this._viewer.viewport._containerInnerSize.x / imageRect.width;
        const lengthRulerMm = this.calculateRulerSize(imageRect.width / this.pixelsPerMM);
        const lengthRulerPx = lengthRulerMm * this.pixelsPerMM * scale;
        this._svg.removeChild(this._node);
        this._node = this._node.cloneNode(false);
        this._node.appendChild(this.drawRuler(lengthRulerPx));
        this._node.appendChild(this.addRulerValues('0', 10, 20));
        this._node.appendChild(this.addRulerValues(`${lengthRulerMm}mm`, lengthRulerPx + 20, 20));
        this._node.appendChild(this.addRulerValues(`${lengthRulerMm}mm`, 30, lengthRulerPx + 55));
        this._svg.appendChild(this._node);

        if (this._display) {
            this._svg.setAttribute('width', lengthRulerPx + 50);
            this._svg.setAttribute('height', lengthRulerPx + 65);
        } else {
            this.hide();
        }
    }

    public drawRuler(lengthRulerPx): SVGPathElement {
        let scalePath = 'M 20 25 v 10 ';
        for (let i = 0; i < 5; ++i) {
            scalePath += 'h ' + (lengthRulerPx / 5).toString();
            if (i < 4) {
                scalePath += 'v -5 v 10 v -5';
            }
        }
        scalePath += 'v -10 v 20';

        scalePath += 'M 10 35 h 10';
        for (let i = 0; i < 5; ++i) {
            scalePath += 'v ' + (lengthRulerPx / 5).toString();
            if (i < 4) {
                scalePath += 'h -5 h 10 h -5';
            }
        }
        scalePath += 'h -10 h 20';
        const scaleElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        scaleElement.setAttributeNS(null, 'fill', '#000000');
        scaleElement.setAttributeNS(null, 'stroke', '#fea600');
        scaleElement.setAttributeNS(null, 'd', scalePath);
        scaleElement.setAttributeNS(null, 'stroke-width', '1');
        scaleElement.setAttributeNS(null, 'stroke-opacity', '1');
        scaleElement.setAttributeNS(null, 'fill-opacity', '0');
        scaleElement.setAttributeNS(null, 'pointer-events', 'none');
        return scaleElement;
    }

    public addRulerValues(value, x, y): SVGTextElement {
        const scaleText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        scaleText.setAttributeNS(null, 'x', x);
        scaleText.setAttributeNS(null, 'y', y);
        scaleText.setAttributeNS(null, 'text-anchor', 'middle');
        scaleText.setAttributeNS(null, 'font-family', 'Arial');
        scaleText.setAttributeNS(null, 'font-size', '14px');
        scaleText.setAttributeNS(null, 'stroke', 'none');
        scaleText.setAttributeNS(null, 'fill', '#fea600');
        scaleText.setAttributeNS(null, 'pointer-events', 'none');
        const textNode = document.createTextNode(value);
        scaleText.appendChild(textNode);
        return scaleText;
    }

    public calculateRulerSize(widthMm: number): number {
        const stand = Math.log(widthMm) / Math.log(10);
        const fac = Math.pow(10, Math.floor(stand));
        const variant = widthMm / fac;

        if (variant < 1.25) {
            return 0.05 * fac;
        } else if (variant < 2.5) {
            return 0.1 * fac;
        } else if (variant < 5) {
            return 0.2 * fac;
        } else {
            return 0.5 * fac;
        };
    }
}
