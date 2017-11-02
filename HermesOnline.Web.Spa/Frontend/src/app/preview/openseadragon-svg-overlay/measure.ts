declare var OpenSeadragon;

export class Measure {

    private mousePressed = false;
    private firstX: any;
    private firstY: any;
    private firstPoint: any;
    private ctx: any;
    private viewer: any;
    private pixelsPerMm: any;
    private id: any;
    private openSeadragon: JQuery;

    constructor(viewer, pixelsPerMm, id) {
        this.viewer = viewer;
        this.pixelsPerMm = pixelsPerMm;
        this.id = id;
        const ctx = (<any>document.getElementById(`canvasDraw-${id}`)).getContext('2d');
        this.openSeadragon = $(`#openSeadragon-${id}`);
        ctx.canvas.height = this.openSeadragon.height();
        ctx.canvas.width = this.openSeadragon.width();
        this.ctx = ctx;


        $(`#canvasDraw-${id}`).mousedown((e) => {
            this.mousePressed = true;
            this.clearArea();
            this.firstX = e.pageX - this.openSeadragon.offset().left;
            this.firstY = e.pageY -this.openSeadragon.offset().top;
            const viewportPoint = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(this.firstX, this.firstY));
            this.firstPoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
        });

        $(`#canvasDraw-${id}`).mousemove((e) => {
            if (this.mousePressed) {
                this.clearArea();
                const x = e.pageX - this.openSeadragon.offset().left;
                const y = e.pageY - this.openSeadragon.offset().top;
                const dist = this.calculateDistance(e.pageX - this.openSeadragon.offset().left, e.pageY - this.openSeadragon.offset().top);
                this.draw(e.pageX - this.openSeadragon.offset().left, e.pageY - this.openSeadragon.offset().top, dist);
            }
        });

        $(`#canvasDraw-${id}`).mouseup((e) => {
            this.mousePressed = false;
        });

        $(`#canvasDraw-${id}`).mouseleave((e) => {
            this.mousePressed = false;
        });
    }

    private draw(x, y, distance) {
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = '#fea600';
        this.ctx.moveTo(this.firstX, this.firstY);
        this.ctx.lineTo(x, y);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.font = '14pt "Open Sans"';
        this.ctx.fillStyle = '#fea600';
        this.ctx.fillText(distance + ' mm', x + 10, y + 10);
    }

    private calculateDistance(x, y) {
        const viewportPoint = this.viewer.viewport.pointFromPixel(new OpenSeadragon.Point(x, y));
        const currentPoint = this.viewer.viewport.viewportToImageCoordinates(viewportPoint);
        const distance = Math.sqrt(Math.pow(currentPoint.x - this.firstPoint.x, 2) + Math.pow(currentPoint.y - this.firstPoint.y, 2));
        const distanceInMm = distance / this.pixelsPerMm;
        return (distanceInMm).toFixed(2);
    }

    private clearArea() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}