// tslint:disable:max-line-length
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpService } from '../../../app/services/common-services/http.service';
import { Observable } from 'rxjs/Rx';
import { BreadcrumbComponent } from '../../../app/manager-view/filter/breadcrumb/breadcrumb.component';
import { FindingsFilterManagerService } from '../../../app/services/common-services/findings-filter-manager.service';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('BreadcrumbComponentTest', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: FindingsFilterManagerService },
        { provide: HttpService }
      ]
    }).compileComponents();
  })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create BreadcrumbComponent', () => {
    expect(component).toBeTruthy();
  });

  it('blade title should be undefined on init', () => {
    const el = fixture.debugElement.query(By.css('#bladeTitle'));
    expect(el).toBeFalsy();
  });

  it('blade title should be dispalyed if turbineId is defined', () => {
    component.turbineId = '123456789';
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('#bladeTitle'));
    expect(el.nativeElement.innerText).toEqual('Blade');
  });

  it('blade title should be dispalyed if bladeId is defined', () => {
    component.bladeId = '123456789';
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('#bladeTitle'));
    expect(el.nativeElement.innerText).toEqual('Blade');
  });

  it('blade title should be dispalyed if defectId is defined', () => {
    component.defectId = '123456789';
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('#bladeTitle'));
    expect(el.nativeElement.innerText).toEqual('Blade');
  });

  it('surface title title should be dispalyed if defectId is defined', () => {
    component.defectId = '123456789';
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('#surfaceTitle'));
    expect(el.nativeElement.innerText).toEqual('Surface');
  });
});
