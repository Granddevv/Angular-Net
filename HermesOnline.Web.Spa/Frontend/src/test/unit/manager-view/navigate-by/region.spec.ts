// tslint:disable:max-line-length
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { RegionService } from '../../../../app/services/data-services/region.service';
import { HttpService } from '../../../../app/services/common-services/http.service';
import { RegionComponent } from '../../../../app/manager-view/filter/navigate-by/region/region.component';

describe('RegionComponentTest', () => {
    let component: RegionComponent;
    let fixture: ComponentFixture<RegionComponent>;
    let spy;
    let countryService;
    beforeEach(async(() => {
        RegionComponent
        TestBed.configureTestingModule({
            declarations: [RegionComponent],
            imports: [RouterTestingModule]
        }).compileComponents();
        TestBed.overrideComponent(RegionComponent, {
            set: {
                providers: [
                    { provide: RegionService, useClass: MockRegionService }
                ]
            }
        }).compileComponents();
    })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(RegionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });


    it('should create Region Component', () => {
        expect(component).toBeTruthy();
    });


    it('number of column should be 1 if there is no regions', () => {
        expect(component.numOfColumn([])).toBe(1);
    });


    it('number of column should be 1 if there is less than 12 regions', () => {
        expect(component.numOfColumn([1, 2])).toBe(1);
    });

    it('number of column should be 2.', () => {
        expect(component.numOfColumn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])).toBe(2);
    });
});

class MockRegionService {
    GetRegions(count: number): Observable<any> {
        let toReturn: Array<any> = [];
        return Observable.of([]);
    };
}