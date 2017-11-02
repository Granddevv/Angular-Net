// TODO This class should be refactored
// Class should be written in TypeScript

import * as $ from 'jquery';

import { EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Overlay } from './overlay';
import { Ruler } from './ruler';
import { Measure } from './measure';

declare var OpenSeadragon;
const svgNS = 'http://www.w3.org/2000/svg';

OpenSeadragon.Viewer.prototype.svgOverlay = function (id, deepZoomLinkImages) {
  if (!this._svgOverlayInfo) {
    this._svgOverlayInfo = new Overlay(this, id, deepZoomLinkImages);
  }
  return this._svgOverlayInfo;
};

OpenSeadragon.Viewer.prototype.svgRuler = function (pixelsPerMM, id) {
  if (this._svgRulerInfo) {
    return this._svgRulerInfo;
  }
  this._svgRulerInfo = new Ruler(this, pixelsPerMM, id);
  this._svgRulerInfo.resize();

  return this._svgRulerInfo;
};

OpenSeadragon.Viewer.prototype.svgMeasure = function (pixelsPerMm, id) {
  if (this._svgMeasureInfo) {
    return this._svgMeasureInfo;
  }
  this._svgMeasureInfo = new Measure(this, pixelsPerMm, id);

  return this._svgMeasureInfo;
};

OpenSeadragon.Viewer.prototype.fullScreenActivated = function (fullScreenChanged: BehaviorSubject<boolean>) {
  this.addHandler('full-page', function (data) {
    fullScreenChanged.next(data.fullPage);
  });
};

OpenSeadragon.Viewer.prototype.animateSelectedFinding = function (findingId) {
  $('.deep-zoom-annotation-blink').removeClass('deep-zoom-annotation-blink');
  $(`#${findingId}`).addClass('deep-zoom-annotation-blink');
};
