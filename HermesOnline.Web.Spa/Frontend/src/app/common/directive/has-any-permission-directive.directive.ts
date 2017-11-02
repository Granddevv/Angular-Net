import { Directive, Input, Renderer, ElementRef, OnInit } from '@angular/core';
import { Permissions } from '../../models/common/permissions.enum';
import { PrincipalService } from '../../services/common-services/principal.service';

@Directive({
  selector: '[appHasAnyPermission]'
})
export class HasAnyPermissionDirective implements OnInit {

  @Input()
  permissions: Permissions[];

  constructor(private principalService: PrincipalService, private element: ElementRef, private renderer: Renderer) {
  }

  ngOnInit() {
    this.setElementVisibility();
  }

  private setElementVisibility() {
    if (this.principalService.hasAnyPermissions(this.permissions)) {
      this.elementShow();
    } else {
      this.elementHide();
    }
  }

  private elementShow() {
    this.renderer.setElementClass(this.element.nativeElement, 'hidden', false);
  }

  private elementHide() {
    this.renderer.setElementClass(this.element.nativeElement, 'hidden', true);
  }
}
