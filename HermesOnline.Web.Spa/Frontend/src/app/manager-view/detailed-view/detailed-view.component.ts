import { Component, Input, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NodeType } from '../../models/manager-view/common/model/node-type';
import { Surface } from '../../models/manager-view/common/model/surface';
import { DetailedViewFilterModel, DetailedViewDto } from '../../models/manager-view/detail-view/detailed-view.model';
import { DetailedViewService } from '../../services/data-services/detailed-view.service';
import { SeverityColorMapper } from '../../common/helpers/severity-color-mapper.helper';

@Component({
  selector: 'app-detailed-view',
  templateUrl: './detailed-view.component.html',
  styleUrls: ['./detailed-view.component.scss']
})
export class DetailedViewComponent implements AfterViewInit {
  filter: DetailedViewFilterModel;
  defects: DetailedViewDto[];
  globalOffsetX = 56;
  globalOffsetYps = 65;
  globalOffsetYle = 120;
  globalOffsetYss = 170;
  globalOffsetYte = 260;
  bladeLengthPx = 918;

  @Input() nodeType: NodeType;

  @ViewChild('bladeMapCanvas') bladeMapCanvas;

  constructor(
    private detailedViewService: DetailedViewService,
    private route: ActivatedRoute) {
  }

  ngAfterViewInit() {
    const canvas = this.bladeMapCanvas.nativeElement;
    const context = canvas.getContext('2d');
    canvas.height = 300;
    canvas.width = 1000;
    this.route.params.subscribe(params => {
      if (this.nodeType === NodeType.Turbine) {
        if (params['turbineId']) {
          this.filter = new DetailedViewFilterModel(params['turbineId'], NodeType.Turbine);
          this.detailedViewService.getData(this.filter).subscribe(data => {
            this.defects = data;
            this.defects.forEach(defect => {
              this.markDefectOnBladeMap(context, defect);
            });
          });
        }
      } else if (this.nodeType === NodeType.Blade) {
        if (params['bladeId']) {
          this.filter = { nodeId: params['bladeId'], nodeType: NodeType.Blade };
          this.detailedViewService.getData(this.filter).subscribe(data => {
            this.defects = data;
            this.defects.forEach(defect => {
              this.markDefectOnBladeMap(context, defect);
            });
          });
        }
      }
    });
  }

  private markDefectOnBladeMap(context, defect: DetailedViewDto, markerSize = 6, penSize = 6) {
    const x = this.xOffsetInImage(defect.bladeLength, defect.distanceToRoot, markerSize);
    const y = this.yOffsetInImage(defect, markerSize);
    const markerColor = SeverityColorMapper.getColorHexValueBySeverity(defect.severity);
    this.drawPoint(context, x, y, markerSize, penSize, markerColor);
  }

  private xOffsetInImage(bladeLenght: number, distToRoot: number, markerSize: number): number {
    return distToRoot * this.bladeLengthPx / bladeLenght - markerSize / 2 + this.globalOffsetX;
  }

  private yOffsetInImage(defect: DetailedViewDto, markerSize: number): number {
    if (defect.surface === Surface.LE) {
      return this.globalOffsetYle;
    }

    if (defect.surface === Surface.TE) {
      return this.globalOffsetYte;
    }

    if (defect.distToLe === -1) {
      if (defect.distToTe === -1) {
        defect.distToLe = 0;
      } else {
        defect.distToLe = defect.bladeWidth - defect.distToTe;
      }
    }
    if (defect.surface === Surface.PS) {
      return markerSize / 2 + this.globalOffsetYps - this.yPositionInBlade(defect);
    } else {
      return this.yPositionInBlade(defect) - markerSize / 2 + this.globalOffsetYss;
    }
  }

  private drawPoint(ctx, x, y, markerSize, penSize, markerColor) {
    ctx.beginPath();
    ctx.strokeStyle = markerColor;
    ctx.lineWidth = penSize;
    const radius = markerSize / 2;
    const centerX = x + radius;
    const centerY = y + radius;
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
    ctx.stroke();
  }

  private yPositionInBlade(defect: DetailedViewDto): number {
    const section1 = 0.06087;
    const section1OffsetPx = 5;
    const section1Fact = 20;
    const section2 = 0.13152;
    const refBladeWidth = 2.5;
    const refFact1 = 1.3;
    const refFact2 = 0.384615;
    const refFact3 = -0.057572;
    const bladeFact2 = 0.2444444;
    const bladeFact3 = -0.0327586;
    const distFact = defect.distanceToRoot / defect.bladeLength;

    if (distFact <= section1) {
      return section1OffsetPx + section1Fact * defect.distToLe / refFact1;
    }
    if (distFact <= section2) {
      const sectionWidth = refFact2 * (distFact - section1) + section1Fact;
      const bladeWidth = bladeFact2 * (distFact - section1) + refFact1;
      return defect.distToLe * sectionWidth / bladeWidth;
    }
    if (distFact > section2) {
      const sectionWidth = refFact3 * (distFact - section2) + section1Fact;
      const bladeWidth = bladeFact3 * (distFact - section2) + refFact1;
      return defect.distToLe * sectionWidth / bladeWidth / refBladeWidth;
    }
    return 0;
  }
}
