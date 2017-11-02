import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class SpinnerService {
    private loaderStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public loaderStatusEmmiter: Observable<boolean> = this.loaderStatus.asObservable();

    private hideSpinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public hideSpinnerEmmiter: Observable<boolean> = this.hideSpinner.asObservable();

    public routeName: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    requestSpinner(value: boolean) {
        this.loaderStatus.next(value);
    }

    setRouterName(value: string) {
        this.routeName.next(value);
    }

    disableSpinner(value: boolean) {
        this.hideSpinner.next(value);
    }
}
