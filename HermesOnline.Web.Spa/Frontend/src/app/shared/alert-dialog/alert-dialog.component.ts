import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
    selector: 'app-alert-dialog',
    templateUrl: './alert-dialog.component.html',
    styleUrls: ['./alert-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AlertDialogComponent implements OnInit {

    public title: string;
    constructor(public dialogRef: MdDialogRef<AlertDialogComponent>) { }

    ngOnInit() {
    }

}
