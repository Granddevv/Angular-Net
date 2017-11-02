import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html'
})
export class ConfirmationDialogComponent implements OnInit {

    public title: string;
    constructor(public dialogRef: MdDialogRef<ConfirmationDialogComponent>) { }

    ngOnInit() {
    }

}
