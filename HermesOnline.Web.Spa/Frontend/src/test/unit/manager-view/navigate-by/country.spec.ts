// tslint:disable:max-line-length
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { CountryComponent } from '../../../../app/manager-view/filter/navigate-by/country/country.component';
import { CountryService } from '../../../../app/services/data-services/country.service';
import { RegionService } from '../../../../app/services/data-services/region.service';
import { HttpService } from '../../../../app/services/common-services/http.service';

describe('CountryComponentTest', () => {
    let component: CountryComponent;
    let fixture: ComponentFixture<CountryComponent>;
    let spy;
    let countryService;
    beforeEach(async(() => {
        CountryComponent
        TestBed.configureTestingModule({
            declarations: [CountryComponent],
            imports: [RouterTestingModule],
        }).compileComponents();
        TestBed.overrideComponent(CountryComponent, {
            set: {
                providers: [
                    { provide: CountryService, useClass: MockCountryService },
                    { provide: RegionService, useClass: MockRegionService }
                ]
            }
        }).compileComponents();
    })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(CountryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create CountryComponent', () => {
        expect(component).toBeTruthy();
    });

    it('should have 1 columns', () => {
        expect(component.getNumOfColumn([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toEqual(1);
    });

    it('should have 2 columns', () => {
        expect(component.getNumOfColumn([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])).toEqual(2);
    });
});

class MockCountryService {
    GetCountries(count: number): Observable<any> {
        let toReturn: Array<any> = [];
        return Observable.of([]);
    };
}

class MockRegionService {
    GetRegions(count: number): Observable<any> {
        let toReturn: Array<any> = [];
        return Observable.of([]);
    };
}


