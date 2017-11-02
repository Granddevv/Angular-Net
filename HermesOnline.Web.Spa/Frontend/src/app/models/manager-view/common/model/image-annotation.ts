import { Annotation, IPoint } from './annotation';
import { Rectangle } from './rectangle';

export class ImageAnnotation extends Annotation {

    imageElement: JQuery;
    imageData;
    defectData;
    onClickAnnotation: (defect, imageId) => void;
    canvasScaleElement: JQuery;

    constructor(canvasElement: JQuery, defectData, convasScaleElement: JQuery = null) {
        super(canvasElement);
        this.defectData = defectData;
        this.canvasScaleElement = convasScaleElement;
    }

    public drawDefectScale(imageWidth: number) {
        if (!this.canvasScaleElement) {
            throw Error('CanvasScaleElement is not defined');
        }

        if (this.defectData.pixelsPerMM === 0) { return; };

        const widthMm = imageWidth / this.defectData.pixelsPerMM;
        const lengthRulerMm = this.getLengthRulerMm(widthMm);
        const imageScreenWidth = this.canvasScaleElement.width();

        const lengthRulerPx = (imageScreenWidth * lengthRulerMm) / widthMm;

        if (lengthRulerPx <= 0) {
            return;
        }

        const canvas = <HTMLCanvasElement>$('<canvas id="scaleConvas" width="' + (lengthRulerPx + 100) + '" height="100px">')[0];
        this.canvasScaleElement.append(canvas);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        const startX = 20;
        const endX = lengthRulerPx + startX;
        const centarY = 50;

        ctx.strokeStyle = '#fea600';
        ctx.lineWidth = 0.5;
        ctx.moveTo(startX, centarY);
        ctx.lineTo(endX, centarY);
        ctx.stroke();

        ctx.moveTo(startX, centarY - 5);
        ctx.lineTo(startX, centarY + 5);
        ctx.stroke();

        ctx.moveTo(endX, centarY - 5);
        ctx.lineTo(endX, centarY + 5);
        ctx.stroke();

        for (let i = 1; i <= 5; i++) {
            ctx.moveTo(startX + i * lengthRulerPx * 0.2, centarY);
            ctx.lineTo(startX + i * lengthRulerPx * 0.2, centarY - 3);
            ctx.stroke();
        }

        ctx.fillStyle = '#fea600';
        ctx.font = '17px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('0', startX, centarY - 15);
        ctx.textAlign = 'left';
        ctx.fillText(lengthRulerMm.toString() + 'mm', endX - 5, centarY - 15);
    }

    // Finds ruler length that is approximately 1/6 of imageWidth, but
    // is found to nearest 10, 25, 50, 100, 250, etc, based on size.
    private getLengthRulerMm(imageWidthMm: number) {
        const approximateLength = Math.floor(imageWidthMm / 6);
        if (approximateLength < 25) {
            return approximateLength;
        }
        const factors = [2, 2.5, 2];
        let currTotalFactor = 5;
        let nextCutoff = 25;
        let factorIndex = 0;
        while (true) {
            if (approximateLength < nextCutoff) {
                break;
            }
            const nextFactor = factors[factorIndex];
            currTotalFactor *= nextFactor;
            nextCutoff *= nextFactor;
            factorIndex = (factorIndex + 1) % factors.length;
        }
        return this.roundToNearest(approximateLength, currTotalFactor);
    }

    private roundToNearest(number: number, factor: number) {
        const sign = number >= 0 ? 1 : -1;
        const absVal = Math.abs(number);
        const remainder = absVal % factor;
        if (remainder < factor / 2) {
            return sign * (absVal - remainder);
        }
        return sign * (absVal + (factor - remainder));
    }

    public setDefectsOnImages(imageEl: JQuery, images: any[]) {
        const imageData = this.findImage(imageEl, images);
        if (imageData.length > 0) {
            this.setDefectsOnImage(imageEl, imageData[0]);
        } else {
            this.canvasElement.empty();
        }
    }

    public setDefectsOnImage(imageEl: JQuery, image) {
        if (image && image.isRef) {
            this.imageElement = imageEl;
            this.imageData = image;
            this.setDefects([this.defectData]);
        } else {
            this.canvasElement.empty();
        }
    }

    private findImage(imageEl: JQuery, images: any[]) {
        const imageId = imageEl.data('id');
        return images.filter((item) => item.id === imageId);
    }

    protected genEmptyDefect() {
        const defect = { name: '', rect: new Rectangle(0, 0, 0, 0), color: 'yellow', contour: null };
        return defect;
    }

    protected getScaleFactor(): IPoint {
        return { x: this.imageElement.width() / this.imageData.width, y: this.imageElement.height() / this.imageData.height };
    }

    protected addOverlay(defect, div) {
        // not implemented
    }

    protected attachEventsOnAnnotation(overlay, defect) {
        const onClick = (e) => {
            this.onClickAnnotation(defect, this.imageData.Id);
        };
        overlay.click(onClick);
    }
}