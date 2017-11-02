import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../services/common-services/spinner.service';

@Component({
    selector: 'app-admin',
    templateUrl: 'admin.component.html'
})
export class AdminComponent implements OnInit {
    requestCnt = 0;
    showSpinner: boolean;
    constructor(private spinnerService: SpinnerService) { }

    ngOnInit() {
        this.spinnerService.loaderStatusEmmiter.subscribe((val: boolean) => {
            if (val === true) {
                this.requestCnt++;
            } else if (val === false) {
                this.requestCnt--;
            }

            this.showSpinner = this.requestCnt > 0;
        });
    }
}
