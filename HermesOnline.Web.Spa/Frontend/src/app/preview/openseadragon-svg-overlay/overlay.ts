
import { AnnotationsDto } from '../../models/manager-view/common/model/defect-annotation';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const svgNS = 'http://www.w3.org/2000/svg';
declare var OpenSeadragon;

export class Overlay {
    private _viewer: any;
    private _id: any;
    private _deepZoomLinkImages: any;

    private _containerWidth = 0;
    private _containerHeight = 0;
    private _xOffset = {};
    private _yOffset = {};
    private imagesInfo: any;
    private _display = true;
    private _svg: any;
    private _node: any;

    constructor(viewer, id, deepZoomLinkImages) {
        this._viewer = viewer;
        this._id = id;
        this._deepZoomLinkImages = deepZoomLinkImages;
        this.imagesInfo = deepZoomLinkImages;

        this._viewer.addHandler('animation-finish', () => {
            this.resize();
        });


        this._svg = document.createElementNS(svgNS, 'svg');
        this._svg.style.position = 'absolute';
        this._svg.style.left = 0;
        this._svg.style.top = 0;
        this._svg.style.width = '0';
        this._svg.style.height = '0';

        this._viewer.canvas.appendChild(this._svg);
        this._node = document.createElementNS(svgNS, 'g');
        this._node.setAttribute('id', `overlay-${id}`);
        this._svg.appendChild(this._node);

        this._viewer.addHandler('open', () => {
            this.resize();

            const tracker = new OpenSeadragon.MouseTracker({
                element: viewer.container,
                moveHandler: (event) => {
                    const webPoint = event.position;
                    const viewportPoint = viewer.viewport.pointFromPixel(webPoint);
                    const imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
                    const y = imagePoint.y.toFixed(2);
                    this.updateDistanceToRoot(y);
                }
            });
            tracker.setTracking(true);
        });

        this._viewer.addHandler('resize', () => {
            this.resize();
        });
    };

    public node(findingId, x, y) {
        this._xOffset[findingId] = x;
        this._yOffset[findingId] = y;
        return this._node;
    }


    public resize() {
        const p = this._viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(0, 0), true);
        const temp = this._viewer.viewport.viewportToImageRectangle(this._viewer.viewport.getBounds());
        const scale = this._viewer.viewport._containerInnerSize.y / temp.height;

        this._node.setAttribute('transform', `scale(${scale})`);

        const paths = $(`#overlay-${this._id} path`);
        paths.each((index, path) => {
            const x = p.x + this._xOffset[path.id] * scale;
            const y = p.y + this._yOffset[path.id] * scale;
            path.setAttribute('stroke-width', (2 / scale).toString());
            path.setAttribute('transform', `translate(${x / scale}, ${y / scale})`);
        });

        const zoom = this._viewer.viewport.getZoom(true);
        $(`#zoomInfo-${this._id} strong`).text('Zoom: ' + zoom.toFixed(2));

        if (this._display) {
            this.show();
        } else {
            this.hide();
        }
    }

    public hide() {
        this._svg.style.width = '0';
        this._svg.style.height = '0';
    }

    public show() {
        this._svg.style.width = '100%';
        this._svg.style.height = '100%';
    }

    public display(display) {
        this._display = display;
        this.resize();
    }

    public addFinding(annotation: AnnotationsDto, annotationSelected: BehaviorSubject<string>) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttributeNS(null, 'id', annotation.id);
        path.setAttributeNS(null, 'fill', '#000000');
        path.setAttributeNS(null, 'stroke', annotation.color);
        path.setAttributeNS(null, 'd', annotationToSVG(annotation));
        path.setAttributeNS(null, 'stroke-width', '6');
        path.setAttributeNS(null, 'stroke-opacity', '1');
        path.setAttributeNS(null, 'fill-opacity', '0');
        this.node(annotation.id, annotation.xCenter, annotation.yCenter).appendChild(path);

        $(`#${annotation.id}`).on('click', function (e) {
            annotationSelected.next(annotation.id);
        });
    }

    public updateDistanceToRoot(yPoint) {
        let infoText;
        if (!this.imagesInfo) {
            infoText = 'N/A';
        } else {
            const imageIndex = this.imagesInfo.findIndex((obj) => {
                return obj.yOffset > yPoint;
            });

            if (imageIndex >= -1) {
                let filteredImage = this.imagesInfo[this.imagesInfo.length - 2];
                let filteredImageNext = this.imagesInfo[this.imagesInfo.length - 1];
                if (imageIndex > -1) {
                    filteredImage = this.imagesInfo[imageIndex - 1];
                    filteredImageNext = this.imagesInfo[imageIndex];
                }
                if (filteredImage != 'undefined') {
                    const distanceToRoot = filteredImage.distanceToRootMin + (filteredImage.distanceToRootMax - filteredImage.distanceToRootMin) / 2
                        + (yPoint - filteredImage.yOffset) / (filteredImageNext.yOffset - filteredImage.yOffset)
                        * (filteredImageNext.distanceToRootMin - filteredImage.distanceToRootMin);
                    infoText = distanceToRoot.toFixed(2);
                }
                else {
                    infoText = 'N/A'
                }
            }
            else {
                infoText = 'N/A';
            }
        }
        $(`#distanceToRoot-${this._id} strong`).text(`Distance to root: ${infoText}`);
    }
}

function annotationToSVG(annotationData: any) {
    let x = 0, y = 0;
    const xoffset = annotationData.xCenter;
    const yoffset = annotationData.yCenter;

    const contour = annotationData.shape;
    if (contour.length <= 0) {
        return;
    }

    x = (contour[0].x - xoffset);
    y = (contour[0].y - yoffset);
    let svg = 'M' + x.toString() + ',' + y.toString();
    for (let i = 1; i < contour.length; i++) {
        x = (contour[i].x - xoffset);
        y = (contour[i].y - yoffset);
        svg += 'L' + x.toString() + ',' + y.toString();
    }
    return svg;
}