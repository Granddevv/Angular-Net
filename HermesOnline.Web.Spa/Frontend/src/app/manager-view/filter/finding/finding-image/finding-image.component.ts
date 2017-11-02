import { Component, ElementRef, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResponseContentType } from '@angular/http';
import { DownloadHelper } from '../../../../common/helpers/download.helper';
import { Image } from '../../../../models/manager-view/common/model/image';
import { ImageAnnotation } from '../../../../models/manager-view/common/model/image-annotation';
import { ImageService } from '../../../../services/data-services/image.service';
import { FindingsDataTableService } from '../../../../services/data-services/findings-data-table.service';
import { BaseDialog } from '../../../../common/component-framework/base-dialog';

@Component({
  selector: 'app-finding-image',
  templateUrl: './finding-image.component.html',
  styleUrls: ['finding-image.component.scss'],
  providers: [ImageService]
})
export class FindingimageComponent extends BaseDialog implements OnChanges {

  @Input() findingId: string;
  private annotation: ImageAnnotation;
  public image = new Image();
  private images = new Array<Image>();
  private outlineIsVisible = true;
  private scaleIsVisible = true;
  public imageExist: boolean;

  constructor(
    private imageService: ImageService,
    private findingsService: FindingsDataTableService,
    private route: ActivatedRoute,
    private elRef: ElementRef) {
    super();
  }

  downloadImage() {
    const image = jQuery(this.elRef.nativeElement).find('#defect-images .item.active img');
    const imageId = image.data('id');
    const response = this.imageService.getImageForDownload(this.findingId, imageId, this.outlineIsVisible, this.scaleIsVisible);
    DownloadHelper.downloadFileFromResponse(response);
  }

  ngOnChanges() {
    if (this.findingId) {
      this.loading = true;
      this.findingsService.getAnnotations(this.findingId).subscribe(annotations => {
        jQuery(this.elRef.nativeElement).find('#defect-images').empty();

        this.images = annotations.images;

        if (this.images.length > 0) {
          $.each(annotations.images, (index, image) => {

            const srcAttr = index !== 0 ? 'data-lazy-load-src' : 'src';

            const imageElement = `<div class='item'>
            <img class='img-responsive img-container' id='img' style='overflow: hidden;text-align: center; width: 100%;
            max-height: 320px; max-width: 520px;' ${srcAttr}='/api/defects/thumbnailresized/${image.id}' data-id='${image.id}'"/>
            </div>`;

            this.imageExist = true;
            if (this.imageExist) {
              jQuery(this.elRef.nativeElement).find('#defect-images').append(imageElement);
              jQuery(this.elRef.nativeElement).find('#defect-images .item:first').addClass('active');
              this.loading = false;
            }

            jQuery(this.elRef.nativeElement).find('#img').on('error', x => {
              this.imageExist = false;
              jQuery(this.elRef.nativeElement).find('#img').removeAttr('style').removeAttr('src').removeAttr('onclick');
              jQuery(this.elRef.nativeElement).find('#img').addClass('noImage');
              jQuery(this.elRef.nativeElement).find('#defect-images-canvas').hide();
              jQuery(this.elRef.nativeElement).find('#defect-scale-canvas').hide();
            });
          });

          jQuery(this.elRef.nativeElement)
            .find('#defect-images')
            .append('<div id="defect-images-canvas" style="position: absolute; top: 0;left: 0; font-size: 0px;"></div>');
          jQuery(this.elRef.nativeElement)
            .find('#defect-images')
            .append('<div id="defect-scale-canvas" style="width:100%; height:100px; position: absolute; top: 0;left: 0"></div>');
        }

        this.images = annotations.images;
        this.image = annotations.images[0];

        this.annotation = new ImageAnnotation(jQuery(this.elRef.nativeElement).find('#defect-images-canvas'), annotations.annotationData, jQuery(this.elRef.nativeElement).find('#defect-scale-canvas'));
        this.annotation.drawDefectScale(this.image.width);
        this.drawDefectOnImage();

        if (!this.outlineIsVisible) {
          jQuery(this.elRef.nativeElement).find('#defect-images-canvas').hide();
        }

        if (!this.scaleIsVisible) {
          jQuery(this.elRef.nativeElement).find('#defect-scale-canvas').hide();
        }
      });
    }
  }

  private drawDefectOnImage() {
    const image = jQuery(this.elRef.nativeElement).find('.item.active img');
    image.on('load', (e) => {
      this.annotation.setDefectsOnImages(image, this.images);

    });
  }

  private showOutline(isChecked: boolean): void {
    if (isChecked) {
      jQuery(this.elRef.nativeElement).find('#defect-images-canvas').show();
    } else {
      jQuery(this.elRef.nativeElement).find('#defect-images-canvas').hide();
    }
    this.outlineIsVisible = isChecked;
  }

  private showScale(isChecked: boolean): void {
    if (isChecked) {
      jQuery(this.elRef.nativeElement).find('#defect-scale-canvas').show();
    } else {
      jQuery(this.elRef.nativeElement).find('#defect-scale-canvas').hide();
    }
    this.scaleIsVisible = isChecked;
  }
}
